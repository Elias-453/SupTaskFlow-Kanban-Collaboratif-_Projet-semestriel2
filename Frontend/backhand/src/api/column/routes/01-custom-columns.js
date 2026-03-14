module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/columns/getActiveBoardElements/:id',
      handler: 'column.getActiveBoardElements',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/columns/createUserColumn',
      handler: 'column.createUserColumn',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/columns/deleteUserColumn/:id',
      handler: 'column.deleteUserColumn',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/columns/changeColumnName/:id',
      handler: 'column.changeColumnName',
      config: {
          policies: [],
          middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/columns/orderChange',
      handler: 'column.orderChange',
      config: {
          policies: [],
          middlewares: [],
      },
    },
  ],
};
