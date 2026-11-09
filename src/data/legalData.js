export const ARGENTINA_PROVINCIAS = [
  "Ciudad Autónoma de Buenos Aires (CABA)",
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán"
];

export const DEFAULT_BANNERS = [
  {
    id: "banner-1",
    title: "Defensa Penal Estratégica las 24 Hs",
    subtitle: "Atención inmediata en comisarías, juzgados y fiscalías de todo el país.",
    tag: "ÁREA PENAL",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Consultar Urgencia",
    linkTarget: "#contacto"
  },
  {
    id: "banner-2",
    title: "Reclamos Civiles, Sucesiones y Accidentes",
    subtitle: "Hacemos valer tus derechos para que obtengas la máxima indemnización.",
    tag: "ÁREA CIVIL",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Iniciar Consulta",
    linkTarget: "#areas"
  },
  {
    id: "banner-3",
    title: "Protección a Jubilados y Pensionados",
    subtitle: "Revisión urgente de descuentos indebidos, préstamos fraudulentos y trámites ANSES.",
    tag: "PREVISIONAL",
    imageUrl: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Recuperá tu haber",
    linkTarget: "#areas"
  }
];

export const DEFAULT_VIDEOS = [
  {
    id: "video-1",
    title: "¿Qué hacer ante una denuncia o citación penal en Argentina?",
    category: "Área Penal",
    description: "Recomendaciones claves antes de declarar y cómo actuar en las primeras 24 horas.",
    url: "https://www.youtube.com/embed/ScMzIvxBSi4",
    thumbnail: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "video-2",
    title: "Sucesiones y Declaratoria de Herederos paso a paso",
    category: "Área Civil",
    description: "Tiempos, documentación requerida y acuerdos entre coherederos.",
    url: "https://www.youtube.com/embed/ysz5S6PUM-U",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "video-3",
    title: "Descuentos no autorizados en recibos de jubilación (ANSES)",
    category: "Jubilados y Pensionados",
    description: "Cómo frenar débitos automáticos abusivos y exigir el reintegro con intereses.",
    url: "https://www.youtube.com/embed/jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  }
];

export const CONTACTO_OFICIAL = {
  telefonos: [
    { numero: "11 3461-4115", link: "5491134614115", ciudad: "Buenos Aires / CABA" },
    { numero: "11 5473-5455", link: "5491154735455", ciudad: "Guardia Jurídica" },
    { numero: "381 573-6202", link: "5493815736202", ciudad: "Tucumán / NOA" }
  ],
  sedes: [
    {
      provincia: "CABA",
      subtitulo: "Tribunales / Centro Judicial",
      direccion: "Viamonte 1390, piso 3, dpto. 2",
      detalle: "Ciudad Autónoma de Buenos Aires",
      icono: "fa-building-columns"
    },
    {
      provincia: "TUCUMÁN",
      subtitulo: "San Miguel de Tucumán",
      direccion: "Celedonio Gutiérrez 616",
      detalle: "San Miguel de Tucumán",
      icono: "fa-scale-balanced"
    },
    {
      provincia: "SANTIAGO DEL ESTERO",
      subtitulo: "Capital",
      direccion: "Pedro León Gallo 128",
      detalle: "Santiago del Estero",
      icono: "fa-landmark"
    }
  ]
};
