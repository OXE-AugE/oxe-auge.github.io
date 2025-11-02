// Carousel functionality for OXE-Aug website
console.log('Carousel script loading...');

// Generic carousel initialization function
function initializeCarousel(options) {
  const slides = document.querySelectorAll(options.slidesSelector);
  const prevButton = document.getElementById(options.prevButtonId);
  const nextButton = document.getElementById(options.nextButtonId);
  const currentIndicator = document.querySelector(options.currentIndicatorSelector);
  const totalIndicator = document.querySelector(options.totalIndicatorSelector);
  const carouselContainer = document.querySelector(options.containerSelector);

  console.log('Initializing carousel with options:', options);
  console.log('Found slides:', slides.length);
  console.log('Found prev button:', prevButton);
  console.log('Found next button:', nextButton);

  // Initialize
  let currentIndex = 0;
  const totalSlides = slides.length;
  let isAnimating = false;

  // Set initial height for container to prevent layout shifts
  if (carouselContainer && slides.length > 0) {
    carouselContainer.style.minHeight = slides[0].offsetHeight + 'px';
  }

  // Update slide indicators
  if (totalIndicator) totalIndicator.textContent = totalSlides;
  if (currentIndicator) currentIndicator.textContent = currentIndex + 1;

  // Function to show a specific slide
  function showSlide(newIndex, isNext) {
    if (isAnimating || !slides.length) return; // Prevent rapid clicking
    isAnimating = true;
    
    const oldIndex = currentIndex;
    currentIndex = newIndex;
    
    console.log('Showing slide:', newIndex);
    
    // Update indicators
    if (currentIndicator) currentIndicator.textContent = currentIndex + 1;
    
    // Always use button direction for animation direction
    const isForward = isNext;
    
    // Before animating, properly position the new slide and ensure other slides are out of the way
    slides.forEach((slide, index) => {
      // Skip the current and target slides for now
      if (index !== oldIndex && index !== newIndex) {
        slide.style.transition = 'none';
        slide.style.transform = 'translateX(100%)'; // Move all other slides off-screen to the right
        void slide.offsetWidth; // Force reflow
      }
    });
    
    // Position the new slide based on the navigation direction
    slides[newIndex].style.transition = 'none';
    if (isForward) {
      // If going forward (next), bring new slide from the right
      slides[newIndex].style.transform = 'translateX(100%)';
    } else {
      // If going backward (prev), bring new slide from the left
      slides[newIndex].style.transform = 'translateX(-100%)';
    }
    void slides[newIndex].offsetWidth; // Force reflow
    
    // Enable transitions for the animation
    slides[oldIndex].style.transition = 'transform 0.5s ease-in-out';
    slides[newIndex].style.transition = 'transform 0.5s ease-in-out';
    
    // Animate slides
    if (isForward) {
      // If going forward (next), current slide exits left, new slide enters from right
      slides[oldIndex].style.transform = 'translateX(-100%)';
      slides[newIndex].style.transform = 'translateX(0)';
    } else {
      // If going backward (prev), current slide exits right, new slide enters from left
      slides[oldIndex].style.transform = 'translateX(100%)';
      slides[newIndex].style.transform = 'translateX(0)';
    }
    
    // Play videos in the new slide
    const currentVideos = slides[newIndex].querySelectorAll('video');
    currentVideos.forEach(video => {
      video.play().catch(e => {
        console.warn(`Video playback issue: ${e.message}`);
      });
    });
    
    // Reset animation flag after transition completes
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }

  // Event listeners for navigation buttons
  if (prevButton) {
    console.log('Adding event listener to prev button');
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Prev button clicked');
      const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(newIndex, false); // false means prev button
    });
    
    prevButton.addEventListener('mouseover', function() {
      this.style.background = 'rgba(0,0,0,1)';
    });
    
    prevButton.addEventListener('mouseout', function() {
      this.style.background = 'rgba(0,0,0,0.8)';
    });
  } else {
    console.log('Prev button not found');
  }

  if (nextButton) {
    console.log('Adding event listener to next button');
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Next button clicked');
      const newIndex = (currentIndex + 1) % totalSlides;
      showSlide(newIndex, true); // true means next button
    });
    
    nextButton.addEventListener('mouseover', function() {
      this.style.background = 'rgba(0,0,0,1)';
    });
    
    nextButton.addEventListener('mouseout', function() {
      this.style.background = 'rgba(0,0,0,0.8)';
    });
  } else {
    console.log('Next button not found');
  }

  // Optional: Keyboard navigation if enabled
  if (options.enableKeyboardNav) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        if (prevButton) prevButton.click();
      } else if (e.key === 'ArrowRight') {
        if (nextButton) nextButton.click();
      }
    });
  }

  // Initialize: set proper positions for all slides
  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.style.transform = 'translateX(0)';
    } else {
      // Position all other slides off to the right initially
      slide.style.transform = 'translateX(100%)';
    }
    
    // Ensure proper stacking
    slide.style.zIndex = index === 0 ? '2' : '1';
    
    // Remove overflow:hidden from individual slides, as it can interfere with video display
    if (slide.style.overflow === 'hidden') {
      slide.style.overflow = '';
    }
    
    // Preload videos and ensure they're visible
    const videos = slide.querySelectorAll('video');
    videos.forEach(video => {
      // Load the video
      video.load();
      
      // Remove any max-height restrictions from JavaScript
      if (video.style.maxHeight === '280px') {
        video.style.maxHeight = '';
      }
    });
  });
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, looking for carousel...');
  
  // Initialize Task Videos Carousel
  const taskCarouselElement = document.querySelector('.task-videos-carousel');
  console.log('Task videos carousel element found:', taskCarouselElement);
  
  if (taskCarouselElement) {
    console.log('Initializing task videos carousel...');
    initializeCarousel({
      slidesSelector: '.task-videos-carousel .task-slide',
      prevButtonId: 'task-prev-slide',
      nextButtonId: 'task-next-slide',
      currentIndicatorSelector: '.task-current-slide',
      totalIndicatorSelector: '.task-total-slides',
      containerSelector: '.task-videos-carousel',
      enableKeyboardNav: true
    });
  } else {
    console.log('Task videos carousel element not found!');
  }

  // Initialize Generalization Videos Carousel
  const generalizationCarouselElement = document.querySelector('.generalization-videos-carousel');
  console.log('Generalization videos carousel element found:', generalizationCarouselElement);
  
  if (generalizationCarouselElement) {
    console.log('Initializing generalization videos carousel...');
    initializeCarousel({
      slidesSelector: '.generalization-videos-carousel .task-slide',
      prevButtonId: 'generalization-prev-slide',
      nextButtonId: 'generalization-next-slide',
      currentIndicatorSelector: '.generalization-current-slide',
      totalIndicatorSelector: '.generalization-total-slides',
      containerSelector: '.generalization-videos-carousel',
      enableKeyboardNav: true
    });
  } else {
    console.log('Generalization videos carousel element not found!');
  }

  // Initialize Robustness Videos Carousel
  const robustnessCarouselElement = document.querySelector('.robustness-videos-carousel');
  console.log('Robustness videos carousel element found:', robustnessCarouselElement);
  
  if (robustnessCarouselElement) {
    console.log('Initializing robustness videos carousel...');
    initializeCarousel({
      slidesSelector: '.robustness-videos-carousel .task-slide',
      prevButtonId: 'robustness-prev-slide',
      nextButtonId: 'robustness-next-slide',
      currentIndicatorSelector: '.robustness-current-slide',
      totalIndicatorSelector: '.robustness-total-slides',
      containerSelector: '.robustness-videos-carousel',
      enableKeyboardNav: true
    });
  } else {
    console.log('Robustness videos carousel element not found!');
  }

  // Initialize Robot Augmentation Videos Carousel
  const robotAugmentationCarouselElement = document.querySelector('.robot-augmentation-carousel');
  console.log('Robot augmentation videos carousel element found:', robotAugmentationCarouselElement);
  
  if (robotAugmentationCarouselElement) {
    console.log('Initializing robot augmentation videos carousel...');
    initializeCarousel({
      slidesSelector: '.robot-augmentation-carousel .task-slide',
      prevButtonId: 'robot-augmentation-prev-slide',
      nextButtonId: 'robot-augmentation-next-slide',
      currentIndicatorSelector: '.robot-augmentation-current-slide',
      totalIndicatorSelector: '.robot-augmentation-total-slides',
      containerSelector: '.robot-augmentation-carousel',
      enableKeyboardNav: true
    });
  } else {
    console.log('Robot augmentation videos carousel element not found!');
  }
});
