// Environment-aware API URL configuration

const isDev = import.meta.env.DEV;
const BACKEND_URL = isDev ? "" : "https://enigma-lander-backend.vercel.app";

export const getApiUrl = (path: string): string => {
  return `${BACKEND_URL}${path}`;
};
