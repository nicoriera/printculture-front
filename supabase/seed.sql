-- Script SQL pour peupler la base de données PrintCulture
-- Exécuter ce script après avoir créé les tables avec Prisma

-- Nettoyer les données existantes (optionnel)
TRUNCATE TABLE "Recommendation", "User" RESTART IDENTITY CASCADE;

-- Insérer des utilisateurs de test
INSERT INTO "User" (email, password, "createdAt", "updatedAt") VALUES
('nicolas@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
('marie@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
('pierre@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
('sophie@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
('admin@printculture.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- Insérer des recommandations - Films
INSERT INTO "Recommendation" (title, description, category, link, tag, "videoLink", "fileUrl", "fileName", "createdAt", "updatedAt") VALUES
(
    'Inception',
    'Un film de science-fiction psychologique complexe réalisé par Christopher Nolan, explorant les rêves et la réalité.',
    'Movie',
    'https://www.imdb.com/title/tt1375666/',
    'science-fiction, psychologique, Nolan',
    'https://www.youtube.com/watch?v=YoHD9XEInc0',
    NULL,
    NULL,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
),
(
    'Parasite',
    'Un thriller social coréen qui remporte l''Oscar du meilleur film en 2020. Une critique acerbe de la société moderne.',
    'Movie',
    'https://www.imdb.com/title/tt6751668/',
    'thriller, social, coréen, oscar',
    'https://www.youtube.com/watch?v=5xH0HfJHsaY',
    NULL,
    NULL,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
),
(
    'Blade Runner 2049',
    'Suite du classique Blade Runner, une exploration visuelle époustouflante du cyberpunk.',
    'Movie',
    'https://www.imdb.com/title/tt1856101/',
    'cyberpunk, science-fiction, Denis Villeneuve',
    'https://www.youtube.com/watch?v=gCcx85zbxz4',
    NULL,
    NULL,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
);

-- Insérer des recommandations - Livres
INSERT INTO "Recommendation" (title, description, category, link, tag, "videoLink", "fileUrl", "fileName", "createdAt", "updatedAt") VALUES
(
    '1984',
    'Le roman dystopique classique de George Orwell qui reste terriblement actuel.',
    'Book',
    'https://www.goodreads.com/book/show/61439040-1984',
    'dystopie, Orwell, classique, politique',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '35 days'
),
(
    'Le Petit Prince',
    'Un conte philosophique intemporel d''Antoine de Saint-Exupéry.',
    'Book',
    'https://www.goodreads.com/book/show/157993.The_Little_Prince',
    'philosophie, enfance, Saint-Exupéry, poésie',
    'https://www.youtube.com/watch?v=4xSd2mUjFHI',
    NULL,
    NULL,
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '28 days'
),
(
    'Sapiens',
    'Une histoire fascinante de l''humanité par Yuval Noah Harari.',
    'Book',
    'https://www.goodreads.com/book/show/23692271-sapiens',
    'histoire, anthropologie, Harari, évolution',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '22 days',
    NOW() - INTERVAL '22 days'
);

-- Insérer des recommandations - Musique
INSERT INTO "Recommendation" (title, description, category, link, tag, "videoLink", "fileUrl", "fileName", "createdAt", "updatedAt") VALUES
(
    'Dark Side of the Moon',
    'L''album mythique de Pink Floyd, un voyage sonore intemporel.',
    'Music',
    'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv',
    'prog rock, Pink Floyd, concept album, classique',
    'https://www.youtube.com/watch?v=H3v9unphfi0',
    NULL,
    NULL,
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '40 days'
),
(
    'Kind of Blue',
    'L''album de jazz le plus vendu de l''histoire par Miles Davis.',
    'Music',
    'https://open.spotify.com/album/1weenld61qoidwYuZ1GESA',
    'jazz, Miles Davis, modal, classique',
    'https://www.youtube.com/watch?v=ylXk1LBvIqU',
    NULL,
    NULL,
    NOW() - INTERVAL '33 days',
    NOW() - INTERVAL '33 days'
),
(
    'OK Computer',
    'Un album visionnaire de Radiohead qui a redéfini le rock alternatif.',
    'Music',
    'https://open.spotify.com/album/6dVIqQ8qmQ5GBnJ9shOYGE',
    'rock alternatif, Radiohead, concept, dystopie',
    'https://www.youtube.com/watch?v=u5CVsCnxyXg',
    NULL,
    NULL,
    NOW() - INTERVAL '27 days',
    NOW() - INTERVAL '27 days'
);

-- Insérer des recommandations - Podcasts
INSERT INTO "Recommendation" (title, description, category, link, tag, "videoLink", "fileUrl", "fileName", "createdAt", "updatedAt") VALUES
(
    'France Culture - Les Chemins de la philosophie',
    'Un podcast quotidien pour découvrir la philosophie avec des invités passionnants.',
    'Podcast',
    'https://www.franceculture.fr/emissions/les-chemins-de-la-philosophie',
    'philosophie, France Culture, quotidien, éducation',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '45 days'
),
(
    'Radiolab',
    'Un podcast américain qui explore la science et la philosophie avec créativité.',
    'Podcast',
    'https://radiolab.org/',
    'science, philosophie, créatif, storytelling',
    'https://www.youtube.com/watch?v=8-0PXdFxV7o',
    NULL,
    NULL,
    NOW() - INTERVAL '38 days',
    NOW() - INTERVAL '38 days'
),
(
    'Le Code a changé',
    'Un podcast français sur la technologie et son impact sur la société.',
    'Podcast',
    'https://www.franceinter.fr/emissions/le-code-a-change',
    'technologie, société, France Inter, numérique',
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '32 days',
    NOW() - INTERVAL '32 days'
);

-- Insérer des recommandations mixtes avec des fichiers
INSERT INTO "Recommendation" (title, description, category, link, tag, "videoLink", "fileUrl", "fileName", "createdAt", "updatedAt") VALUES
(
    'Guide de la typographie moderne',
    'Un document PDF complet sur les bonnes pratiques de la typographie en design.',
    'Book',
    NULL,
    'design, typographie, PDF, guide',
    NULL,
    'https://supabase.example.com/storage/files/typography-guide.pdf',
    'typography-guide.pdf',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
),
(
    'Tutorial CSS Grid',
    'Un fichier markdown avec des exemples pratiques de CSS Grid Layout.',
    'Book',
    NULL,
    'CSS, Grid, tutorial, frontend',
    NULL,
    'https://supabase.example.com/storage/files/css-grid-tutorial.md',
    'css-grid-tutorial.md',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
),
(
    'Playlist Chill Electronic',
    'Une sélection de 20 morceaux électroniques relaxants pour la concentration.',
    'Music',
    'https://open.spotify.com/playlist/37i9dQZF1DX6VdMW310YC7',
    'électronique, chill, concentration, playlist',
    'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'https://supabase.example.com/storage/files/chill-electronic-playlist.json',
    'chill-electronic-playlist.json',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
),
(
    'Documentaire: L''âge de l''intelligence artificielle',
    'Un documentaire fascinant sur l''évolution de l''IA et ses implications.',
    'Movie',
    NULL,
    'IA, documentaire, technologie, futur',
    'https://www.youtube.com/watch?v=UwsrzCVZAb8',
    NULL,
    NULL,
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
);

-- Afficher le nombre d'enregistrements insérés
SELECT 
    'Users' as table_name, 
    COUNT(*) as count 
FROM "User"
UNION ALL
SELECT 
    'Recommendations' as table_name, 
    COUNT(*) as count 
FROM "Recommendation";

-- Afficher les statistiques par catégorie
SELECT 
    category,
    COUNT(*) as count
FROM "Recommendation"
GROUP BY category
ORDER BY count DESC;
