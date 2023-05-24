'use strict';

const Controller = require('egg').Controller;

class VideoDetailController extends Controller {
  async addVideoDetail() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoDetail.addVideoDetail(id)
    ctx.body = res
  }

  async updateVideoDetail() {
    const { ctx } = this
    const { id } = ctx.params
    const body = ctx.request.body
    const res = await ctx.service.video.videoDetail.updateVideoDetail(id, body)
    ctx.body = res
  }
  
  async deleteVideoDetail() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoDetail.deleteVideoDetail(id)
    ctx.body = res
  }

  async selectVideoDetail() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoDetail.selectVideoDetail(id)
    ctx.body = res
  }

  async getVideoDetail() {
    const { ctx } = this
    const query = ctx.query
    const res = await ctx.service.video.videoDetail.getVideoDetail(query)
    ctx.body = res
  }
}

module.exports = VideoDetailController;
