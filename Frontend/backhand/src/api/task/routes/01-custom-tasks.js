module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/tasks/orderChange',
      handler: 'task.orderChange',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/tasks/createUserCarte',
      handler: 'task.createUserCarte',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/tasks/changeCard/:id',
      handler: 'task.changeCard',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/tasks/deleteUserCard/:id',
      handler: 'task.deleteUserCard',
      config: {
          policies: [],
          middlewares: [],
      },
    },
  ],
};