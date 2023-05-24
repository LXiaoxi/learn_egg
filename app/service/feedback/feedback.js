"use strict";

const Service = require("egg").Service;

class FeedbackService extends Service {
  async addFeedback(body) {
    const { app, ctx } = this;
    const { problem, image_url } = body;
    const { user_id } = ctx.user;
    await app.mysql.query(`
      INSERT  INTO  problem_feedback(user_id, problem, image_url) VALUES ( ${user_id},'${problem}','${image_url}')
    `);
    return { code: 200, msg: "反馈成功" };
  }

  async getFeedbackList(query) {
    const { app } = this;
    const { page, pageSize } = query;
    if (!page || !pageSize) return { code: 400, msg: "参数错误" };
    let hasNextPage = false;
    const total = await app.mysql.select("problem_feedback");
    if (page * pageSize < total.length - pageSize) {
      hasNextPage = true;
    }
    const res = await app.mysql.query(`
      SELECT 
        pf.*,
        u.user_name,
        u.phone,
        u.state
      FROM problem_feedback pf
      JOIN t_user u ON pf.user_id = u.user_id
      LIMIT ${Number(pageSize)}
      OFFSET ${page * pageSize}
    `);
    return { code: 200, msg: "成功", data: res, total: total.length, hasNextPage };
  }

  async deleteFeedback(id) {
    const { app } = this;
    const res = await app.mysql.delete("problem_feedback", { id });
    if (res.affectedRows > 0) {
      return { code: 200, msg: "成功" };
    } else {
      return { code: 200, msg: "失败" };
    }
  }
  async handleFeedback(id) {
    const { app } = this;
    const res = await app.mysql.update(
      "problem_feedback",
      { operation_state: 1 },
      { where: { id } }
    );
    if (res.affectedRows > 0) {
      return { code: 200, msg: "成功" };
    } else {
      return { code: 200, msg: "失败" };
    }
  }
}

module.exports = FeedbackService;
