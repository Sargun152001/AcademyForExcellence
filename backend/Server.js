import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import { ConfidentialClientApplication } from "@azure/msal-node";
import redis from "ioredis";
 
dotenv.config();
 
const app = express();
app.use(express.json());
 
// Enhanced Redis initialization with error handling
const redisClient = new redis(process.env.REDIS_URL, {
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  reconnectOnError: (err) => {
    console.log('🔄 Redis reconnecting due to error:', err.message);
    return true;
  }
});
 
// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});
 
redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});
 
redisClient.on('ready', () => {
  console.log('🔄 Redis client ready');
});
 
redisClient.on('close', () => {
  console.log('🔌 Redis connection closed');
});
 
 
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
  const cacheKey = 'bc_access_token';
 
  // Only try Redis if it's available and connected
  if (redisClient && redisClient.status === 'ready') {
    try {
      const cachedToken = await redisClient.get(cacheKey);
      if (cachedToken) {
        const tokenData = JSON.parse(cachedToken);
        console.log("🔑 Retrieved token from Redis cache");
        return tokenData.access_token;
      }
    } catch (error) {
      console.log("⚠️ Redis cache read error:", error.message);
      // Continue to get fresh token
    }
  } else {
    console.log("⚠️ Redis not ready - status:", redisClient?.status || 'unavailable');
  }
 
  try {
    // Get new token from Azure AD
    console.log("🔄 Acquiring new token from Azure AD");
    const tokenResponse = await cca.acquireTokenByClientCredential({
      scopes: ["https://api.businesscentral.dynamics.com/.default"],
    });
 
    // Cache token in Redis if available and ready
    if (redisClient && redisClient.status === 'ready') {
      try {
        const expiresIn = tokenResponse.expiresOn
          ? Math.floor((new Date(tokenResponse.expiresOn).getTime() - Date.now()) / 1000)
          : 3300; // Default 55 minutes
 
        await redisClient.setex(cacheKey, expiresIn, JSON.stringify({
          access_token: tokenResponse.accessToken,
          expires_at: tokenResponse.expiresOn
        }));
        console.log("💾 Token cached in Redis (expires in", Math.floor(expiresIn / 60), "minutes)");
      } catch (cacheError) {
        console.log("⚠️ Failed to cache token in Redis:", cacheError.message);
        // Continue anyway - we have the token
      }
    }
 
    console.log("🔑 Successfully acquired new token");
    return tokenResponse.accessToken;
  } catch (error) {
    console.error("❌ Failed to acquire token:", error.message);
    throw error;
  }
}
 
 
// Utility to clean strings
function cleanString(str) {
  return str?.replace(/[\r\n\t]/g, "").trim();
}
 
// Proxy all /api/* requests to BC
app.all("/api/*", async (req, res) => {
  try {
    const token = await getToken();
 
    // Build BC endpoint and query
    const fullUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
    let bcEndpoint = fullUrl.pathname.replace(/^\/api/, "");
    let queryString = fullUrl.search || "";
 
    bcEndpoint = cleanString(bcEndpoint);
    queryString = cleanString(queryString);
 
    // Build full BC URL
    const bcBaseUrl = cleanString(process.env.BC_BASE_URL);
    const bcTenantId = cleanString(process.env.BC_TENANT_ID);
    const bcEnv = cleanString(process.env.BC_ENVIRONMENT);
    const bcVersion = cleanString(process.env.BC_API_VERSION);
    const companyId = cleanString(process.env.BC_COMPANY_ID);
 
    const bcUrl = `${bcBaseUrl}/v2.0/${bcTenantId}/${bcEnv}/api/alletec/learning/${bcVersion}/companies(${companyId})${bcEndpoint}${queryString}`;
 
    console.log("📡 Backend calling Business Central URL:", bcUrl);
 
    // Forward request to BC
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
 
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error in BC proxy:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to fetch from Business Central",
      details: err.response?.data || err.message,
    });
  }
});
 
 
// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis connection closed');
  }
  process.exit(0);
});
 
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis connection closed');
  }
  process.exit(0);
});
 
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on port ${PORT}`)
);