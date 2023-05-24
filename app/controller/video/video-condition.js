'use strict';

const Controller = require('egg').Controller;

class VideoConditionController extends Controller {
  async addVideoCondition() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoCondition.addVideoCondition(id)
    ctx.body = res
  }

  async updateVideoCondition() {
    const { ctx } = this
    const { id } = ctx.params
    const body = ctx.request.body
    const res = await ctx.service.video.videoCondition.updateVideoCondition(id, body)
    ctx.body = res
  }

  async deleteVideoCondition() {
    const { ctx } = this
    const { id } = ctx.params
    const res = await ctx.service.video.videoCondition.deleteVideoCondition(id)
    ctx.body = res
  }

  async getVideoCondition() {
    const { ctx } = this
    const { category_id } = ctx.params
    const res = await ctx.service.video.videoCondition.getVideoCondition(category_id)
    ctx.body = res
  }
}

module.exports = VideoConditionController;
