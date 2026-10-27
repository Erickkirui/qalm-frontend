// src/config/api.js

// Point directly to your local Flask server
const DEFAULT_API_PREFIX = "https://qalm-tek-api.onrender.com/api/qalm";

export const getApiPrefix = () => {
  return localStorage.getItem("api_prefix") || DEFAULT_API_PREFIX;
};

export const setApiPrefix = (prefix) => {
  prefix = prefix.replace(/\/+$/, "");
  if (!prefix.startsWith("http") && !prefix.startsWith("/")) {
    prefix = `/${prefix}`;
  }
  localStorage.setItem("api_prefix", prefix);
};

export const clearApiPrefix = () => {
  localStorage.removeItem("api_prefix");
};