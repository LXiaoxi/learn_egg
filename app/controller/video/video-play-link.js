'use strict';

const Controller = require('egg').Controller;

class VideoPlayLinkController extends Controller {
  async addVideoPlayLink() {
    const { ctx } = this
    const body = ctx.params
    const res = await ctx.service.video.videoPlayLink.addVideoPlayLink(body)
    ctx.body = res
  }

  async batchVideoPlayLink() {
    const { ctx } = this
    const body = ctx.request.body
    const res = await ctx.service.video.videoPlayLink.batchAddVideoPlayLink(body)
    ctx.body = res
  }

  async updateVideoPlayLink() {
    const { ctx } = this
    const body = ctx.request.body
    const { id } = ctx.params
    const res = await ctx.service.video.videoPlayLink.updateVideoPlayLink(id, body)
    ctx.body = res
  }

  async deleteVideoPlayLink() {
    const { ctx } = this
    const { id } = ctx.params 
    const res = await ctx.service.video.videoPlayLink.deleteVideoPlayLink(id)
    ctx.body = res
  }

  async getVideoPlayLink() {
    const { ctx } = this
    const {film_id} = ctx.params
    const res = await ctx.service.video.videoPlayLink.getVideoPlayLink(film_id)
    ctx.body = res
  }

  
}

module.exports = VideoPlayLinkController;
