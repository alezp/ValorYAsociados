/**
 * ESTUDIO JURÍDICO VALOR Y ASOCIADOS
 * Motor del Chatbot Legal Inteligente con Selector de Provincia y Derivación Humana
 */

class LegalChatbot {
  constructor() {
    this.widget = document.getElementById('chatbotWidget');
    this.window = document.getElementById('chatbotWindow');
    this.trigger = document.getElementById('chatbotTrigger');
    this.closeBtn = document.getElementById('chatbotClose');
    this.messagesContainer = document.getElementById('chatbotMessages');
    this.input = document.getElementById('chatbotInput');
    this.sendBtn = document.getElementById('chatbotSend');
    this.badge = document.getElementById('chatbotBadge');

    // Estado de la conversación
    this.userState = {
      provincia: null,
      nombre: null,
      areaInteres: null,
      consultaActual: null,
      historial: []
    };

    this.initEvents();
  }

  initEvents() {
    // Abrir/cerrar ventana
    this.trigger.addEventListener('click', () => this.toggleWindow());
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeWindow());
    }

    // Enviar mensaje con click o Enter
    this.sendBtn.addEventListener('click', () => this.handleUserSubmit());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleUserSubmit();
      }
    });

    // Iniciar con bienvenida
    setTimeout(() => {
      this.renderWelcome();
    }, 600);
  }

  toggleWindow() {
    const isOpen = this.window.classList.toggle('open');
    if (isOpen) {
      if (this.badge) this.badge.style.display = 'none';
      this.input.focus();
    }
  }

  closeWindow() {
    this.window.classList.remove('open');
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  appendMessage(text, sender = 'bot', options = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    // Convertir markdown básico (**negrita**)
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    msgDiv.innerHTML = `<div>${formattedText}</div>`;

    if (options && options.length > 0) {
      const optionsWrap = document.createElement('div');
      optionsWrap.className = 'message-options';
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.innerHTML = `<span>${opt.label}</span> <i class="fa-solid fa-chevron-right"></i>`;
        btn.addEventListener('click', () => {
          optionsWrap.remove(); // Evita clicks múltiples repetidos
          opt.action();
        });
        optionsWrap.appendChild(btn);
      });
      msgDiv.appendChild(optionsWrap);
    }

    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  renderWelcome() {
    this.appendMessage(
      "⚖️ ¡Hola! Soy el asistente inteligente de **Valor y Asociados**. Para orientarte y asignarte al especialista en tu jurisdicción, ¿desde qué **provincia de Argentina** nos consultas?",
      'bot',
      [
        {
          label: "📍 CABA / Buenos Aires",
          action: () => this.setProvincia("Ciudad Autónoma de Buenos Aires (CABA)")
        },
        {
          label: "📍 Tucumán",
          action: () => this.setProvincia("Tucumán")
        },
        {
          label: "📍 Santiago del Estero",
          action: () => this.setProvincia("Santiago del Estero")
        },
        {
          label: "🌎 Elegir otra provincia de Argentina",
          action: () => this.promptProvinciaSelector()
        }
      ]
    );
  }

  promptProvinciaSelector() {
    const selectHtml = document.createElement('div');
    selectHtml.className = 'message bot';
    selectHtml.innerHTML = `
      <p style="margin-bottom: 8px;"><strong>Selecciona tu provincia:</strong></p>
      <select id="chatProvinciaSelect" class="form-control" style="font-size: 0.85rem; padding: 6px;">
        <option value="">-- Elige una provincia --</option>
        ${ARGENTINA_PROVINCIAS.map(p => `<option value="${p}">${p}</option>`).join('')}
      </select>
      <button id="btnConfirmProv" class="btn btn-primary" style="margin-top: 8px; width: 100%; padding: 6px; font-size: 0.8rem;">Confirmar Provincia</button>
    `;
    this.messagesContainer.appendChild(selectHtml);
    this.scrollToBottom();

    document.getElementById('btnConfirmProv').addEventListener('click', () => {
      const select = document.getElementById('chatProvinciaSelect');
      if (select.value) {
        selectHtml.remove();
        this.setProvincia(select.value);
      }
    });
  }

  setProvincia(provincia) {
    this.userState.provincia = provincia;
    this.appendMessage(`Estoy en **${provincia}**`, 'user');

    // Sincronizar también con el formulario de la landing
    const formProvSelect = document.getElementById('consultaProvincia');
    if (formProvSelect) {
      formProvSelect.value = provincia;
    }

    setTimeout(() => {
      this.appendMessage(
        `Excelente. Contamos con cobertura y representación legal en **${provincia}**.\n\n¿Sobre qué temática legal es tu consulta principal?`,
        'bot',
        [
          {
            label: "⚖️ Área Penal (Urgencias, denuncias, defensas)",
            action: () => this.selectArea("penal")
          },
          {
            label: "📄 Área Civil (Accidentes, herencias, reclamos)",
            action: () => this.selectArea("civil")
          },
          {
            label: "👥 Jubilados y Pensionados (Descuentos, ANSES)",
            action: () => this.selectArea("jubilados")
          },
          {
            label: "👨‍⚖️ Hablar directamente con un Abogado",
            action: () => this.escalateToHuman("Solicitud directa de comunicación con abogado")
          }
        ]
      );
    }, 400);
  }

  selectArea(areaKey) {
    this.userState.areaInteres = areaKey;
    const area = BOT_KNOWLEDGE.areas.find(a => a.id === areaKey);

    if (area) {
      this.appendMessage(`Consulta sobre ${area.titulo}`, 'user');

      const opciones = area.respuestas.map(r => ({
        label: r.titulo,
        action: () => this.showAnswer(r.texto, r.titulo)
      }));

      // Agregar opción de derivar a humano siempre
      opciones.push({
        label: "💬 Mi caso es específico (Hablar con un operador)",
        action: () => this.escalateToHuman(`Consulta personalizada en ${area.titulo}`)
      });

      setTimeout(() => {
        this.appendMessage(
          `**${area.titulo}**\n${area.descripcion}\n\nSeleccioná el tema más cercano a tu situación o escribinos tu duda en el campo de texto inferior:`,
          'bot',
          opciones
        );
      }, 400);
    }
  }

  showAnswer(textoRespuesta, tema) {
    this.appendMessage(tema, 'user');
    setTimeout(() => {
      this.appendMessage(textoRespuesta, 'bot', [
        {
          label: "✅ ¿Deseas iniciar una acción legal con nosotros?",
          action: () => this.escalateToHuman(`Interés en accionar por: ${tema}`)
        },
        {
          label: "🔄 Consultar otro tema",
          action: () => this.renderMenuAreas()
        }
      ]);
    }, 400);
  }

  renderMenuAreas() {
    this.appendMessage(
      "¿Sobre qué otra área necesitas asesoramiento?",
      'bot',
      [
        {
          label: "⚖️ Área Penal",
          action: () => this.selectArea("penal")
        },
        {
          label: "📄 Área Civil",
          action: () => this.selectArea("civil")
        },
        {
          label: "👥 Jubilados y Pensionados",
          action: () => this.selectArea("jubilados")
        },
        {
          label: "📞 Hablar con un Abogado de Guardia",
          action: () => this.escalateToHuman("Consulta libre general")
        }
      ]
    );
  }

  handleUserSubmit() {
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    this.appendMessage(text, 'user');
    this.processNLP(text);
  }

  processNLP(query) {
    const q = query.toLowerCase();

    // 1. Si aún no fijó provincia y escribe una provincia
    if (!this.userState.provincia) {
      const matchProv = ARGENTINA_PROVINCIAS.find(p => q.includes(p.toLowerCase()));
      if (matchProv) {
        this.setProvincia(matchProv);
        return;
      }
    }

    // 2. Detección de intención humana explícita
    if (q.includes("humano") || q.includes("abogado") || q.includes("hablar") || q.includes("persona") || q.includes("telefono") || q.includes("whatsapp") || q.includes("llamar") || q.includes("urgente")) {
      setTimeout(() => {
        this.escalateToHuman(query);
      }, 500);
      return;
    }

    // 3. Búsqueda de coincidencia en base de conocimiento
    let found = false;

    // Penal
    if (q.includes("denuncia") || q.includes("preso") || q.includes("fiscalia") || q.includes("comisaria") || q.includes("estafa") || q.includes("delito") || q.includes("robo") || q.includes("violencia") || q.includes("allanamiento")) {
      found = true;
      const resp = BOT_KNOWLEDGE.areas.find(a => a.id === "penal").respuestas[0];
      setTimeout(() => {
        this.appendMessage(
          `Comprendo tu situación en materia penal. En estos casos, **actuar con celeridad es crítico**. \n\n${resp.texto}`,
          'bot',
          [
            {
              label: "🚨 Contactar Urgencia Penal ahora",
              action: () => this.escalateToHuman(`Urgencia penal: "${query}"`)
            },
            {
              label: "Ver más servicios penales",
              action: () => this.selectArea("penal")
            }
          ]
        );
      }, 500);
      return;
    }

    // Civil / Sucesión / Accidente
    if (q.includes("accidente") || q.includes("choque") || q.includes("sucesion") || q.includes("herencia") || q.includes("indemnizacion") || q.includes("desalojo") || q.includes("contrato") || q.includes("alquiler") || q.includes("deuda")) {
      found = true;
      const areaCivil = BOT_KNOWLEDGE.areas.find(a => a.id === "civil");
      setTimeout(() => {
        this.appendMessage(
          `En el área civil y comercial realizamos reclamos patrimoniales con seguimiento riguroso. \n\nPodemos analizar tu documentación preliminar sin costo para evaluar la viabilidad del reclamo.`,
          'bot',
          [
            {
              label: "📋 Derivar caso a operador civil",
              action: () => this.escalateToHuman(`Consulta Civil: "${query}"`)
            },
            {
              label: "Ver opciones del Área Civil",
              action: () => this.selectArea("civil")
            }
          ]
        );
      }, 500);
      return;
    }

    // Previsional / Jubilados
    if (q.includes("jubilad") || q.includes("pension") || q.includes("anses") || q.includes("descuento") || q.includes("recibo") || q.includes("debito") || q.includes("banco")) {
      found = true;
      setTimeout(() => {
        this.appendMessage(
          `Procesamos casos de jubilados y pensionados contra bancos y mutuales que debitan conceptos indebidos de los haberes. El recupero suele incluir indemnizaciones por daño patrimonial y moral.`,
          'bot',
          [
            {
              label: "Solicitar auditoría de recibo de haberes",
              action: () => this.escalateToHuman(`Jubilados / ANSES: "${query}"`)
            }
          ]
        );
      }, 500);
      return;
    }

    // 4. Si el bot NO puede resolver la cuestión: DERIVACIÓN A OPERADORES HUMANOS
    if (!found) {
      setTimeout(() => {
        this.appendMessage(
          `Entiendo tu consulta: *"${query}"*.\n\nDado que cada caso judicial tiene particularidades probatorias y procesales únicas en Argentina, **te derivaré con un abogado operador de nuestro equipo** para que examine tu situación en detalle.`,
          'bot'
        );
        setTimeout(() => {
          this.escalateToHuman(query);
        }, 600);
      }, 500);
    }
  }

  escalateToHuman(motivoConsulta = "") {
    const prov = this.userState.provincia || "Argentina (a determinar)";
    
    // Seleccionar el teléfono idóneo según la provincia
    let telefonoTarget = CONTACTO_OFICIAL.telefonos[0]; // CABA por defecto
    if (prov.toLowerCase().includes("tucumán") || prov.toLowerCase().includes("santiago") || prov.toLowerCase().includes("salta") || prov.toLowerCase().includes("jujuy")) {
      telefonoTarget = CONTACTO_OFICIAL.telefonos[2]; // NOA
    }

    const mensajeWhatsApp = encodeURIComponent(
      `Hola Estudio Jurídico Valor y Asociados. Me comunico desde ${prov}. Mi consulta es: "${motivoConsulta}". Quisiera asesoramiento con un abogado del equipo.`
    );

    const waUrl = `https://wa.me/${telefonoTarget.link}?text=${mensajeWhatsApp}`;

    const cardHtml = document.createElement('div');
    cardHtml.className = 'message bot';
    cardHtml.innerHTML = `
      <div class="human-transfer-card">
        <i class="fa-solid fa-headset" style="font-size: 2rem; color: #1b6330; margin-bottom: 8px;"></i>
        <h5>Derivación a Abogado Humano</h5>
        <p>Jurisdicción asignada: <strong>${prov}</strong><br>Guardia activa las 24 hs.</p>
        <a href="${waUrl}" target="_blank" class="btn btn-whatsapp" style="width: 100%; margin-bottom: 8px; font-size: 0.88rem;">
          <i class="fa-brands fa-whatsapp"></i> Hablar por WhatsApp (${telefonoTarget.numero})
        </a>
        <a href="tel:${telefonoTarget.numero.replace(/\s+/g, '')}" class="btn btn-outline" style="width: 100%; font-size: 0.8rem; padding: 6px;">
          <i class="fa-solid fa-phone"></i> Llamar Directo
        </a>
      </div>
    `;

    this.messagesContainer.appendChild(cardHtml);
    this.scrollToBottom();

    // Guardar lead de consulta en el storage para el administrador
    this.saveLeadToLocal({
      fecha: new Date().toISOString(),
      provincia: prov,
      consulta: motivoConsulta,
      derivadoA: telefonoTarget.numero
    });
  }

  saveLeadToLocal(lead) {
    try {
      const leads = JSON.parse(localStorage.getItem('valor_consultas_leads') || '[]');
      leads.unshift(lead);
      localStorage.setItem('valor_consultas_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn("Storage no disponible", e);
    }
  }
}
