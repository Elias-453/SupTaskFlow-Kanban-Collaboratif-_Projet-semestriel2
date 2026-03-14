module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/boards/getUserBoards',
      handler: 'board.getUserBoards',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/boards/createUserBoard',
      handler: 'board.createUserBoard',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/boards/deleteUserBoard/:id',
      handler: 'board.deleteUserBoard',
      config: {
          policies: [],
          middlewares: [],
      },
    },
        {
      method: 'PUT',
      path: '/boards/changeBoardName/:id',
      handler: 'board.changeBoardName',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/boards/globalCleanup',
      handler: 'board.globalCleanup',
      config: {
          policies: [],
          middlewares: [],
      },
    },
  ],
};