const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Define the regular expression to match files starting with `._`
const appleDoublePrefix = /^\._.*/;

config.resolver.blockList = [
  ...(config.resolver.blockList || []),
  appleDoublePrefix,
];

module.exports = config;
