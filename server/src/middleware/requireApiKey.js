const { getConfiguredApiKeys } = require("../config/auth");

function getApiKeyFromRequest(req) {
  const apiKey = req.headers["x-api-key"];
  return typeof apiKey === "string" ? apiKey.trim() : "";
}

function requireApiKey(req, res, next) {
  const apiKey = getApiKeyFromRequest(req);
  if (!apiKey) {
    return res.status(401).json({ error: "Missing API key" });
  }

  const configuredApiKeys = getConfiguredApiKeys();
  if (!configuredApiKeys.length) {
    return res.status(500).json({ error: "Server API keys are not configured" });
  }

  if (!configuredApiKeys.includes(apiKey)) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  req.apiKey = apiKey;
  next();
}

module.exports = {
  requireApiKey,
  getApiKeyFromRequest,
};
