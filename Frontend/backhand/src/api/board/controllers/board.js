

/**
 * board controller
 */

const { createCoreController } = require('@strapi/strapi').factories;


module.exports = createCoreController('api::board.board', ({ strapi }) => ({
  async getUserBoards(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Token Inconnu');


    const boards = await strapi.entityService.findMany('api::board.board', {
      filters: {
        user: { id: user.id }
      },
      fields: ['id', 'boardName'],
    });

    ctx.status = 200;
    ctx.body = boards;
  },

  async createUserBoard(ctx) {
    const user = ctx.state.user;
    if(!user) return ctx.unauthorized('Token Inconnu');

    const { boardName } = ctx.request.body.data;
    
    const newBoard = await strapi.entityService.create('api::board.board', {
      data: {
        boardName,
        user: user.id,
        publishedAt: new Date(),
      },
      fields: ['id', 'boardName'],
    });
    ctx.status = 200;
  },

  async deleteUserBoard(ctx) {
      const user = ctx.state.user;
      const { id } = ctx.params;

      if (!user) return ctx.unauthorized('Token Inconnu');

     
      const board = await strapi.db.query('api::board.board').findOne({
        where: { id: id, user: user.id }
      });

      if (!board) {
        return ctx.notFound('Tableau pas trouvé');
      }
      
      await strapi.entityService.delete('api::board.board', id);
      ctx.status = 200;
  },

async changeBoardName(ctx) {
  try {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const { newBoardName } = ctx.request.body.data; 

    if (!user) return ctx.unauthorized('Token Inconnu');

    const board = await strapi.db.query('api::board.board').findOne({
      where: { id: id, user: user.id }
    });

    if (!board) {
      return ctx.notFound('Tableau pas trouvé ');
    }

    const updatedBoard = await strapi.entityService.update('api::board.board', id, {
      data: {
        boardName: newBoardName,
      },
    });

    ctx.status = 200;
    ctx.body = updatedBoard;
  } catch (err) {
    ctx.status = 500;
  }
},


async globalCleanup(ctx) {
    try {
      const homelessColumns = await strapi.db.query('api::column.column').deleteMany({ 
        where: {
          board: { id: { $null: true } }
        }
      });

      const homelessTasks = await strapi.db.query('api::task.task').deleteMany({
        where: {
          column: { id: { $null: true } }
        }
      });

      return { 
        message: "CleanUp Succés", 
        columnsRemoved: homelessColumns.count,
        tasksRemoved: homelessTasks.count 
      };
    } catch (err) {
      return ctx.badRequest(" le cleanup a échoué", { error: err });
    }
  },


}));