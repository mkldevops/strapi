"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::product.product");

const myOverideRoutes = [
  {
    method: "GET",
    path: "/products/:code",
    handler: "api::product.product.findOne",
  },
];

const customRouter = (innerRouter, routeOveride = [], extraRoutes = []) => {
  let routes;

  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes;

      const newRoutes = routes.map((route) => {
        let found = false;

        routeOveride.forEach((overide) => {
          if (
            route.handler === overide.handler &&
            route.method === overide.method
          ) {
            found = overide;
          }
        });

        return found || route;
      });

      return newRoutes.concat(extraRoutes);
    },
  };
};

const myExtraRoutes = [
  {
    method: "POST",
    path: "/products",
    handler: "product.createNewProduct",
  },
];

module.exports = customRouter(defaultRouter, myOverideRoutes, myExtraRoutes);
