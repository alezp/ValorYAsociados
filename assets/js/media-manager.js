/**
 * ESTUDIO JURÍDICO VALOR Y ASOCIADOS
 * Gestor dinámico de Banners y Videos con persistencia y Panel de Carga
 */

class MediaManager {
  constructor() {
    this.storageKeyBanners = 'valor_asociados_banners';
    this.storageKeyVideos = 'valor_asociados_videos';

    this.banners = this.loadBanners();
    this.videos = this.loadVideos();

    this.currentSlideIndex = 0;
    this.sliderTimer = null;

    this.initElements();
    this.initEvents();
    this.renderSlider();
    this.renderVideos();
    this.renderAdminLists();
  }

  initElements() {
    // Slider Hero
    this.sliderContainer = document.getElementById('heroSliderContainer');
    this.dotsContainer = document.getElementById('sliderDots');
    this.prevBtn = document.getElementById('sliderPrev');
    this.nextBtn = document.getElementById('sliderNext');

    // Videos
    this.videosGrid = document.getElementById('videosGrid');

    // Modal Admin
    this.adminFab = document.getElementById('adminTriggerFab');
    this.modalOverlay = document.getElementById('adminModalOverlay');
    this.modalClose = document.getElementById('adminModalClose');
    this.tabBanners = document.getElementById('tabBtnBanners');
    this.tabVideos = document.getElementById('tabBtnVideos');
    this.contentBanners = document.getElementById('tabContentBanners');
    this.contentVideos = document.getElementById('tabContentVideos');

    // Formularios Admin
    this.bannerFileInput = document.getElementById('bannerFileInput');
    this.bannerDropzone = document.getElementById('bannerDropzone');
    this.bannerTitleInput = document.getElementById('bannerTitle');
    this.bannerSubtitleInput = document.getElementById('bannerSubtitle');
    this.bannerTagInput = document.getElementById('bannerTag');
    this.btnSaveBanner = document.getElementById('btnSaveBanner');
    this.adminBannersList = document.getElementById('adminBannersList');

    this.videoFileInput = document.getElementById('videoFileInput');
    this.videoDropzone = document.getElementById('videoDropzone');
    this.videoUrlInput = document.getElementById('videoUrl');
    this.videoTitleInput = document.getElementById('videoTitle');
    this.videoCategoryInput = document.getElementById('videoCategory');
    this.videoDescInput = document.getElementById('videoDesc');
    this.btnSaveVideo = document.getElementById('btnSaveVideo');
    this.adminVideosList = document.getElementById('adminVideosList');

    // Cache para subida de archivo temporal en base64
    this.tempBannerImageBase64 = null;
    this.tempVideoBase64 = null;
  }

  initEvents() {
    // Controles de Slider
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());

