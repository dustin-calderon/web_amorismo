(function(){
  const qs = (s, el=document) => el.querySelector(s);
  const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

  // ===== GALERÍA: Cambiar imagen principal al hacer clic en thumbnail =====
  const mainImage = qs('#galeria-main-image');
  const thumbnails = qsa('.amorismo__galeria-thumbnail');
  
  if (mainImage && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const newSrc = thumb.getAttribute('data-src');
        if (newSrc) {
          mainImage.src = newSrc;
          
          // Actualizar clase active
          thumbnails.forEach(t => t.classList.remove('amorismo__galeria-thumbnail--active'));
          thumb.classList.add('amorismo__galeria-thumbnail--active');
        }
      });
    });
  }

  // Header aparece después de 3 segundos SOLO si estás viendo el video
  let headerTimeout;
  let showHeaderAfterDelay = true;
  
  const header = qs('.amorismo__header');
  const videoContainer = qs('.amorismo__video-container');
  
  if (header && videoContainer) {
    // Mostrar header después de 3 segundos
    headerTimeout = setTimeout(() => {
      if (showHeaderAfterDelay) {
        header.classList.remove('amorismo__header--hidden');
        header.classList.add('amorismo__header--visible');
      }
    }, 3000);
    
    // Observar cuando el video sale del viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // El video salió del viewport - ocultar header
          header.classList.remove('amorismo__header--visible');
          header.classList.add('amorismo__header--hidden');
          showHeaderAfterDelay = false;
        } else {
          // El video volvió al viewport - permitir que reaparezca el header
          showHeaderAfterDelay = true;
          if (!header.classList.contains('amorismo__header--visible')) {
            header.classList.remove('amorismo__header--hidden');
            header.classList.add('amorismo__header--visible');
          }
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(videoContainer);
  }

  // Scroll suave a anclas internas
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    target.focus();
  });

  console.log('Amorismo scripts loaded');
  console.log('CSS loaded:', window.getComputedStyle(document.body).backgroundColor);
  console.log('Fondo gradient:', window.getComputedStyle(document.querySelector('.amorismo__bg-gradient')).background);
})();
