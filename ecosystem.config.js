module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // First application
    {
      name: "File browser",
      script: "index.js",
      cwd: "C:/dev/file-browser",
      watch: false,
      ignore_watch: ["[\/\\]\./", "node_modules", "logs", "lib"],
      env: {
        AZURE_STORAGE_CONNECTION_STRING: "BlobEndpoint=https://ne1dnvgltstgcus0000f.blob.core.windows.net;SharedAccessSignature=sv=2017-04-17&sr=c&sig=RBymCBy%2B7JwPmRFwq%2Fnv8jy48J3qQtYa4e9qUlXo%2BVc%3D&st=2017-11-24T14%3A47%3A11Z&se=2018-05-23T15%3A46%3A42Z&sp=rwdl"
      },
    }
  ]
}