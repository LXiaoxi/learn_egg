"use strict";

const Controller = require("egg").Controller;

class VideoAllDataController extends Controller {
  async getAllVideoData() {
    const { ctx } = this;
    const res = await ctx.service.video.videoAllData.getAllVideoData();
    ctx.body = res;
  }
  async searchVideoData() {
    const { ctx } = this;
    const { keyWord } = ctx.query;
    const res = await ctx.service.video.videoAllData.searchVideoData(keyWord);
    ctx.body = res;
  }
  async getVideoFilmList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.video.videoAllData.getVideoFilmList(query);
    ctx.body = res;
  }
}

module.exports = VideoAllDataController;
