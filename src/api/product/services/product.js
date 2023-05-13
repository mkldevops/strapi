"use strict";

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::product.product", ({ strapi }) => ({
  async productByCode(entityCode) {
    try {
      const entry = await strapi.db.query("api::product.product").findOne({
        entityCode,
      });
      return entry;
    } catch (err) {
      return err;
    }
  },

  async createNewProduct(ctx) {
    try {
      const productData = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${ctx}?fields=product_name,image_url`
      );
      const product = await productData.json();
      const entry = await strapi.entityService.create("api::product.product", {
        data: {
          name: product.product.product_name,
          urlImage: product.product.image_url,
          code: ctx,
        },
      });
      return entry;
    } catch (error) {
      return err;
    }
  },
}));
