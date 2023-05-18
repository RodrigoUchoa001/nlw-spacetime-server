import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';

export async function memoriesRoutes(app: FastifyInstance) {
    app.get("/memories", async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createdAt: 'asc',
            }
        });

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...')
            }
        });
    })

    app.get("/memories/:id", async (req) => {

        // eu espero q o param sempre seja um objeto q contenha um "id" do tipo 
        // string e q seja uuid
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        // passo o params pro paramsSquema, vai ser feita a validação pra
        // ver se contem msm um "id" do tipo string e q seja uuid
        const { id } = paramsSchema.parse(req.params);

        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id, //msm coisa q id: id
            }
        })
        return memory;
    })

    app.post("/memories", async (req) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
            // o coerce é pra converter oq quer q seja pra boolean
        })

        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '14be3794-8601-4b3c-aded-f50cc111c064' //por enquanto estático
            }
        })

        return memory;
    })

    app.put("/memories/:id", async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        const { id } = paramsSchema.parse(req.params);

        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })
        const { content, coverUrl, isPublic } = bodySchema.parse(req.body);

        const memory = await prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
                coverUrl,
                isPublic,
            }
        })

        return memory;
    })

    app.delete("/memories/:id", async (req) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(req.params);

        await prisma.memory.delete({
            where: {
                id,
            }
        })
    })
}