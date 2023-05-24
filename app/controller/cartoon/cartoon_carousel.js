"use strict";

const Controller = require("egg").Controller;

class CartoonCarouselController extends Controller {
  async addCartoonCarousel() {
    const { ctx } = this;
    const res = await ctx.service.cartoon.cartoonCarousel.getCartoonCarousel();
    ctx.body = res;
  }

  async getCartoonCarousel() {
    const { ctx } = this;
    const res = await ctx.service.cartoon.cartoonCarousel.getCartoonCarousel();
    ctx.body = res;
  }
  async addCartoonHome() {
    const { ctx } = this;
    const res = await ctx.service.cartoon.cartoonCarousel.addCartoonData();
    ctx.body = res;
  }
  async getCartoonHome() {
    const { ctx } = this;
    const res = await ctx.service.cartoon.cartoonCarousel.getCartoonHome();
    ctx.body = res;
  }
}

module.exports = CartoonCarouselController;
