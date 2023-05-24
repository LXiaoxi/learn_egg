/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // 配置mysql
  config.mysql = {
    client: {
      // host
      host: "localhost",
      // port
      port: "3306",
      // username
      user: "root",
      // password
      password: "123456",
      // database
      database: "test",
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  config.security = {
    // 关闭 csrf
    csrf: {
      enable: false,
    },
    // 跨域白名单
    // domainWhiteList: [ 'http://localhost:3000' ],
  };
  // 允许跨域的方法
  config.cors = {
    origin: "*",
    allowMethods: "GET, PUT, POST, DELETE, PATCH",
  };

  // config.middleware = ['user', 'errorHandle', 'login']
  config.middleware = ["init", "errorHandle", "verifyLogin", "verifyRegister"];

  (config.jwt = {
    secret: "123456",
  }),
    (config.bizerror = {
      breakDefault: false, // disable default error handler禁用默认错误处理
      sendClientAllParams: false, // return error bizParams to user，返回错误参数给用户
      interceptAllError: false, // handle all exception, not only bizError exception处理所有的异常，不仅是业务异常。
    });

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1671676798965_3433";

  // add your middleware config here
  config.middleware = [];

  config.axiosPlus = {
    headers: {
      common: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      timeout: 5000, // 默认请求超时
      app: true, // 在app.js上启动加载
      agent: false, // 在agent.js上启动加载
    },
  };
  config.cluster = {
    listen: {
      path: "",
      post: "7001",
      hostname: "192.168.1.214",
      // hostname: "127.0.0.1",
    },
  };
  config.io = {
    init: {},
    namespace: {
      "/client": {
        connectionMiddleware: ["connection"],
        packetMiddleware: ["packet"],
      },
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
