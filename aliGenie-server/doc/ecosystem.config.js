module.exports = {
  apps: [{
    name: "aligenie_recommend_movie",
    script: "./src/App.js",
    log_date_format: "YYYY-MM-DD HH:mm Z",    // 日志日期格式，Z 为时区
    error_file: "./mp2_err.log",               // 错误日志目录
    out_file: "./mp2_out.log",                 // 日志目录
    env: {
      NODE_ENV: "development",
      mode: "dev"
    },
    env_test: {
      NODE_ENV: "test",
      mode: "test"
    },
    env_production: {
      NODE_ENV: "production",
      mode: "prod"
    },
  }]
};