"use strict";

const Controller = require("egg").Controller;
const fs = require("fs");
const path = require("path");
const awaitWriteStream = require("await-stream-ready").write;
const senToWormhole = require("stream-wormhole");

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    let uid = stream.fieldname;
    const filename =
      Math.random().toString(36).substr(2) +
      new Date().getTime() +
      path.extname(stream.filename).toLocaleLowerCase();
    // 同步读取文件
    var files = fs.readdirSync("app/public/" + uid + "/img"); //读取该文件夹
    files.forEach(function (file) {
      var stats = fs.statSync("app/public/" + uid + "/img" + "/" + file);
      if (stats.isDirectory()) {
        emptyDir("app/public/" + uid + "/img" + "/" + file);
      }
      // else {
      //   fs.unlinkSync("app/public/" + uid + "/img" + "/" + file);
      //   console.log("删除文件" + "app/public/" + uid + "/img" + "/" + file + "成功");
      // }
    });

    let target = path.join(this.config.baseDir, "app/public/" + uid + "/img", filename);
    let imgurl = "public/" + uid + "/img";

    // 生成一个文件写入 文件流
    const writeStream = fs.createWriteStream(target);
    try {
      // 异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      // 如果出现错误，关闭管道
      await senToWormhole(stream);
      throw err;
    }
    ctx.body = {
      code: 200,
      data: {
        imgUrl: imgurl + "/" + filename,
      },
    };
  }
}

module.exports = UploadController;
