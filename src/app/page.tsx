export default function Home() {
  return (
    <section className="w-3/4 mx-auto">
      <div className="text-center">
        <div className="mx-auto h-dvh flex flex-col justify-center mb-8 lg:mb-16">
          <h1 className="mb-4 text-9xl tracking-tight font-extrabold text-blue-500">
            PRINT TEAM
          </h1>
          <p className="font-light text-neutral-500 sm:text-xl">
            Connect with our print mate.
          </p>
        </div>

        <div className="mx-auto h-dvh flex flex-col justify-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-bold text-blue-600">
            Partagez vos coups de cœur entre amis !
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-200/30">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">
                🤝 Réseau privé
              </h3>
              <p className="text-neutral-600">
                Créez votre cercle intime de partage. Ici, vos recommandations
                restent entre vous et vos proches, comme un club secret des bons
                plans !
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-200/30">
              <h3 className="text-xl font-semibold mb-2 text-green-600">
                🌟 Recommandations personnalisées
              </h3>
              <p className="text-neutral-600">
                Films, livres, musiques ou podcasts : partagez vos découvertes
                préférées et recevez des suggestions sur mesure de vos amis !
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-200/30">
              <h3 className="text-xl font-semibold mb-2 text-orange-600">
                💬 Échangez et discutez
              </h3>
              <p className="text-neutral-600">
                Commentez les recommandations, débattez de vos impressions et
                approfondissez vos liens autour de vos passions communes !
              </p>
            </div>
          </div>
          <p className="mt-6 text-center text-neutral-500">
            Rejoignez dès maintenant votre cercle de confiance et commencez à
            partager vos pépites culturelles !
          </p>
        </div>

        <div className="mx-auto h-dvh flex flex-col justify-center mb-8 lg:mb-16">
          <h2 className="mb-6 text-3xl tracking-tight font-bold text-neutral-700">
            Discutez en temps réel avec notre chat intégré !
          </h2>
          <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-200/30">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              🗨️ Échangez instantanément
            </h3>
            <ul className="space-y-2 text-neutral-600">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Discutez en privé ou en groupe
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Partagez des liens et des médias facilement
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Restez connecté avec vos amis cinéphiles, mélomanes et lecteurs
              </li>
            </ul>
            <p className="mt-4 text-neutral-500">
              Avec notre chat intégré, vos discussions autour de vos passions
              n&apos;ont jamais été aussi fluides !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
