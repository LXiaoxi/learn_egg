"use strict";

const Controller = require("egg").Controller;

class CollectController extends Controller {
  async addCollect() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.collect.collect.addCollect(body);
    ctx.body = res;
  }

  async getCollectList() {
    const { ctx } = this;
    const res = await ctx.service.collect.collect.getCollectList();
    ctx.body = res;
  }
}

module.exports = CollectController;
