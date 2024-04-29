import { prisma } from '../src/lib/prisma'
async function seed() {
  await prisma.event.create({
    data: {
      title: 'Clean Code',
      slug: 'clean-code',
      details: 'Um evento para melhorar a sua prática de programação',
      maximumAttendees: 5
    }
  })
}

seed().then( () => {
  console.log('Database seeded!');
  prisma.$disconnect()
})