import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.users.findMany({
    include: {
      roles: true
    }
  });
  console.log(JSON.stringify(users.map(u => ({
    email: u.email,
    password: u.password,
    role: u.roles.role_name
  })), null, 2))
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
