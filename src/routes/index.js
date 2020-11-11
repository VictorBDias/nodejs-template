import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'testeTemp' }));

export default routes;
