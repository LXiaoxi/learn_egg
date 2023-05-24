"use strict";

const Controller = require("egg").Controller;

class RoleController extends Controller {
  async addRole() {
    const { ctx } = this;
    const body = ctx.request.body;
    const res = await ctx.service.permission.role.addRole(body);
    ctx.body = res;
  }

  async updateRole() {
    const { ctx } = this;
    const { role_id } = ctx.params;
    const body = ctx.request.body;
    const res = await ctx.service.permission.role.updateRole(role_id, body);
    ctx.body = res;
  }

  async deleteRole() {
    const { ctx } = this;
    const { role_id } = ctx.params;
    const res = await ctx.service.permission.role.deleteRole(role_id);
    ctx.body = res;
  }

  async getRoleList() {
    const { ctx } = this;
    const query = ctx.query;
    const res = await ctx.service.permission.role.getRoleList(query);
    ctx.body = res;
  }

  async getRoleMenu() {
    const { ctx } = this;
    const { role_id } = ctx.params;
    const res = await ctx.service.permission.role.getRoleMenu(role_id);
    ctx.body = res;
  }
}

module.exports = RoleController;
