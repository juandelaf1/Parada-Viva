export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold text-stone-800 mb-4">Parada Viva</h1>
      <p className="text-lg text-stone-600 text-center max-w-md mb-8">
        Conectamos caravanistas con bares y tiendas de pueblo.
        Consume mínimo 1€, usa su baño, llena tu agua, recarga tus baterías.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <a
          href="/mapa"
          className="bg-emerald-600 text-white text-center py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          Ver mapa de comercios
        </a>
        <a
          href="/registro"
          className="bg-stone-200 text-stone-800 text-center py-3 px-6 rounded-lg font-semibold hover:bg-stone-300 transition"
        >
          Unirse a la red
        </a>
      </div>

      <footer className="mt-16 text-sm text-stone-400 space-y-1 text-center">
        <p>Asturias interior — Próximamente Mallorca</p>
        <p>© 2026 Parada Viva</p>
      </footer>
    </main>
  );
}
