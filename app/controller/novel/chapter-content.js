"use strict";

const Controller = require("egg").Controller;

class ChapterContentController extends Controller {
  async addChapterContent() {
    const { ctx } = this;
    const { novel_number, chapter_number } = ctx.params;
    const res = await ctx.service.novel.chapterContent.addChapterContent(
      novel_number,
      chapter_number
    );
    ctx.body = res;
  }

  async batchAddChapterContent() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.novel.chapterContent.batchAddChapterContent(
      body
    );
    ctx.body = res;
  }

  async deleteChapterContent() {
    const { ctx } = this;
    const params = ctx.params;
    const res = await ctx.service.novel.chapterContent.deleteChapterContent(
      params.id
    );
    ctx.body = res;
  }
}

module.exports = ChapterContentController;
