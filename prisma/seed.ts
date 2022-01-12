
import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Bob",
        email: "bob@bob.com",
        password: "password",
        notes: {
            create: [
                {
                    title: "Bob's First Note",
                    content: "This is my favourite note in the world"
                },
                {
                    title: "Bob's Second Note",
                    content: "This is my second note isn't it great."
                }
            ]
        }
    },
    {
        name: "Steve",
        email: "steve@steve.com",
        password: "password",
    },
    {
        name: "Geraldine",
        email: "geraldine@steve.com",
        password: "password",
        notes: {
            create: [
                {
                    title: "How To Make Bread",
                    content: "Start with some flour"
                },
                {
                    title: "How To Eat Bread",
                    content: "Start with some bread"
                },
                {
                    title: "How To Start A Fire",
                    content: "Start with some wood"
                }
            ]
        }
    }
]

async function main() {
    console.log("Start seeding...");
    for (const u of userData) {
        const user = await prisma.user.create({
            data: {
                ...u,
                password: u.password && await bcrypt.hash(u.password, 10)
            }
        })
        console.log(`Created user with id: ${user.id}`)
    }
    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })