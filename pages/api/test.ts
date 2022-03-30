// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    console.log(req.query);
    res.json({ query: req.query });
}
