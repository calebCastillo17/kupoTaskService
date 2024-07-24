module.exports = {
    apps: [
      {
        name: "kupotaskservice",
        script: "./src/index.ts",
        watch: true,
        ignore_watch: ["node_modules", "dist"],
        interpreter: "./node_modules/.bin/ts-node",
        env: {
          NODE_ENV: "development",
          PORT: 3000
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 5000
        }
      }
    ]
  };
  