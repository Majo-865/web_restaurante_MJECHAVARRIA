document.addEventListener('DOMContentLoaded', () => {

  
  // CARRUSEL AUTOMÁTICO DE IMÁGENES (4 SEGUNDOS)
  
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const slideIntervalTime = 4000; // 4000 ms = 4 segundos

  function nextSlide() {
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  if (slides.length > 0) {
    setInterval(nextSlide, slideIntervalTime);
  }

});