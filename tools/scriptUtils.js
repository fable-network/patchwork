/* eslint no-console: 0 */
const fs = require('fs');

module.exports = {
  logInfo: (message) => {
    console.log(message);
  },

  logWarning: (message) => {
    console.warn(message);
  },

  logError: (message) => {
    console.error(message);
  },

  isComponentDirectory: (name) => fs.lstatSync(`./src/components/${name}`).isDirectory(),
};
