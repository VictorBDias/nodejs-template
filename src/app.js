import express from 'express';
import routes from './routes/index';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(routes);
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
