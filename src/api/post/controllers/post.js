// @ts-nocheck
'use strict';

/**
 * post controller
 */
const { sanitize } = require("@strapi/utils")

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
  async create(ctx) {
    const {id} = ctx.state.user;
    const { data } = ctx.request.body;
    ctx.request.body.data = {
      ...data,
      name: String(data.name).trim(),
      user: {
        connect: [{ id }]
      }
    }
    const sanitizedCtx = await this.sanitizeInput(ctx);
    const entity = await super.create(sanitizedCtx)
    entity.user_id = id
    const post = await this.sanitizeOutput(entity)
    return { post }
  },
}));

