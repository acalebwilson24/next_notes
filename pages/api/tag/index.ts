// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, PrismaClient, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth } from '../note';
import { prisma } from '../../../prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    const { userID, session } = await getAuth(req);
    if (!userID) {
        return res.status(401).json({ error: "Unauthorised" })
    }
    // get all user tags

    if (req.method == "GET") {
        const tags = await prisma.tag.findMany({
            where: {
                notes: {
                    some: {
                        authorID: userID
                    }
                }
            }
        }).then(tags => tags.map(tag => tag.name));

        if (!tags) {
            return res.status(404).json({ error: "Tags not found" });
        }

        return res.status(200).json(tags);
    }

}
