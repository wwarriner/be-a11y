import fs from "fs";
import chalk from "chalk";

/**
 * Loads config with defaults if missing values.
 *
 * @param {string} configFile
 * @returns {object} Normalized config object
 */
export default function configuration(configFile) {
  let config = {};
  try {
    config = JSON.parse(fs.readFileSync(configFile, "utf-8"));
  } catch (err) {
    console.warn(
      chalk.yellow(
        "⚠️  No config file found or invalid JSON. Using default rules."
      )
    );
    config.rules = {};
    // config.allowedExtensions = {};
    // config.excludedDirs = {};
  }

  config.rules ??= {};
  // config.allowedExtensions ??= {};
  // config.excludedDirs ??= {};

  return config;
}
