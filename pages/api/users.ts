// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../prisma/client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const users = await prisma.user.findMany({
        include: {
            notes: true
        }
    });
    res.send(users);
}
