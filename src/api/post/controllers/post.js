// @ts-nocheck
'use strict';


/**
 * post controller
 */

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

  async find(ctx) {
    // Clonando a query do contexto para evitar modificação direta
    const query = { ...ctx.query };

    // Adicionando o parâmetro populate para populacionar o usuário
    query.populate = 'user';

    // verificando se o objeto filters existe
    if (!query.filters) {
      query.filters = {};
    }

    // Adicionando o filtro do usuário logado
    if (ctx.state.user && ctx.state.user.id) {
      query.filters['user'] = ctx.state.user.id;
    }

    // Atualizando a query no contexto
    ctx.query = query;

    // Chamando as funções de manipulação de entrada e saída
    const sanitizedCtx = await this.sanitizeInput(ctx);
    const data = await super.find(sanitizedCtx);
    const posts = await this.sanitizeOutput(data);

    return { posts };
  }
}));

