// 🔥 YOUR ORIGINAL FILE — ONLY ADDED CONSOLE LOGS TO VERIFY VALUES

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { ConfidentialClientApplication } from "@azure/msal-node";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'https://academyforexcellence-frontend.onrender.com',
  'http://localhost:4028',
  'https://academyfo3074back.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// MSAL config for Business Central
const msalConfig = {
  auth: {
    clientId: process.env.BC_CLIENT_ID?.trim(),
    authority: `https://login.microsoftonline.com/${process.env.BC_TENANT_ID?.trim()}`,
    clientSecret: process.env.BC_CLIENT_SECRET?.trim(),
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Get OAuth token for BC
async function getToken() {
  const tokenResponse = await cca.acquireTokenByClientCredential({
    scopes: ["https://api.businesscentral.dynamics.com/.default"],
  });
  console.log("=========================================");
  console.log("🔑 Successfully acquired token");
  console.log("=========================================");

  return tokenResponse.accessToken;
}

// Utility to clean strings
function cleanString(str) {
  return str?.replace(/[\r\n\t]/g, "").trim();
}

app.get("/bc/companies", async (req, res) => {
  try {
    // 🔥🔥🔥 NEW - LOG FRONTEND VALUES
    console.log("=========================================");
    console.log("📥 Incoming Query Params (for /bc/companies):", req.query);

    const envName = req.query.env?.trim();
    if (!envName) return res.status(400).json({ error: "Missing env parameter" });

    const tenantId = process.env.BC_TENANT_ID?.trim();
    const token = await getToken();

    const url = `https://api.businesscentral.dynamics.com/v2.0/${tenantId}/${envName}/api/v2.0/companies`;

    console.log("📡 Fetching BC Companies from:", url);
    console.log("🔑 Tenant ID:", tenantId);
    console.log("🌍 Env:", envName);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
    });

    console.log("✅ Companies fetched:", response.data?.value?.length || 0);
    console.log("=========================================");

    res.json(response.data);
  } catch (err) {
    console.log("=========================================");
    console.error("❌ Error fetching companies:", err.response?.data || err.message);
    console.log("=========================================");

    res.status(err.response?.status || 500).json({
      error: "Failed to fetch companies",
      details: err.response?.data || err.message,
    });
  }
});

// -----------------------------------------------------------
// 🔥 NEW: Fetch BC Environments from Admin Center API
// -----------------------------------------------------------
app.get("/bc/environments", async (req, res) => {
  try {
    console.log("\n=========================================");
    console.log("📥 Incoming Request: GET /bc/environments");

    const tenantId = process.env.BC_TENANT_ID?.trim();
    const token = await getToken();

    const url = `https://api.businesscentral.dynamics.com/admin/v2.28/applications/environments`;

    console.log("📡 Fetching environments from:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    });

    const allEnvironments = response.data?.value || [];

    // 🔥🔥 NEW — FILTER ONLY ACTIVE ENVIRONMENTS
    const activeEnvironments = allEnvironments.filter(env => env.status === "Active");

    console.log("🟢 Active environments:", activeEnvironments.length);
    console.log("=========================================");


    // Return cleaned fields
    const environments = activeEnvironments.map(env => ({
      name: env.name,
      friendlyName: env.friendlyName,
      type: env.type,
      status: env.status,
      region: env.geoName || env.geo,
      id: env.id,
      url: env.webServiceUrl
    }));

    res.json({ value: environments });

  } catch (err) {
    console.error("❌ Error fetching environments:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch environments",
      details: err.response?.data || err.message,
    });
  }
});


// Proxy all /api/* requests to BC
app.all("/api/*", async (req, res) => {
  try {
    
    const token = await getToken();

    const fullUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    let bcEndpoint = fullUrl.pathname.replace(/^\/api/, "");
    let queryString = fullUrl.search || "";
    // Log the full original URL from frontend
    console.log("=========================================");

    console.log("📥 Full frontend request URL:", req.originalUrl);

    // CLEAN
    bcEndpoint = cleanString(bcEndpoint);
    queryString = cleanString(queryString);

    // 🔥🔥🔥 ADDED — frontend can now send env & companyId dynamically

    console.log("📥 Incoming Query Params (for /api/*):", req.query);


    const dynamicEnv = req.query.env || process.env.BC_ENVIRONMENT;
    const dynamicCompanyId = req.query.companyId || process.env.BC_COMPANY_ID;

    // 🔥🔥🔥 NEW - LOG RECEIVED VALUES
    console.log("📥 Incoming Request to /api/*");
    console.log("🌍 Received ENV from Frontend:", req.query.env);
    console.log("🏢 Received Company ID from Frontend:", req.query.companyId);
    console.log("🌍 Using Dynamic ENV:", dynamicEnv);
    console.log("🏢 Using Dynamic Company ID:", dynamicCompanyId);


    // BUILD URL
    const bcBaseUrl = cleanString(process.env.BC_BASE_URL);
    const bcTenantId = cleanString(process.env.BC_TENANT_ID);
    const bcVersion = cleanString(process.env.BC_API_VERSION);

    const bcUrl = `${bcBaseUrl}/v2.0/${bcTenantId}/${dynamicEnv}/api/alletec/learning/${bcVersion}/companies(${dynamicCompanyId})${bcEndpoint}${queryString}`;

    console.log("📡 Backend calling Business Central URL:", bcUrl);

    const response = await axios({
      method: req.method.toLowerCase(),
      url: bcUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      data: ["post", "patch", "put"].includes(req.method.toLowerCase())
        ? req.body
        : undefined,
    });
    console.log("=========================================");

    res.json(response.data);
  } catch (err) {
    console.log("=========================================");

    console.error("❌ Error in BC proxy:", err.response?.data || err.message);
    console.log("=========================================");

    res.status(err.response?.status || 500).json({
      error: "Failed to fetch from Business Central",
      details: err.response?.data || err.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);
