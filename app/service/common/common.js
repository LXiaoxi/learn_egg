'use strict';

const Service = require('egg').Service;

class CommonService extends Service {
  async selectData(table, wname, info) {
    const { app } = this
    const res = await app.mysql.select([table], { where : {[wname] : info}})
    return res
  }

  async deleteData(table, wname, info) {
    const { app } = this
    const res = await app.mysql.delete([table], {[wname]: info})
    return res
  }
}

module.exports = CommonService;
