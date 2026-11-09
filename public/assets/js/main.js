/**
 * ESTUDIO JURÍDICO VALOR Y ASOCIADOS
 * Script principal: Inicializaciones, Formulario con selector de Provincias y Talones interactivos
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Gestor de Medios (Banners & Videos)
  window.mediaManagerInstance = new MediaManager();

  // 2. Inicializar Chatbot
  window.chatbotInstance = new LegalChatbot();

  // 3. Poblar el selector de provincias de Argentina en el formulario
  initProvinciaSelect();

  // 4. Manejar envío del formulario de consulta
  initConsultationForm();

  // 5. Inicializar talones interactivos del flyer ("Arrancá tu teléfono")
  initTearTabs();

  // 6. Menú móvil
  initMobileMenu();
});

/**
 * Llena el <select> de provincias con las 24 jurisdicciones de Argentina
 */
function initProvinciaSelect() {
  const select = document.getElementById('consultaProvincia');
  if (!select) return;

  ARGENTINA_PROVINCIAS.forEach(prov => {
    const opt = document.createElement('option');
    opt.value = prov;
    opt.textContent = prov;
    select.appendChild(opt);
  });
}

/**
 * Gestión del formulario principal de consulta
 */
function initConsultationForm() {
  const form = document.getElementById('formConsultaPrincipal');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('consultaNombre').value.trim();
    const telefono = document.getElementById('consultaTelefono').value.trim();
    const provincia = document.getElementById('consultaProvincia').value;
    const area = document.getElementById('consultaArea').value;
    const mensaje = document.getElementById('consultaMensaje').value.trim();

    if (!nombre || !telefono || !provincia || !area || !mensaje) {
      alert("Por favor completá todos los campos requeridos para poder evaluar tu caso.");
      return;
    }

    // Guardar en leads locales
    try {
      const leads = JSON.parse(localStorage.getItem('valor_consultas_leads') || '[]');
      leads.unshift({
        fecha: new Date().toLocaleString('es-AR'),
        nombre,
        telefono,
        provincia,
        area,
        mensaje
      });
      localStorage.setItem('valor_consultas_leads', JSON.stringify(leads));
    } catch (err) {
      console.warn("Storage no disponible", err);
    }

    // Elegir teléfono para whatsapp
    let tel = "5491134614115";
    if (provincia.toLowerCase().includes("tucumán") || provincia.toLowerCase().includes("santiago") || provincia.toLowerCase().includes("noa")) {
      tel = "5493815736202";
    }

    const textoWhatsApp = encodeURIComponent(
      `Hola Estudio Jurídico Valor y Asociados.\nMi nombre es: ${nombre}\nTeléfono: ${telefono}\nProvincia: ${provincia}\nÁrea: ${area}\nConsulta: ${mensaje}`
    );

    const waLink = `https://wa.me/${tel}?text=${textoWhatsApp}`;

    // Feedback visual
    const container = form.parentElement;
    container.innerHTML = `
      <div style="text-align: center; padding: 25px 10px;">
        <div style="width: 70px; height: 70px; background: #eef7f0; color: #1b6330; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 20px auto; border: 2px solid #25d366;">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3 style="font-size: 1.6rem; color: var(--primary-navy); margin-bottom: 8px;">¡Consulta Recibida con Éxito!</h3>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">
          Estimado/a <strong>${nombre}</strong>, tu caso para la jurisdicción de <strong>${provincia}</strong> ha sido ingresado en nuestro sistema.
        </p>
        <p style="font-size: 0.88rem; color: var(--accent-green); font-weight: 700; margin-bottom: 24px;">
          Para atención inmediata prioritaria, comunicate directo con la guardia de tu zona:
        </p>
        <a href="${waLink}" target="_blank" class="btn btn-whatsapp" style="font-size: 1rem; padding: 14px 28px; width: 100%; margin-bottom: 12px;">
          <i class="fa-brands fa-whatsapp"></i> Continuar por WhatsApp con el Abogado
        </a>
        <button onclick="location.reload()" class="btn btn-outline" style="width: 100%; font-size: 0.85rem;">
          Cargar otra consulta
        </button>
      </div>
    `;
  });
}

/**
 * Talones interactivos que replican el flyer ("ARRANCÁ TU TELÉFONO DE CONTACTO")
 */
function initTearTabs() {
  const tabs = document.querySelectorAll('.tear-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const phone = tab.getAttribute('data-phone') || '11 3461-4115';
      const cleanPhone = phone.replace(/[^0-9]/g, '');

      // Animación de arrancar
      tab.classList.add('torn');

      // Copiar al portapapeles
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone);
      }

      // Preguntar si quiere abrir WhatsApp directo
      setTimeout(() => {
        const abrir = confirm(`¡Arrancaste el teléfono ${phone}! (Copiado al portapapeles).\n\n¿Querés enviar un mensaje de WhatsApp ahora mismo al estudio?`);
        if (abrir) {
          window.open(`https://wa.me/549${cleanPhone}?text=Hola%2C%20quisiera%20hacer%20una%20consulta%20legal%20con%20Valor%20y%20Asociados`, '_blank');
        }
      }, 250);
    });
  });
}

/**
 * Menú móvil toggle
 */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.innerHTML = navLinks.classList.contains('open')
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Cerrar menú al hacer clic en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}
