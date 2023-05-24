// 'use strict';

const Service = require('egg').Service;

class HomeService extends Service {
  async getData() {
    const { app } = this
    const res = await app.mysql.select('abc')
    if(res.length !== 0) {

    }
    return res
  }

  async createData() {
    const { app } = this
    const res = await app.mysql.insert('abc', { name: '123'})
    console.log(res)
    return res
  }
}

module.exports = HomeService;
