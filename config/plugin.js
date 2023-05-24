"use strict";

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mysql: {
    enable: true,
    package: "egg-mysql",
  },

  cors: {
    enable: true,
    package: "egg-cors",
  },

  bizerror: {
    enable: true,
    package: "egg-bizerror",
  },

  onerror: {
    accepts: (ctx) => {
      if (ctx.get("content-type") === "application/json") return "json";
      return "html";
    },
  },
  io: {
    enable: true,
    package: "egg-socket.io",
  },

  axiosPlus: {
    enable: true,
    package: "egg-axios-plus",
  },
};
