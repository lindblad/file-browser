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
      },
    }
  ]
}