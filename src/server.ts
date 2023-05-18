import fastify from "fastify";
import cors from '@fastify/cors';
import { memoriesRoutes } from "./routes/memories";

const app = fastify();

app.register(cors, {
    origin: true, //todo mundo pode acessar a API
    // origin: ['localhost:3000'] //posso colocar uma lista com todas as URLs q podem acessar
});

//registrando as rotas
app.register(memoriesRoutes);

app.listen({
    port: 3333,
}).then(() => {
    console.log("servidor rodando em http://localhost:3333");
})