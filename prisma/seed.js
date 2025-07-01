import { PrismaClient, OfferType } from "@prisma/client";

const prisma = new PrismaClient();

const cities = [
  { city: "Paris", postalCode: "75001" },
  { city: "Compiègne", postalCode: "60200" },
  { city: "Lille", postalCode: "59000" },
  { city: "Strasbourg", postalCode: "67000" },
];

const genders = ["male", "female", "non-binary", "other"];

const tagsPool = [
  "informatique",
  "jardinage",
  "cuisine",
  "bricolage",
  "langues",
  "sport",
  "musique",
  "photographie",
  "aide-étude",
  "transport",
  "mécanique",
  "soutien-scolaire",
  "déménagement",
  "réparation",
  "coaching",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePseudo(index) {
  const adjectives = [
    "rapide",
    "fort",
    "intelligent",
    "gentil",
    "fou",
    "sage",
    "cool",
    "doux",
  ];
  const nouns = [
    "lion",
    "tigre",
    "renard",
    "aigle",
    "ours",
    "chat",
    "loup",
    "panthère",
  ];
  return randomItem(adjectives) + randomItem(nouns) + (index + 1);
}

function generateEmail(pseudo) {
  return `${pseudo}@example.com`;
}

function generateDescription() {
  const descriptions = [
    "Offre de qualité, disponible rapidement.",
    "Service fiable et professionnel.",
    "Je propose mon aide avec plaisir.",
    "Expérience confirmée dans ce domaine.",
    "N’hésitez pas à me contacter pour plus d’infos.",
    "Passionné et motivé, à votre service.",
  ];
  return randomItem(descriptions);
}

function generateOfferTitle() {
  const titles = [
    "Cours de guitare pour débutants",
    "Aide au déménagement",
    "Réparation vélo",
    "Cours d’anglais intensif",
    "Jardinage et entretien espaces verts",
    "Baby-sitting ponctuel",
    "Cours de cuisine italienne",
    "Dépannage informatique",
    "Cours de maths niveau lycée",
    "Transport de colis léger",
    "Coaching sportif personnalisé",
    "Service de traduction français-anglais",
  ];
  return randomItem(titles);
}

function generateOfferDescription() {
  const descs = [
    "Je propose des cours adaptés à votre niveau, en présentiel ou en ligne.",
    "Aide efficace et rapide pour votre déménagement ou transport.",
    "Réparation soignée et rapide de votre vélo ou trottinette.",
    "Cours interactifs et personnalisés pour progresser vite.",
    "Entretien de jardin, plantations, taille et arrosage.",
    "Garde d’enfants fiable, avec références vérifiables.",
    "Ateliers de cuisine pour apprendre les spécialités italiennes.",
    "Diagnostic et résolution de problèmes informatiques courants.",
    "Préparation aux examens avec exercices pratiques.",
    "Transport fiable de vos petits colis en région parisienne.",
    "Programme sportif adapté à vos objectifs personnels.",
    "Traduction professionnelle de documents et textes divers.",
  ];
  return randomItem(descs);
}

function generateTags() {
  const count = randomInt(2, 4);
  const shuffled = [...tagsPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(",");
}

function generatePrice() {
  const isFree = Math.random() < 0.8; // 80% de chance que ce soit gratuit
  if (isFree) return 0;

  // 20% de chance : prix aléatoire entre 1 et 100
  return Math.floor(Math.random() * 100) + 1;
}

function generateNbPeopleHelped() {
  const min = 0;
  const max = 20;
  return randomInt(min, max);
}

async function main() {
  console.log("Seeding database...");

  // Create users
  const users = [];
  for (let i = 0; i < 20; i++) {
    const cityObj = randomItem(cities);
    const pseudo = generatePseudo(i);
    const user = await prisma.user.create({
      data: {
        pseudo,
        email: generateEmail(pseudo),
        phone: `06${randomInt(10_000_000, 99_999_999)}`, // numéro fictif FR
        age: randomInt(18, 60),
        gender: randomItem(genders),
        description: generateDescription(),
        city: cityObj.city,
        nb_people_helped: generateNbPeopleHelped(),
        postalCode: cityObj.postalCode,
      },
    });
    users.push(user);
  }

  // Create offers
  for (let i = 0; i < 40; i++) {
    const author = randomItem(users);
    const cityObj = randomItem(cities);
    await prisma.offer.create({
      data: {
        title: generateOfferTitle(),
        description: generateOfferDescription(),
        type: randomItem([
          OfferType.OBJET,
          OfferType.SERVICE,
          OfferType.CONNAISSANCE,
        ]),
        tags: generateTags(),
        price: generatePrice(),
        city: cityObj.city,
        postalCode: cityObj.postalCode,
        authorId: author.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
