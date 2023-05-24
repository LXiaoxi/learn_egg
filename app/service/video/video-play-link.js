"use strict";

const Service = require("egg").Service;
const cheerio = require("cheerio");
class VideoPlayLinkService extends Service {
  async fragment(film_url, play_link, film_id) {
    const { app, ctx } = this;
    const resXml = await ctx.curl(`https://www.shnakun.com${play_link}`, {
      dataType: "text",
    });

    const $ = cheerio.load(resXml.data, { decodeEntities: false });
    let str = $("script", ".stui-player__video").text().trim();
    str = JSON.parse(str.match(/aaa\=(.+)/)[1]);
    const obj = {
      film_url,
      play_link,
      play_sub_link: str.url,
      film_id,
    };

    const linkRes = await app.mysql.select("video_play_link", {
      where: { play_link },
    });
    if (linkRes.length) {
      // return '该播放链接已存在'
      return [1];
    } else {
      await app.mysql.insert("video_play_link", obj);
      return [0];
    }
  }
  async addVideoPlayLink(body) {
    const { app, ctx } = this;
    const { film_url, play_link } = body;
    let film_urls = "/voddetail/" + film_url;
    let play_links = "/vodplay/" + play_link;
    console.log(film_urls);
    console.log(play_links);
    const [res] = await app.mysql.select("video_film_detail_info", {
      where: { film_url: film_urls },
    });
    if (!res) return { code: 400, msg: "该数据不存在" };
    if (res.play_link.indexOf(play_link) == -1) return { code: 400, msg: "该链接不存在" };
    const data = await this.fragment(film_urls, play_links, res.film_id);

    return { code: 200, msg: "成功", data };
  }

  async batchAddVideoPlayLink(body) {
    const { app } = this;
    const { film_url } = body;
    const [res] = await app.mysql.select("video_film_detail_info", {
      where: { film_url },
    });
    if (!res) return { code: 400, msg: "该数据不存在" };
    const play_link = res.play_link.split(",");
    const info = [];
    for (let item of play_link) {
      const res = await this.fragment(film_url, item);
      info.push(res);
    }
    return { code: 200, msg: { ...info } };
  }

  async updateVideoPlayLink(id, body) {
    const { app } = this;
    try {
      if (Object.keys(body).length <= 2) return { code: 400, msg: "参数错误" };
      const res = await app.mysql.select("video_play_link", { where: { id } });
      if (!res.length) return { code: 400, msg: "该数据不存在" };
      await app.mysql.update("video_play_link", body, { where: { id } });
      return { code: 200, msg: "修改成功" };
    } catch (error) {
      return { code: 500, msg: "服务端错误" };
    }
  }

  async deleteVideoPlayLink(id) {
    const { app } = this;
    const res = await app.mysql.select("video_play_link", { where: { id } });
    if (!res.length) return { code: 400, msg: "该数据不存在" };
    await app.mysql.delete("video_play_link", { id });
    return { code: 200, msg: "删除成功" };
  }

  async getVideoPlayLink(film_id) {
    const { app } = this;
    const [res] = await app.mysql.select("video_film_detail_info", {
      where: { film_id },
    });
    if (!res) return { code: 400, msg: "该数据不存在" };
    const linkRes = await app.mysql.select("video_play_link", {
      where: { film_url: res.film_url },
    });
    return { code: 200, msg: "成功", data: linkRes, total: linkRes.length };
  }
}

module.exports = VideoPlayLinkService;
