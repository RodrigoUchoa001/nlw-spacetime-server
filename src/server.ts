import 'dotenv/config';

import fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { memoriesRoutes } from "./routes/memories";
import { AuthRoutes } from './routes/auth';

const app = fastify();

app.register(cors, {
    origin: true, //todo mundo pode acessar a API
    // origin: ['localhost:3000'] //posso colocar uma lista com todas as URLs q podem acessar
});

app.register(jwt, {
    secret: 'spacetime',
});

//registrando as rotas
app.register(AuthRoutes);
app.register(memoriesRoutes);

app.listen({
    port: 3333,
    host: '0.0.0.0', //precisa colocar isso aqui pra rodar no mobile
}).then(() => {
    console.log("servidor rodando em http://localhost:3333");
})