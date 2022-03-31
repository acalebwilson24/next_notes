// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Note, Prisma, PrismaClient, Tag, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getAuth, parseTags } from '../note';
import { prisma } from '../../../prisma/client';
import { TagAPIResponse } from '../../../redux/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TagAPIResponse[] | { error: string }>
) {
    const { userID, session } = await getAuth(req);
    if (!userID) {
        return res.status(401).json({ error: "Unauthorised" })
    }
    // get all user tags

    const { tag } = req.query as { tag?: string[] | string };
    const tags = tag ? parseTags(tag) : [];

    if (req.method == "GET") {

        console.log(tags);

        const otherTags = await prisma.tag.findMany({
            where: {
                // filter out tags that are already in the list
                NOT: tags && [
                    ...tags.map(t => {
                        const where: Prisma.TagWhereInput = {
                            name: {
                                equals: t
                            }
                        };
                        return where;
                    })
                ],
                AND: [
                    // only gets tags which are present with the query tags
                    {
                        notes: {
                            some: {
                                AND: [
                                    ...tags.map(t => {
                                        const where: Prisma.NoteWhereInput = {
                                            tags: {
                                                some: {
                                                    name: {
                                                        equals: t
                                                    }
                                                }
                                            }
                                        };
                                        return where;
                                    }),
                                    // only get tags the user has used
                                    {
                                        authorID: userID
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        })
        
        const tagsWithCounts = await Promise.all(otherTags.map(async tag => {
            // get the count of notes with this tag and passed in tags array
            const count = await prisma.note.count({
                where: {
                    AND: [
                        {
                            tags: {
                                some: {
                                    name: tag.name
                                }
                            }
                        },
                        ...tags.map(t => ({
                            tags: {
                                some: {
                                    name: t
                                }
                            }
                        }))
                    ]
                }
            });
            
            return { tag: tag.name, count };
        }))

        console.log(tagsWithCounts);


        if (!tagsWithCounts) {
            return res.status(404).json({ error: "Tags not found" });
        }

        return res.status(200).json(tagsWithCounts);
    }

}
