

'use strict';

/**
 * column controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
    async orderChange(ctx) {
        try {
            const user = ctx.state.user;
            const { cards } = ctx.request.body;

            if (!user) return ctx.unauthorized('Token Inconnu');


            const promises = cards.map(card => {
                return strapi.entityService.update('api::task.task', card.id, {
                    data: { order: card.order }
                });
            });

                    
            await Promise.all(promises);
            
            ctx.status = 200;
            return (ctx.body = { message: "Ok" });
        } catch (err) {
            ctx.status = 500;
        }
        },

    async createUserCarte(ctx) {
            const user = ctx.state.user;
            if(!user) return ctx.unauthorized('Token Inconnu');

            const { Order,columnId } = ctx.request.body.data;
            
            const task = await strapi.entityService.create('api::task.task', {
            data: {
                taskName:"Nouvelle Carte",
                user: user.id,
                order:Order,
                statue:"space",
                description:"",
                column:columnId,
                publishedAt: new Date(),
            },
            
            }
        );
            ctx.status = 200;
            ctx.body = { data: task };
    },
    async changeCard(ctx) {
        const user = ctx.state.user;
        if (!user) return ctx.unauthorized('Token Inconnu');

        const { id } = ctx.params; 
        const { changes } = ctx.request.body; 

    
        try {
            const updatedTask = await strapi.entityService.update('api::task.task', id, {
                data: {
                    ...changes 
                },
            });

            if (!updatedTask) {
                return ctx.notFound("tâche pas trouvé");
            }

            ctx.status = 200;
           
        } catch (err) {
            ctx.badRequest("Erreur lors de la modification");
        }
    },

async deleteUserCard(ctx) {
    try {
        const user = ctx.state.user;
        const { id } = ctx.params;

        if (!user) return ctx.unauthorized('Token Inconnu');

     
        const card = await strapi.db.query('api::task.task').findOne({
            where: { id: id, user: { id: user.id } } 
        });

        if (!card) {
            return ctx.notFound('Carte pas trouvée');
        }

        await strapi.entityService.delete('api::task.task', id);
        
       
        ctx.status = 200;
        return (ctx.body = { message: "Suppression réussie", id });
        
    } catch (err) {
        console.error(err);
        ctx.status = 500;
        return (ctx.body = { error: "Erreur interne du serveur" });
    }
},
}));