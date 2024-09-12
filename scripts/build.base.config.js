/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  productName: '',
  appId: '',
  electronVersion: process.env.ELECTRON_VERSION, // only used for development debugging
  directories: {
    output: 'build',
    buildResources: 'build',
    app: 'dist'
  },
  // assign publish for auto-updater
  // set this to your own repo!
  // publish: [{
  //   provider: 'github',
  //   owner: '',
  //   repo: ''
  // }],
  extraFiles: [
    'config/config.json'
  ]
};

module.exports = config;
