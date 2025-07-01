const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Création d'utilisateurs
  const users = await prisma.user.createMany({
    data: [
      {
        pseudo: 'alice75',
        email: 'alice@example.com',
        phone: '0601020304',
        age: 28,
        gender: 'F',
        description: 'Passionnée par le DIY et l’entraide.',
        city: 'Paris',
        postalCode: '75018',
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        pseudo: 'boblyon',
        email: 'bob@example.com',
        age: 35,
        gender: 'M',
        city: 'Lyon',
        postalCode: '69003',
        description: 'Toujours prêt à donner un coup de main.',
        profilePhotoUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        pseudo: 'carlaNice',
        email: 'carla@example.com',
        age: 22,
        gender: 'F',
        city: 'Nice',
        postalCode: '06000',
        description: 'Étudiante qui aime partager ses connaissances.',
        profilePhotoUrl: 'https://randomuser.me/api/portraits/women/3.jpg'
      }
    ]
  });

  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
  const bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } });
  const carla = await prisma.user.findUnique({ where: { email: 'carla@example.com' } });

  // Création d'offres
  await prisma.offer.createMany({
    data: [
      {
        title: 'Machine à café en bon état',
        description: 'Donne une machine à café Nespresso qui fonctionne parfaitement.',
        type: 'OBJET',
        tags: 'cuisine,électroménager',
        price: 0,
        city: 'Paris',
        postalCode: '75018',
        authorId: alice.id,
        photoUrl: 'https://example.com/cafe.jpg'
      },
      {
        title: 'Cours d’initiation à Excel',
        description: 'Je propose une session de 2h pour apprendre les bases d’Excel.',
        type: 'CONNAISSANCE',
        tags: 'bureautique,excel,formation',
        price: 0,
        city: 'Nice',
        postalCode: '06000',
        authorId: carla.id
      },
      {
        title: 'Aide pour monter un meuble IKEA',
        description: 'Je peux venir vous aider à monter vos meubles.',
        type: 'SERVICE',
        tags: 'bricolage,meuble',
        price: 10,
        city: 'Lyon',
        postalCode: '69003',
        authorId: bob.id
      },
      {
        title: 'Vélo enfant à donner',
        description: 'Vélo taille 6-8 ans, encore en bon état.',
        type: 'OBJET',
        tags: 'vélo,enfant,transport',
        price: 0,
        city: 'Lyon',
        postalCode: '69003',
        authorId: bob.id,
        photoUrl: 'https://example.com/velo.jpg'
      },
      {
        title: 'Cours de guitare débutant',
        description: 'Je propose un accompagnement pour apprendre les bases de la guitare acoustique.',
        type: 'CONNAISSANCE',
        tags: 'musique,guitare',
        price: 15,
        city: 'Paris',
        postalCode: '75018',
        authorId: alice.id
      },
      {
        title: 'Promenade de chiens',
        description: 'Je me propose de promener votre chien autour de Nice.',
        type: 'SERVICE',
        tags: 'animaux,chien,promenade',
        price: 0,
        city: 'Nice',
        postalCode: '06000',
        authorId: carla.id
      }
    ]
  });

  console.log('✅ Seed terminé avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
