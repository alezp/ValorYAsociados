/**
 * Estudio Jurídico Valor y Asociados
 * Datos iniciales: Provincias argentinas, Banners precargados, Videos y Base de Conocimiento del Bot
 */

const ARGENTINA_PROVINCIAS = [
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

const DEFAULT_BANNERS = [
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

const DEFAULT_VIDEOS = [
  {
    id: "video-1",
    title: "¿Qué hacer ante una denuncia o citación penal en Argentina?",
    category: "Área Penal",
    description: "Recomendaciones claves antes de declarar y cómo actuar en las primeras 24 horas.",
    type: "youtube",
    url: "https://www.youtube.com/embed/ScMzIvxBSi4",
    thumbnail: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "video-2",
    title: "Sucesiones y Declaratoria de Herederos paso a paso",
    category: "Área Civil",
    description: "Tiempos, documentación requerida y acuerdos entre coherederos.",
    type: "youtube",
    url: "https://www.youtube.com/embed/ysz5S6PUM-U",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "video-3",
    title: "Descuentos no autorizados en recibos de jubilación (ANSES)",
    category: "Jubilados y Pensionados",
    description: "Cómo frenar débitos automáticos abusivos y exigir el reintegro con intereses.",
    type: "youtube",
    url: "https://www.youtube.com/embed/jNQXAC9IVRw",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  }
];

const CONTACTO_OFICIAL = {
  telefonos: [
    { numero: "11 3461-4115", link: "5491134614115", ciudad: "Buenos Aires / CABA" },
    { numero: "11 5473-5455", link: "5491154735455", ciudad: "Guardia Jurídica" },
    { numero: "381 573-6202", link: "5493815736202", ciudad: "Tucumán / NOA" }
  ],
  sedes: [
    {
      provincia: "CABA",
      direccion: "Viamonte 1390, piso 3, dpto. 2",
      detalle: "Tribunales / Centro Judicial",
      icono: "fa-building-columns"
    },
    {
      provincia: "TUCUMÁN",
      direccion: "Celedonio Gutiérrez 616",
      detalle: "San Miguel de Tucumán",
      icono: "fa-scale-balanced"
    },
    {
      provincia: "SANTIAGO DEL ESTERO",
      direccion: "Pedro León Gallo 128",
      detalle: "Capital",
      icono: "fa-landmark"
    }
  ]
};

// Base de preguntas frecuentes y respuestas automatizadas del Bot legal
const BOT_KNOWLEDGE = {
  saludo: {
    mensaje: "¡Hola! Bienvenido a **Valor y Asociados**. Soy el asistente legal virtual del estudio. Para brindarte una respuesta precisa y conectarte con el abogado correspondiente según tu jurisdicción, ¿de qué **provincia de Argentina** te comunicás?",
    esperaProvincia: true
  },
  areas: [
    {
      id: "penal",
      titulo: "⚖️ Área Penal",
      descripcion: "Defensas, denuncias, allanamientos, estafas virtuales y detenciones.",
      respuestas: [
        {
          clave: "denuncia",
          titulo: "¿Te denunciaron penalmente?",
          texto: "Si fuiste denunciado o citado a declarar en fiscalía/comisaría, **tenés derecho constitucional a no declarar sin la presencia de un abogado de confianza**. Nunca declares sin asesoramiento previo. En Valor y Asociados asumimos defensas urgentes en CABA, Tucumán, Santiago del Estero y juzgados federales."
        },
        {
          clave: "victima",
          titulo: "Fuiste víctima de un delito / Querellas",
          texto: "Podemos presentarnos como **querellantes particulares** para impulsar la investigación, aportar pruebas periciales, solicitar allanamientos y pedir medidas cautelares o perimetrales de protección."
        },
        {
          clave: "estafa",
          titulo: "Estafas virtuales y delitos informáticos",
          texto: "Asesoramos en phishing bancario, hackeos de WhatsApp, transferencias no autorizadas y fraudes cripto. Solicitamos medidas cautelares bancarias inmediatas para congelar fondos."
        }
      ]
    },
    {
      id: "civil",
      titulo: "📄 Área Civil y Comercial",
      descripcion: "Accidentes, sucesiones, deudas, contratos y reclamos patrimoniales.",
      respuestas: [
        {
          clave: "accidente",
          titulo: "Accidentes de tránsito e indemnizaciones",
          texto: "Gestionamos el reclamo integral contra las aseguradoras por daños materiales, lesiones corporales, incapacidad sobreviniente y daño moral. Cobramos a resultado."
        },
        {
          clave: "sucesion",
          titulo: "Sucesiones y herencias",
          texto: "Iniciamos la declaratoria de herederos en tiempo récord. Si hay bienes en CABA, Provincia de Buenos Aires, Tucumán o Santiago del Estero, coordinamos la partición e inscripción registral."
        },
        {
          clave: "deudas",
          titulo: "Cobro de pesos, cheques y contratos incumplidos",
          texto: "Acciones ejecutivas y ordinarias para recupero crediticio, embargos preventivos e intimaciones prejudiciales vía carta documento."
        }
      ]
    },
    {
      id: "jubilados",
      titulo: "👥 Jubilados y Pensionados",
      descripcion: "Descuentos en haberes, créditos abusivos, bancos y ANSES.",
      respuestas: [
        {
          clave: "descuentos",
          titulo: "¿Te descuentan dinero sin autorización?",
          texto: "Si detectás mutuales, cooperativas o seguros que debitan de tu haber jubilatorio sin tu consentimiento expreso, iniciamos la **medida cautelar de cese inmediato** y el reclamo por reintegro retroactivo más daño punitivo."
        },
        {
          clave: "bancos",
          titulo: "Reclamos bancarios y cambio de boca de pago",
          texto: "Te asesoramos para detener débitos de financieras usurarias y tramitar el cambio de sucursal bancaria ante ANSES."
        }
      ]
    }
  ]
};
