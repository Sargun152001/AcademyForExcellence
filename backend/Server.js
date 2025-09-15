import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { ConfidentialClientApplication } from "@azure/msal-node";

dotenv.config();

const app = express();
app.use(express.json());

const msalConfig = {
  auth: {
    clientId: process.env.BC_CLIENT_ID?.trim(),
    authority: `https://login.microsoftonline.com/${process.env.BC_TENANT_ID?.trim()}`,
    clientSecret: process.env.BC_CLIENT_SECRET?.trim(),
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getToken() {
  const tokenResponse = await cca.acquireTokenByClientCredential({
    scopes: ["https://api.businesscentral.dynamics.com/.default"],
  });
  console.log("🔑 Successfully acquired token");
  return tokenResponse.accessToken;
}

function cleanString(str) {
  return str?.replace(/[\r\n\t]/g, "").trim();
}


app.all("/api/*", async (req, res) => {
  try {
    const token = await getToken();

    
    const fullUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    let bcEndpoint = fullUrl.pathname.replace(/^\/api/, "");
    let queryString = fullUrl.search || "";

    
    bcEndpoint = cleanString(bcEndpoint);
    queryString = cleanString(queryString);

   
    const bcBaseUrl = cleanString(process.env.BC_BASE_URL);    
    const bcTenantId = cleanString(process.env.BC_TENANT_ID);
    const bcEnv = cleanString(process.env.BC_ENVIRONMENT);     
    const bcVersion = cleanString(process.env.BC_API_VERSION); 
    const companyId = cleanString(process.env.BC_COMPANY_ID);

    
    const bcUrl = `${bcBaseUrl}/v2.0/${bcTenantId}/${bcEnv}/api/alletec/learning/${bcVersion}/companies(${companyId})${bcEndpoint}${queryString}`;

    console.log("📡 Backend calling Business Central URL:", bcUrl);

   
    const response = await axios({
      method: req.method.toLowerCase(),
      url: bcUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      data: ["post", "patch", "put"].includes(req.method.toLowerCase()) ? req.body : undefined,
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Error in BC proxy:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch from Business Central",
      details: err.response?.data || err.message,
    });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Backend running on port ${PORT}`));
