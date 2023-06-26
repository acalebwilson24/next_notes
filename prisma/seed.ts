
import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    
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