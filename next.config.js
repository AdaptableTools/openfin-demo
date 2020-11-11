const withCSS = require("@zeit/next-css");
require("dotenv").config();

const path = require("path");
const Dotenv = require("dotenv-webpack");
/**
 * This is here to make nextjs compile the src folder, which is outside the examples folder
 */

const withEnv = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.plugins = config.plugins || [];

      config.plugins = [
        ...config.plugins,

        // Read the .env file
        new Dotenv({
          path: path.join(__dirname, ".env"),
          systemvars: true,
        }),
      ];

      return config;
    },
  });
};
module.exports = withCSS({
  ...withEnv(),
  pageExtensions: ["page.tsx", "page.ts", "page.js"],
});
