/**
 * Script de migration des données depuis l'ancienne base Rails vers Supabase
 *
 * Usage:
 * 1. Configurer les variables d'environnement
 * 2. Exécuter: npx tsx scripts/migrate-data.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface OldRecommendation {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  link: string | null;
  tag: string | null;
  videoLink?: string | null;
  created_at: string;
  updated_at: string;
}

async function migrateRecommendations() {
  console.log("🚀 Début de la migration des recommandations...");

  try {
    // Note: Vous devrez adapter cette partie selon votre ancienne base de données
    // Exemple avec une connexion directe à l'ancienne DB ou import depuis un export JSON

    // Simuler des données d'exemple (remplacer par vos vraies données)
    const oldRecommendations: OldRecommendation[] = [
      {
        id: 1,
        title: "Exemple de recommandation",
        description: "Description de test",
        category: "Movie",
        link: "https://example.com",
        tag: "Action",
        videoLink: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      // Ajouter d'autres recommandations ici
    ];

    console.log(`📊 ${oldRecommendations.length} recommandations à migrer`);

    let migrated = 0;
    let errors = 0;

    for (const oldRec of oldRecommendations) {
      try {
        await prisma.recommendation.create({
          data: {
            title: oldRec.title,
            description: oldRec.description,
            category: oldRec.category,
            link: oldRec.link,
            tag: oldRec.tag,
            videoLink: oldRec.videoLink,
            createdAt: new Date(oldRec.created_at),
            updatedAt: new Date(oldRec.updated_at),
          },
        });

        migrated++;
        console.log(`✅ Migré: ${oldRec.title}`);
      } catch (error) {
        errors++;
        console.error(
          `❌ Erreur lors de la migration de "${oldRec.title}":`,
          error
        );
      }
    }

    console.log(`\n📈 Résultat de la migration:`);
    console.log(`   ✅ Migrées: ${migrated}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log(`   📊 Total: ${oldRecommendations.length}`);
  } catch (error) {
    console.error("💥 Erreur lors de la migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function verifyMigration() {
  console.log("\n🔍 Vérification de la migration...");

  try {
    const count = await prisma.recommendation.count();
    console.log(
      `📊 Nombre total de recommandations dans la nouvelle DB: ${count}`
    );

    const categories = await prisma.recommendation.groupBy({
      by: ["category"],
      _count: {
        category: true,
      },
    });

    console.log("\n📋 Répartition par catégorie:");
    categories.forEach((cat) => {
      console.log(
        `   ${cat.category || "Sans catégorie"}: ${cat._count.category}`
      );
    });
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
  }
}

async function main() {
  console.log("🎯 Migration des données Print Culture");
  console.log("=====================================\n");

  // Vérifier la connexion à la base de données
  try {
    await prisma.$connect();
    console.log("✅ Connexion à la base de données établie");
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base de données:", error);
    process.exit(1);
  }

  // Exécuter la migration
  await migrateRecommendations();

  // Vérifier les résultats
  await verifyMigration();

  console.log("\n🎉 Migration terminée!");
}

// Exécuter le script
main().catch((error) => {
  console.error("💥 Erreur fatale:", error);
  process.exit(1);
});
