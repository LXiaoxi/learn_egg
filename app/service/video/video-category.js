'use strict';

const Service = require('egg').Service;

class VideoCategoryService extends Service {
  async addVideoCategory(body) {
    const { app } = this
    try {
      const res = await app.mysql.select('video_category', { where: { category_name: body.category_name }})
      if(res.length) return { code: 400, msg: '该分类已存在'}
      await app.mysql.insert('video_category', body)
      return { code: 200, msg: '插入成功'}
    } catch (error) {
      return { code: 500, error}
    }
  }

  async getVideoCategory() {
    const { app } = this
    try {
      const res = await app.mysql.select('video_category')
      return { code: 200, msg: '成功', data: res}      
    } catch (error) {
      return { code: 500, error}
    }
  }

  async updateVideoCategory(id, body) {
    const { app } = this
    try {
      const res = await app.mysql.select('video_category', { where: {id}})
      if(!res.length) return { code: 400, msg: '该数据不存在'}
      await app.mysql.update('video_category', body, {where: {id}})
      return { code: 200, msg: '修改成功'}
    } catch (error) {
      return { code: 500, error}
    }
  }

  async deleteVideoCategory(id) {
    const { app } = this
    try {
      const res = await app.mysql.select('video_category', { where: { id }})
      if(!res.length) return { code: 400, msg: '该数据不存在'}
      await app.mysql.delete('video_category', {id})
      return { code: 200, msg: '删除成功'}
    } catch (error) {
      return { code: 500, error}
    }
  }

}

module.exports = VideoCategoryService;
