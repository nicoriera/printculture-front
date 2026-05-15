import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.recommendation.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password", 10);

  const [nicolas, marie, pierre, sophie] = await Promise.all([
    prisma.user.create({ data: { email: "nicolas@example.com", password: passwordHash } }),
    prisma.user.create({ data: { email: "marie@example.com", password: passwordHash } }),
    prisma.user.create({ data: { email: "pierre@example.com", password: passwordHash } }),
    prisma.user.create({ data: { email: "sophie@example.com", password: passwordHash } }),
  ]);
  await prisma.user.create({ data: { email: "admin@printculture.com", password: passwordHash } });

  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

  await prisma.recommendation.createMany({
    data: [
      // Movies
      {
        title: "Inception",
        description: "Un film de science-fiction psychologique complexe réalisé par Christopher Nolan, explorant les rêves et la réalité.",
        category: "Movie",
        link: "https://www.imdb.com/title/tt1375666/",
        tag: "science-fiction, psychologique, Nolan",
        videoLink: "https://www.youtube.com/watch?v=YoHD9XEInc0",
        userId: nicolas.id,
        createdAt: daysAgo(30),
        updatedAt: daysAgo(30),
      },
      {
        title: "Parasite",
        description: "Un thriller social coréen qui remporte l'Oscar du meilleur film en 2020. Une critique acerbe de la société moderne.",
        category: "Movie",
        link: "https://www.imdb.com/title/tt6751668/",
        tag: "thriller, social, coréen, oscar",
        videoLink: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
        userId: marie.id,
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25),
      },
      {
        title: "Blade Runner 2049",
        description: "Suite du classique Blade Runner, une exploration visuelle époustouflante du cyberpunk.",
        category: "Movie",
        link: "https://www.imdb.com/title/tt1856101/",
        tag: "cyberpunk, science-fiction, Denis Villeneuve",
        videoLink: "https://www.youtube.com/watch?v=gCcx85zbxz4",
        userId: pierre.id,
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20),
      },
      {
        title: "Documentaire: L'âge de l'intelligence artificielle",
        description: "Un documentaire fascinant sur l'évolution de l'IA et ses implications.",
        category: "Movie",
        tag: "IA, documentaire, technologie, futur",
        videoLink: "https://www.youtube.com/watch?v=UwsrzCVZAb8",
        userId: sophie.id,
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5),
      },
      // Books
      {
        title: "1984",
        description: "Le roman dystopique classique de George Orwell qui reste terriblement actuel.",
        category: "Book",
        link: "https://www.goodreads.com/book/show/61439040-1984",
        tag: "dystopie, Orwell, classique, politique",
        userId: nicolas.id,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(35),
      },
      {
        title: "Le Petit Prince",
        description: "Un conte philosophique intemporel d'Antoine de Saint-Exupéry.",
        category: "Book",
        link: "https://www.goodreads.com/book/show/157993.The_Little_Prince",
        tag: "philosophie, enfance, Saint-Exupéry, poésie",
        videoLink: "https://www.youtube.com/watch?v=4xSd2mUjFHI",
        userId: marie.id,
        createdAt: daysAgo(28),
        updatedAt: daysAgo(28),
      },
      {
        title: "Sapiens",
        description: "Une histoire fascinante de l'humanité par Yuval Noah Harari.",
        category: "Book",
        link: "https://www.goodreads.com/book/show/23692271-sapiens",
        tag: "histoire, anthropologie, Harari, évolution",
        userId: pierre.id,
        createdAt: daysAgo(22),
        updatedAt: daysAgo(22),
      },
      {
        title: "Guide de la typographie moderne",
        description: "Un document PDF complet sur les bonnes pratiques de la typographie en design.",
        category: "Book",
        tag: "design, typographie, PDF, guide",
        userId: sophie.id,
        createdAt: daysAgo(15),
        updatedAt: daysAgo(15),
      },
      // Music
      {
        title: "Dark Side of the Moon",
        description: "L'album mythique de Pink Floyd, un voyage sonore intemporel.",
        category: "Music",
        link: "https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv",
        tag: "prog rock, Pink Floyd, concept album, classique",
        videoLink: "https://www.youtube.com/watch?v=H3v9unphfi0",
        userId: nicolas.id,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(40),
      },
      {
        title: "Kind of Blue",
        description: "L'album de jazz le plus vendu de l'histoire par Miles Davis.",
        category: "Music",
        link: "https://open.spotify.com/album/1weenld61qoidwYuZ1GESA",
        tag: "jazz, Miles Davis, modal, classique",
        videoLink: "https://www.youtube.com/watch?v=ylXk1LBvIqU",
        userId: marie.id,
        createdAt: daysAgo(33),
        updatedAt: daysAgo(33),
      },
      {
        title: "OK Computer",
        description: "Un album visionnaire de Radiohead qui a redéfini le rock alternatif.",
        category: "Music",
        link: "https://open.spotify.com/album/6dVIqQ8qmQ5GBnJ9shOYGE",
        tag: "rock alternatif, Radiohead, concept, dystopie",
        videoLink: "https://www.youtube.com/watch?v=u5CVsCnxyXg",
        userId: pierre.id,
        createdAt: daysAgo(27),
        updatedAt: daysAgo(27),
      },
      {
        title: "Playlist Chill Electronic",
        description: "Une sélection de 20 morceaux électroniques relaxants pour la concentration.",
        category: "Music",
        link: "https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7",
        tag: "électronique, chill, concentration, playlist",
        videoLink: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        userId: sophie.id,
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
      },
      // Podcasts
      {
        title: "France Culture - Les Chemins de la philosophie",
        description: "Un podcast quotidien pour découvrir la philosophie avec des invités passionnants.",
        category: "Podcast",
        link: "https://www.franceculture.fr/emissions/les-chemins-de-la-philosophie",
        tag: "philosophie, France Culture, quotidien, éducation",
        userId: nicolas.id,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
      },
      {
        title: "Radiolab",
        description: "Un podcast américain qui explore la science et la philosophie avec créativité.",
        category: "Podcast",
        link: "https://radiolab.org/",
        tag: "science, philosophie, créatif, storytelling",
        videoLink: "https://www.youtube.com/watch?v=8-0PXdFxV7o",
        userId: marie.id,
        createdAt: daysAgo(38),
        updatedAt: daysAgo(38),
      },
      {
        title: "Le Code a changé",
        description: "Un podcast français sur la technologie et son impact sur la société.",
        category: "Podcast",
        link: "https://www.franceinter.fr/emissions/le-code-a-change",
        tag: "technologie, société, France Inter, numérique",
        userId: pierre.id,
        createdAt: daysAgo(32),
        updatedAt: daysAgo(32),
      },
    ],
  });

  const counts = await Promise.all([
    prisma.user.count(),
    prisma.recommendation.count(),
  ]);
  console.log(`Seeded: ${counts[0]} users, ${counts[1]} recommendations`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
