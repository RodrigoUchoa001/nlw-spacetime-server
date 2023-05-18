import fastify from "fastify";
import { memoriesRoutes } from "./routes/memories";

const app = fastify();

//registrando as rotas
app.register(memoriesRoutes);

app.listen({
    port: 3333,
}).then(() => {
    console.log("servidor rodando em http://localhost:3333");
})