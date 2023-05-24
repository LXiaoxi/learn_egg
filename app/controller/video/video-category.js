'use strict';

const Controller = require('egg').Controller;

class VideoCategoryController extends Controller {
  async addVideoCategory() {
    const { ctx } = this
    const body = ctx.request.body
    const res = await ctx.service.video.videoCategory.addVideoCategory(body)
    ctx.body = res
  }

  async getVideoCategory() {
    const { ctx } = this
    const res = await ctx.service.video.videoCategory.getVideoCategory()
    ctx.body = res
  }
  async updateVideoCategory() {
    const { ctx } = this
    const { id } = ctx.params
    const body = ctx.request.body
    const res = await ctx.service.video.videoCategory.updateVideoCategory(id, body)
    ctx.body = res
  }
  async deleteVideoCategory() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoCategory.deleteVideoCategory(id)
    ctx.body = res
  }
}

module.exports = VideoCategoryController;
