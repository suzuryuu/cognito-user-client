// http-proxy-middleware config
const { createProxyMiddleware } = require("http-proxy-middleware");

const API_ENDPOINT = 'https://6c1o3159qj.execute-api.ap-northeast-1.amazonaws.com';

module.exports = function (app) {
  app.use(
    "/dev/m-result",
    createProxyMiddleware({
      target: API_ENDPOINT,
      changeOrigin: true,
    })
  );
};