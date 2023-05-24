module.exports = {
  handleHtmlElSplit(items, sData, num) {
    let newData = [];
    items.forEach((item) => {
      let data = item.split(sData);
      newData.push(data[num]);
    });
    return newData;
  },

  handleHtmlElSliceAndSplit(items, sData, num) {
    let newData = [];
    items.forEach((item) => {
      let i = item.slice(0, item.length - 4);
      let j = i.split(sData);
      newData.push(j[num]);
    });
    return newData;
  },

  async handleAddChapterRequest(chapter_id, comic_id) {
    const { ctx } = this;
    const param = {
      method: "GET",
      rejectUnauthorized: false,
      dataType: "json",
      data: {
        chapter_id: chapter_id,
        comic_id: comic_id,
        type: 1,
        sign: "3e881c73a538b4add0ad4494520ac826",
        uid: "59120260",
        format: 1,
        quality: 1,
      },
    };
    const resData = await ctx.curl(
      `https://comic.mkzcdn.com/chapter/content/v1`,
      param
    );
    if (!resData.data.data["page"]) return [2];
    const newData = resData.data.data["page"].map((item) => {
      return { chapter_id, page_id: item.page_id, image_url: item.image };
    });
    const res = await ctx.service.cartoon.chapterInfo.addChapterInfo(newData);
    return res;
  },

  async handleNovelListData(table, data) {
    const { app } = this;
    const info = [];
    for (let item of data) {
      const sRes = await app.mysql.select(table, {
        where: { novel_number: item.novel_number },
      });
      if (sRes.length) {
        info.push(1);
      } else {
        await app.mysql.insert(table, item);
        info.push(0);
      }
    }
    return info;
  },
};
