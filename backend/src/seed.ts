import prisma from "./db.js";

const comercios = [
  {
    nombre: "Bar El Refugio",
    direccion: "Calle Mayor 2, Pola de Somiedo",
    lat: 43.0923,
    lng: -6.2175,
    horario: "09:00 - 22:00",
    telefono: "985 123 456",
    tieneBano: true,
    tieneAgua: true,
    tieneRecarga: true,
  },
  {
    nombre: "Casa Comercio",
    direccion: "Plaza del Ayuntamiento 5, Pola de Somiedo",
    lat: 43.0931,
    lng: -6.2182,
    horario: "10:00 - 21:00",
    telefono: "985 654 321",
    tieneBano: true,
    tieneAgua: true,
    tieneRecarga: false,
  },
  {
    nombre: "Bar La Parada",
    direccion: "Calle La Iglesia 3, Cangas del Narcea",
    lat: 43.1105,
    lng: -6.2331,
    horario: "08:30 - 23:00",
    telefono: "985 789 012",
    tieneBano: true,
    tieneAgua: true,
    tieneRecarga: true,
  },
  {
    nombre: "Tienda El Pueblo",
    direccion: "Avenida Principal 10, Cangas del Narcea",
    lat: 43.1112,
    lng: -6.2345,
    horario: "09:00 - 20:00",
    telefono: "985 345 678",
    tieneBano: false,
    tieneAgua: true,
    tieneRecarga: false,
  },
  {
    nombre: "Gasolinera La Montaña",
    direccion: "Carretera AS-15 km 12, Degaña",
    lat: 43.1185,
    lng: -6.2450,
    horario: "07:00 - 22:00",
    telefono: "985 901 234",
    tieneBano: true,
    tieneAgua: true,
    tieneRecarga: true,
  },
];

async function seed() {
  console.log("🌱 Sembrando base de datos...");

  await prisma.valoracion.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.establecimiento.deleteMany();

  for (const c of comercios) {
    await prisma.establecimiento.create({ data: c });
    console.log(`  ✅ ${c.nombre}`);
  }

  console.log("🌱 Semilla completada");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
