"use strict";
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3500,
  },
  db: {
    name: process.env.DEV_DB_NAME || "techDev",
    password: process.env.DEV_APP_PASSWORD,
    domain: process.env.DEV_DB_DOMAIN,
    extra: process.env.DEV_DB_EXTRA,
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3500,
  },
  db: {
    domain: process.env.DEV_DB_DOMAIN,
    name: process.env.PRO_DB_NAME || "techDev",
    extra: process.env.DEV_DB_EXTRA,
    password: process.env.PRO_APP_PASSWORD,
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
