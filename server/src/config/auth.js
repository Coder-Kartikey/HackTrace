function parseApiKeys(value = "") {
  return value
    .split(",")
    .map((apiKey) => apiKey.trim())
    .filter(Boolean);
}

function getConfiguredApiKeys() {
  return parseApiKeys(process.env.API_KEYS || process.env.API_KEY || "");
}

module.exports = {
  parseApiKeys,
  getConfiguredApiKeys,
};
