"use strict";

const { createCoreController } = require("@strapi/strapi").factories;
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async findOne(ctx) {
    const { code } = ctx.params;

    const query = {
      filters: { code },
      ...ctx.query,
    };

    const product = await strapi.entityService.findMany(
      "api::product.product",
      query
    );

    try {
      if (product[0]) {
        const sanitizedEntity = await this.sanitizeOutput(product);
        return this.transformResponse(sanitizedEntity[0]);
      } else {
        return await strapi
          .service("api::product.product")
          .createNewProduct(code);
      }
    } catch (error) {
      ctx.badRequest("findById controller error", { moreDetails: error });
    }
  },

  async createNewProduct() {
    try {
      return await strapi.service("api::product.product").createNewProduct();
    } catch (error) {
      ctx.badRequest("findById controller error", { moreDetails: error });
    }
  },
}));
