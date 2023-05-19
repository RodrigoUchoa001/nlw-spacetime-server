import { FastifyInstance } from "fastify";
import axios from 'axios';
import { z } from "zod";
import { prisma } from "../lib/prisma";


export async function AuthRoutes(app: FastifyInstance){
    app.post('/register', async (req) => {
        const bodySchema = z.object({
            code: z.string(),
        });

        const { code } = bodySchema.parse(req.body);

        // pegando o token do usuario do github
        const accessTokenResponse = await axios.post (
            'https://github.com/login/oauth/acess_token',
            null,
            {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                headers: {
                    Accept: 'application/json',
                }
            },
        );

        const { access_token } = accessTokenResponse.data;
        
        // usando o token do usuario pra pegar as info desse usuário
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        const userSchema = z.object({
            id: z.number(),
            login: z.string(),
            name: z.string(),
            avatar_url: z.string().url(),

        });

        const userInfo = userSchema.parse(userResponse.data);
        
        // ver se esse usuario já n está salvo no bd
        let user = await prisma.user.findUnique({
            where: {
                githubId: userInfo.id,
            }
        })
        
        // caso ainda n esteja criado, cria ele
        if (!user){
            user = await prisma.user.create({
                data: {
                    githubId: userInfo.id,
                    login: userInfo.login,
                    name: userInfo.name,
                    avatarUrl: userInfo.avatar_url,
                }
            })
        }

        return { 
            user,
        };
    })

}