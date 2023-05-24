"use strict";
/**
 * 用户相关接口
 */
const Controller = require("egg").Controller;
const jwt = require("jsonwebtoken");
class UserController extends Controller {
  // 登录

  async loginF(name) {
    const { ctx, app } = this;
    const token = jwt.sign({ name }, app.config.jwt.secret, {
      expiresIn: 60 * 60 * 24,
    });

    ctx.body = {
      code: 200,
      msg: "用户登录成功",
      data: { token, ...ctx.user[0] },
    };
  }
  async login() {
    const { ctx } = this;
    const { phone } = ctx.request.body;
    await this.loginF(phone);
  }

  async loginUserName() {
    const { ctx } = this;
    const { user_name } = ctx.request.body;
    await this.loginF(user_name);
  }

  // 注册
  async register() {
    const { ctx } = this;
    let table_name = "t_user";
    if (ctx.url.includes("general")) {
      table_name = "t_wx_user";
    }
    const res = await ctx.service.user.register(table_name, ctx.request.body);
    ctx.body = res;
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.service.user.getUserInfo(id);
    ctx.body = res;
  }

  // 获取用户列表
  async getUserList() {
    const { ctx } = this;
    const body = ctx.query;
    let table_name = "t_user";
    if (ctx.url.includes("general")) {
      table_name = "t_wx_user";
    }
    const res = await ctx.service.user.getUserList(table_name, body);
    ctx.body = res;
  }
  // 删除用户
  async deleteUser() {
    const { ctx } = this;
    let table_name = 't_user'
    if(ctx.url.includes('general')) {
      table_name = 't_wx_user'

    }
    const { user_id } = ctx.params;
    const res = await ctx.service.user.deleteUser(table_name, user_id);
    ctx.body = res;
  }

  // 编辑用户信息
  async updateUserInfo() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { id } = ctx.params;
    const res = await ctx.service.user.updateUserInfo(id, body);
    ctx.body = res;
  }

  async test() {
    const { ctx } = this;
    ctx.body = { code: 200, msg: "123" };
  }

  async wxLogin() {
    const { ctx } = this;
    const data = ctx.request.body;
    const res = await ctx.service.user.wxLogin(data);
    ctx.body = res;
  }
  // 修改微信用户信息
  async updateWxUserInfo() {
    const { ctx } = this;
    const body = ctx.request.body;
    const { id } = ctx.params;
    const res = await ctx.service.user.updateWxUserInfo(id, body);
    ctx.body = res;
  }
}

module.exports = UserController;
