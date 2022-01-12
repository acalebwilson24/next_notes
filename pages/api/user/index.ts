// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | string>
) {
    if (req.method === "PUT") {
        // check user exists

        const userExists = prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (!userExists) {
            res.send("No user");
        }

        const user = await prisma.user.update({
            where: {
                email: req.body.email
            },
            data: {
                name: req.body.name
            }
        })

        return res.send(user);
    } else if (req.method === "GET") {
        res.send("GET!");
    }
}
