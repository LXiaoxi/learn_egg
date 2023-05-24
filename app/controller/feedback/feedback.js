"use strict";

const Controller = require("egg").Controller;

class FeedbackController extends Controller {
  async addFeedback() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.feedback.feedback.addFeedback(body);
    ctx.body = res;
  }

  async getFeedbackList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.feedback.feedback.getFeedbackList(query);
    ctx.body = res;
  }

  async deleteFeedback() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.feedback.feedback.deleteFeedback(id);
    ctx.body = res;
  }

  async handleFeedback() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.feedback.feedback.handleFeedback(id);
    ctx.body = res;
  }
}

module.exports = FeedbackController;
