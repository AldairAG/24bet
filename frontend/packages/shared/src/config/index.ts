// packages/shared/src/config/index.ts
export interface SharedConfig {
  API_URL: string;
  NODE_ENV: string;
}

let config: SharedConfig | null = null;

export const setConfig = (newConfig: SharedConfig) => {
  config = newConfig;
};

export const getConfig = (): SharedConfig => {
  if (!config) return { API_URL: "http://localhost:8080/24bet", NODE_ENV: "" };
  return config;
};
