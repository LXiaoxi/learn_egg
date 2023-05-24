"use strict";

const Controller = require("egg").Controller;

class VideoFilmController extends Controller {
  async addVideoFilm() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.video.videoFilm.addVideoFilm(id);
    ctx.body = res;
  }

  async updateVideoFilm() {
    const { ctx } = this;
    const { id } = ctx.params;
    const body = ctx.request.body;
    const res = await ctx.service.video.videoFilm.updateVideoFilm(id, body);
    ctx.body = res;
  }

  async deleteVideoFilm() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.video.videoFilm.deleteVideoFilm(id);
    ctx.body = res;
  }

  async selectVideoFilm() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.video.videoFilm.selectVideoFilm(id);
    ctx.body = res;
  }

  async getVideoFilm() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.video.videoFilm.getVideoFilm(query);
    ctx.body = res;
  }

  async searchVideoFilm() {
    const { ctx } = this;
    const { keyWord } = ctx.query;
    const res = await ctx.service.video.videoFilm.searchVideoFilm(keyWord);
    ctx.body = res;
  }
}

module.exports = VideoFilmController;
