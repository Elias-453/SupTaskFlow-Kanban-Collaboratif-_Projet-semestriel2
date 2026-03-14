'use strict';

/**
 * column controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::column.column', ({ strapi }) => ({
    async getActiveBoardElements(ctx) {
        try {
            const user = ctx.state.user;
            const { id } = ctx.params; 

            if (!user) return ctx.unauthorized('Token Inconnu');

            const columns = await strapi.db.query('api::column.column').findMany({
                where: {
                    user: user.id,  
                    board: id        
                },
                populate: {
                    cards: true     
                }
            });

            ctx.status = 200;
            ctx.body = columns; 
        } catch (err) {
            ctx.status = 500;
        }
    },
    async createUserColumn(ctx) {
        const user = ctx.state.user;
        if(!user) return ctx.unauthorized('Token Inconnu');

        const { columnName, boardId,order } = ctx.request.body.data;
        const newColumn = await strapi.entityService.create('api::column.column', {
        data: {
            columnName,
            user: user.id,
            board:boardId,
            order:order,
            publishedAt: new Date(),
        },
        });
        ctx.status = 200;
  },
    async deleteUserColumn(ctx) {
      const user = ctx.state.user;
      const { id } = ctx.params;

      if (!user) return ctx.unauthorized('Token Inconnu');

     
      const column = await strapi.db.query('api::column.column').findOne({
        where: { id: id, user: user.id }
      });

      if (!column) {
        return ctx.notFound('Column pas trouvé');
      }
      
      await strapi.entityService.delete('api::column.column', id);
      ctx.status = 200;
  },

    async changeColumnName(ctx) {
    try {
        const user = ctx.state.user;
        const { id } = ctx.params;
        const { newColumnName } = ctx.request.body.data; 

        if (!user) return ctx.unauthorized('Token Inconnu');

        const column = await strapi.db.query('api::column.column').findOne({
        where: { id: id, user: user.id }
        });

        if (!column) {
        return ctx.notFound('Column pas trouvé ');
        }

        const updatedColumn = await strapi.entityService.update('api::column.column', id, {
        data: {
            columnName: newColumnName,
        },
        });

        ctx.status = 200;
        ctx.body = updatedColumn;
    } catch (err) {
        ctx.status = 500;
    }
    },
    async orderChange(ctx) {
        try {
            const user = ctx.state.user;
            const { columns } = ctx.request.body;

            if (!user) return ctx.unauthorized('Token Inconnu');


            const promises = columns.map(col => {
                return strapi.entityService.update('api::column.column', col.id, {
                    data: { order: col.order }
                });
            });

                    
            await Promise.all(promises);

            ctx.status = 200;
        } catch (err) {
            ctx.status = 500;
        }
        },

}));