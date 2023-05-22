import 'dotenv/config';

import fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import { memoriesRoutes } from "./routes/memories";
import { AuthRoutes } from './routes/auth';
import { uploadRoutes } from './routes/upload';
import { resolve } from 'node:path';

const app = fastify();

app.register(multipart);

app.register(require('@fastify/static'), {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads'
});

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
app.register(uploadRoutes);

app.listen({
    port: 3333,
    host: '0.0.0.0', //precisa colocar isso aqui pra rodar no mobile
}).then(() => {
    console.log("servidor rodando em http://localhost:3333");
})