    // Soporte táctil Swipe para móviles (Android / iOS)
    if (this.sliderContainer) {
      let touchStartX = 0;
      let touchEndX = 0;

      this.sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            this.nextSlide(); // Deslizó hacia la izquierda
          } else {
            this.prevSlide(); // Deslizó hacia la derecha
          }
        }
      }, { passive: true });
    }

    // Modal Admin
    if (this.adminFab) {
      this.adminFab.addEventListener('click', () => this.openModal());
    }
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', (e) => {
        if (e.target === this.modalOverlay) this.closeModal();
      });
    }

    // Tabs del Modal
    if (this.tabBanners && this.tabVideos) {
      this.tabBanners.addEventListener('click', () => {
        this.tabBanners.classList.add('active');
        this.tabVideos.classList.remove('active');
        this.contentBanners.classList.add('active');
        this.contentVideos.classList.remove('active');
      });
      this.tabVideos.addEventListener('click', () => {
        this.tabVideos.classList.add('active');
        this.tabBanners.classList.remove('active');
        this.contentVideos.classList.add('active');
        this.contentBanners.classList.remove('active');
      });
    }

    // Subida de Banners
    if (this.bannerDropzone) {
      this.bannerDropzone.addEventListener('click', () => this.bannerFileInput.click());
    }
    if (this.bannerFileInput) {
      this.bannerFileInput.addEventListener('change', (e) => this.handleBannerFile(e));
    }
    if (this.btnSaveBanner) {
      this.btnSaveBanner.addEventListener('click', () => this.saveNewBanner());
    }

    // Subida de Videos
    if (this.videoDropzone) {
      this.videoDropzone.addEventListener('click', () => this.videoFileInput.click());
    }
    if (this.videoFileInput) {
      this.videoFileInput.addEventListener('change', (e) => this.handleVideoFile(e));
    }
    if (this.btnSaveVideo) {
      this.btnSaveVideo.addEventListener('click', () => this.saveNewVideo());
    }
  }

  // --- CARGA Y PERSISTENCIA (LocalStorage) ---
  loadBanners() {
    try {
      const stored = localStorage.getItem(this.storageKeyBanners);
      return stored ? JSON.parse(stored) : [...DEFAULT_BANNERS];
    } catch (e) {
      return [...DEFAULT_BANNERS];
    }
  }

  saveBanners() {
    try {
      localStorage.setItem(this.storageKeyBanners, JSON.stringify(this.banners));
    } catch (e) {
      console.warn("Storage full or unavailable", e);
    }
  }

  loadVideos() {
    try {
      const stored = localStorage.getItem(this.storageKeyVideos);
      return stored ? JSON.parse(stored) : [...DEFAULT_VIDEOS];
    } catch (e) {
      return [...DEFAULT_VIDEOS];
    }
  }

  saveVideos() {
    try {
      localStorage.setItem(this.storageKeyVideos, JSON.stringify(this.videos));
    } catch (e) {
      console.warn("Storage full or unavailable", e);
    }
  }

  // --- RENDERIZADO DEL HERO SLIDER ---
  renderSlider() {
    if (!this.sliderContainer) return;
    this.sliderContainer.innerHTML = '';
    this.dotsContainer.innerHTML = '';

    if (this.banners.length === 0) {
      this.sliderContainer.innerHTML = `
        <div class="slide active" style="background: var(--primary-navy-dark);">
          <div class="slide-overlay"></div>
          <div class="container">
            <div class="slide-content">
              <span class="slide-badge">ESTUDIO JURÍDICO</span>
              <h2 class="slide-title">VALOR Y ASOCIADOS</h2>
              <p class="slide-subtitle">Tu tranquilidad, nuestra prioridad.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.banners.forEach((banner, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === 0 ? 'active' : ''}`;
      slide.style.backgroundImage = `url('${banner.imageUrl}')`;

      slide.innerHTML = `
        <div class="slide-overlay"></div>
        <div class="container">
          <div class="slide-content">
            <span class="slide-badge">${banner.tag || 'VALOR Y ASOCIADOS'}</span>
            <h2 class="slide-title">${banner.title}</h2>
            <p class="slide-subtitle">${banner.subtitle}</p>
            <div class="slide-actions">
              <a href="${banner.linkTarget || '#contacto'}" class="btn btn-gold">
                ${banner.buttonText || 'Consultar Caso'} <i class="fa-solid fa-arrow-right"></i>
              </a>
              <button class="btn btn-outline" onclick="window.chatbotInstance && window.chatbotInstance.toggleWindow()" style="border-color: #fff; color: #fff;">
                <i class="fa-solid fa-comment-dots"></i> Asistente Virtual
              </button>
            </div>
          </div>
        </div>
      `;
      this.sliderContainer.appendChild(slide);

      // Crear dot
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });

    this.currentSlideIndex = 0;
    this.startAutoSlider();
  }

  goToSlide(index) {
    const slides = this.sliderContainer.querySelectorAll('.slide');
    const dots = this.dotsContainer.querySelectorAll('.slider-dot');

    if (!slides.length) return;

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    this.currentSlideIndex = (index + slides.length) % slides.length;
    slides[this.currentSlideIndex].classList.add('active');
    if (dots[this.currentSlideIndex]) {
      dots[this.currentSlideIndex].classList.add('active');
    }

    this.startAutoSlider();
  }

  nextSlide() {
    this.goToSlide(this.currentSlideIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlideIndex - 1);
  }

  startAutoSlider() {
    clearInterval(this.sliderTimer);
    this.sliderTimer = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  // --- RENDERIZADO DE VIDEOS ---
  renderVideos() {
    if (!this.videosGrid) return;
    this.videosGrid.innerHTML = '';

    if (this.videos.length === 0) {
      this.videosGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-video-slash" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          No hay videos cargados actualmente. Puedes cargar nuevos desde el Panel de Carga.
        </div>
      `;
      return;
    }

    this.videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'video-card';

      // Si es YouTube embed o video local
      const isEmbed = video.url.includes('youtube.com') || video.url.includes('youtu.be') || video.url.includes('embed');

      card.innerHTML = `
        <div class="video-thumb-wrap">
          ${isEmbed ? `
            <iframe src="${video.url}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 100%; border: none;"></iframe>
          ` : `
            <video controls poster="${video.thumbnail || ''}" style="width: 100%; height: 100%; object-fit: cover;">
              <source src="${video.url}" type="video/mp4">
              Tu navegador no soporta el formato de video.
            </video>
          `}
        </div>
        <div class="video-info">
          <span class="video-category">${video.category || 'Asesoramiento Legal'}</span>
          <h4 class="video-title">${video.title}</h4>
          <p class="video-desc">${video.description || ''}</p>
          <a href="#contacto" class="btn btn-outline" style="font-size: 0.8rem; padding: 6px 14px; align-self: flex-start;">
            <i class="fa-solid fa-scale-balanced"></i> Consultar sobre este tema
          </a>
        </div>
      `;

      this.videosGrid.appendChild(card);
    });
  }

  // --- ADMIN PANEL Y CARGA DE BANNERS ---
  openModal() {
    this.modalOverlay.classList.add('open');
  }

  closeModal() {
    this.modalOverlay.classList.remove('open');
  }

  handleBannerFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      this.tempBannerImageBase64 = loadEvent.target.result;
      this.bannerDropzone.innerHTML = `
        <img src="${this.tempBannerImageBase64}" style="max-height: 120px; margin: 0 auto 10px auto; border-radius: 6px;" />
        <p style="font-size: 0.85rem; color: #1a6b33; font-weight: 700;">✓ Imagen seleccionada: ${file.name}</p>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Clic para cambiar</span>
      `;
    };
    reader.readAsDataURL(file);
  }

  saveNewBanner() {
    const title = this.bannerTitleInput.value.trim();
    const subtitle = this.bannerSubtitleInput.value.trim();
    const tag = this.bannerTagInput.value.trim() || 'ESTUDIO JURÍDICO';

    if (!title || !this.tempBannerImageBase64) {
      alert("Por favor completa el título y selecciona una imagen para el banner.");
      return;
    }

    const newBanner = {
      id: `banner-${Date.now()}`,
      title,
      subtitle: subtitle || "Atención y representación legal en toda la República Argentina.",
      tag,
      imageUrl: this.tempBannerImageBase64,
      buttonText: "Consultar Caso",
      linkTarget: "#contacto"
    };

    this.banners.unshift(newBanner);
    this.saveBanners();
    this.renderSlider();
    this.renderAdminLists();

    // Reset formulario
    this.bannerTitleInput.value = '';
    this.bannerSubtitleInput.value = '';
    this.bannerTagInput.value = '';
    this.tempBannerImageBase64 = null;
    this.bannerDropzone.innerHTML = `
      <i class="fa-solid fa-cloud-arrow-up"></i>
      <h4>Arrastra aquí la imagen del Banner</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted);">o haz clic para explorar tus archivos (JPG, PNG, WebP)</p>
    `;

    alert("¡Banner cargado con éxito y publicado en el slider!");
  }

  deleteBanner(bannerId) {
    if (confirm("¿Estás seguro de eliminar este banner?")) {
      this.banners = this.banners.filter(b => b.id !== bannerId);
      this.saveBanners();
      this.renderSlider();
      this.renderAdminLists();
    }
  }

  // --- ADMIN PANEL Y CARGA DE VIDEOS ---
  handleVideoFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      this.tempVideoBase64 = loadEvent.target.result;
      this.videoDropzone.innerHTML = `
        <i class="fa-solid fa-circle-check" style="color: #25d366; font-size: 2.2rem;"></i>
        <p style="font-size: 0.88rem; font-weight: 700; color: #1b6330;">Video cargado: ${file.name}</p>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Clic para reemplazar</span>
      `;
    };
    reader.readAsDataURL(file);
  }

  saveNewVideo() {
    const title = this.videoTitleInput.value.trim();
    const category = this.videoCategoryInput.value.trim() || 'Derecho General';
    const desc = this.videoDescInput.value.trim();
    let videoUrl = this.videoUrlInput.value.trim();

    if (!title) {
      alert("Por favor ingresa al menos un título para el video.");
      return;
    }

    if (!videoUrl && !this.tempVideoBase64) {
      alert("Debes seleccionar un archivo de video local o ingresar un enlace de YouTube.");
      return;
    }

    // Convertir links de youtube normales a embed si aplica
    if (videoUrl.includes('watch?v=')) {
      videoUrl = videoUrl.replace('watch?v=', 'embed/');
    } else if (videoUrl.includes('youtu.be/')) {
      const id = videoUrl.split('youtu.be/')[1].split('?')[0];
      videoUrl = `https://www.youtube.com/embed/${id}`;
    }

    const newVideo = {
      id: `video-${Date.now()}`,
      title,
      category,
      description: desc,
      type: this.tempVideoBase64 ? 'local' : 'youtube',
      url: this.tempVideoBase64 || videoUrl,
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    };

    this.videos.unshift(newVideo);
    this.saveVideos();
    this.renderVideos();
    this.renderAdminLists();

    // Reset formulario
    this.videoTitleInput.value = '';
    this.videoUrlInput.value = '';
    this.videoDescInput.value = '';
    this.tempVideoBase64 = null;
    this.videoDropzone.innerHTML = `
      <i class="fa-solid fa-file-video"></i>
      <h4>Arrastra un video MP4 aquí</h4>
      <p style="font-size: 0.85rem; color: var(--text-muted);">o haz clic para subir un video de tus archivos</p>
    `;

    alert("¡Video agregado con éxito a la galería!");
  }

  deleteVideo(videoId) {
    if (confirm("¿Estás seguro de eliminar este video?")) {
      this.videos = this.videos.filter(v => v.id !== videoId);
      this.saveVideos();
      this.renderVideos();
      this.renderAdminLists();
    }
  }

  // --- RENDER DE LISTADOS EN EL MODAL ---
  renderAdminLists() {
    // Listado Banners
    if (this.adminBannersList) {
      this.adminBannersList.innerHTML = '';
      this.banners.forEach(b => {
        const item = document.createElement('div');
        item.className = 'manage-item';
        item.innerHTML = `
          <div class="manage-item-info">
            <img src="${b.imageUrl}" class="manage-item-thumb" alt="${b.title}">
            <div class="manage-item-text">
              <h5>${b.title}</h5>
              <span>Etiqueta: ${b.tag || 'General'}</span>
            </div>
          </div>
          <button class="btn btn-outline" style="color: #e63946; border-color: #e63946; padding: 4px 10px; font-size: 0.8rem;" onclick="window.mediaManagerInstance.deleteBanner('${b.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        this.adminBannersList.appendChild(item);
      });
    }

    // Listado Videos
    if (this.adminVideosList) {
      this.adminVideosList.innerHTML = '';
      this.videos.forEach(v => {
        const item = document.createElement('div');
        item.className = 'manage-item';
        item.innerHTML = `
          <div class="manage-item-info">
            <div class="manage-item-thumb" style="display: flex; align-items: center; justify-content: center; background: #0f2744; color: #fff;">
              <i class="fa-solid fa-play"></i>
            </div>
            <div class="manage-item-text">
              <h5>${v.title}</h5>
              <span>${v.category}</span>
            </div>
          </div>
          <button class="btn btn-outline" style="color: #e63946; border-color: #e63946; padding: 4px 10px; font-size: 0.8rem;" onclick="window.mediaManagerInstance.deleteVideo('${v.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        `;
        this.adminVideosList.appendChild(item);
      });
    }
  }
}
