import prisma from "./db.js";

const comercios = [
  {
    nombre: "Bar El Refugio",
    direccion: "Calle Mayor 2, Pola de Somiedo",
    lat: 43.0923,
    lng: -6.2175,
    horario: "09:00 - 22:00",
    telefono: "985 123 456",
    servicios: [
      { id: "bano", nombre: "Baño", icono: "🚽", incluido: true, descripcion: "Uso del baño del bar" },
      { id: "agua", nombre: "Agua potable", icono: "💧", incluido: true, descripcion: "Grifo en terraza para llenar bidones" },
      { id: "recarga", nombre: "Recarga lenta", icono: "🔌", incluido: true, descripcion: "Enchufe schuko 6A en terraza" },
      { id: "pernocta", nombre: "Aparcamiento nocturno", icono: "🅿️", incluido: false, precio: 0, descripcion: "Parking trasero privado, 20h-9h, sin toldo ni sillas" },
      { id: "ducha", nombre: "Ducha", icono: "🚿", incluido: false, precio: 2, descripcion: "Ducha de agua caliente en aseo" },
    ],
  },
  {
    nombre: "Casa Comercio",
    direccion: "Plaza del Ayuntamiento 5, Pola de Somiedo",
    lat: 43.0931,
    lng: -6.2182,
    horario: "10:00 - 21:00",
    telefono: "985 654 321",
    servicios: [
      { id: "bano", nombre: "Baño", icono: "🚽", incluido: true, descripcion: "Uso del baño" },
      { id: "agua", nombre: "Agua potable", icono: "💧", incluido: true, descripcion: "Grifo para llenar botellas" },
      { id: "pernocta", nombre: "Aparcamiento nocturno", icono: "🅿️", incluido: false, precio: 5, descripcion: "Plaza en parking vigilado, 20h-9h" },
    ],
  },
  {
    nombre: "Bar La Parada",
    direccion: "Calle La Iglesia 3, Cangas del Narcea",
    lat: 43.1105,
    lng: -6.2331,
    horario: "08:30 - 23:00",
    telefono: "985 789 012",
    servicios: [
      { id: "bano", nombre: "Baño", icono: "🚽", incluido: true, descripcion: "Baño limpio con papel" },
      { id: "agua", nombre: "Agua potable", icono: "💧", incluido: true, descripcion: "Grifo en barra" },
      { id: "recarga", nombre: "Recarga lenta", icono: "🔌", incluido: true, descripcion: "Enchufe en barra para móvil y portátil" },
      { id: "pernocta", nombre: "Aparcamiento nocturno", icono: "🅿️", incluido: false, precio: 0, descripcion: "Parking delante del bar, 22h-9h" },
    ],
  },
  {
    nombre: "Tienda El Pueblo",
    direccion: "Avenida Principal 10, Cangas del Narcea",
    lat: 43.1112,
    lng: -6.2345,
    horario: "09:00 - 20:00",
    telefono: "985 345 678",
    servicios: [
      { id: "agua", nombre: "Agua potable", icono: "💧", incluido: true, descripcion: "Fuente en la entrada de la tienda" },
    ],
  },
  {
    nombre: "Gasolinera La Montaña",
    direccion: "Carretera AS-15 km 12, Degaña",
    lat: 43.1185,
    lng: -6.2450,
    horario: "07:00 - 22:00",
    telefono: "985 901 234",
    servicios: [
      { id: "bano", nombre: "Baño", icono: "🚽", incluido: true, descripcion: "Aseo limpio con ducha" },
      { id: "agua", nombre: "Agua potable", icono: "💧", incluido: true, descripcion: "Grifo exterior para autocaravanas" },
      { id: "recarga", nombre: "Recarga lenta", icono: "🔌", incluido: true, descripcion: "Enchufe exterior 6A" },
      { id: "ducha", nombre: "Ducha", icono: "🚿", incluido: false, precio: 3, descripcion: "Ducha de agua caliente" },
      { id: "vaciado", nombre: "Vaciado aguas", icono: "🗑️", incluido: false, precio: 5, descripcion: "Punto de vaciado grises y negras" },
      { id: "pernocta", nombre: "Aparcamiento nocturno", icono: "🅿️", incluido: false, precio: 8, descripcion: "Parking vigilado 24h con electricidad 16A" },
    ],
  },
];

async function seed() {
  console.log("🌱 Sembrando base de datos...");

  await prisma.valoracion.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.establecimiento.deleteMany();

  for (const c of comercios) {
    await prisma.establecimiento.create({
      data: { ...c, servicios: JSON.stringify(c.servicios) },
    });
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
