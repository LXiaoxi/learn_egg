"use strict";

const Controller = require("egg").Controller;

class MenuController extends Controller {
  async addMenu() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.permission.menu.addMenu(body);
    ctx.body = res;
  }

  async updateMenu() {
    const { ctx } = this;
    const { menu_id } = ctx.params;
    const body = ctx.request.body;
    const res = await ctx.service.permission.menu.updateMenu(menu_id, body);
    ctx.body = res;
  }

  async deleteMenu() {
    const { ctx } = this;
    const { menu_id } = ctx.params;
    const res = await ctx.service.permission.menu.deleteMenu(menu_id);
    ctx.body = res;
  }

  async getMenus() {
    const { ctx } = this;
    const res = await ctx.service.permission.menu.getMenus();
    ctx.body = res;
  }

  // h
  async addMenuRole() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.permission.menu.addMenuRole(body);
    ctx.body = res;
  }
}

module.exports = MenuController;
