const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const PORT = 5000;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server running at ${PORT}`);
};

init();
