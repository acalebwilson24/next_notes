// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | string>
) {
    console.log(req.body);
    if (!(req.body.email && req.body.password)) {
        return res.send("Invalid POST");
    }

    const password = await bcrypt.hash(req.body.password, 10);

    // check if user already exists

    const userExists = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    })

    if (userExists) {
        return res.send("User already exists");
    }

    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            password
        }
    })

    return res.send(user);
}
