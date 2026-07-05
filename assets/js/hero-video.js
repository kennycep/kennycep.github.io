/* ScrollControlledHeroVideo
   Scrubs the hero video's currentTime based on scroll progress through
   the .hero-scroll stage. The video itself stays paused the whole time;
   every visible frame is set manually, which is why the file is encoded
   with all keyframes (-g 1). */
(function () {
  var video = document.getElementById('hero-video');
  var stage = document.querySelector('.hero-scroll');
  if (!video || !stage) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    // Reduced motion: the CSS unpins the hero; leave the poster/first
    // frame in place and never scrub.
    return;
  }

  var duration = 0;
  var current = 0; // smoothed playhead position in seconds
  var rafId = null;

  video.pause();

  // Scroll progress through the stage, 0 at the top and 1 once the
  // sticky hero is about to unpin.
  function progress() {
    var scrollable = stage.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 0;
    var top = stage.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, -top / scrollable));
  }

  function tick() {
    // targetTime = scrollProgress * duration, then lerp toward it so
    // fast scrolling reads as smooth motion instead of frame jumps.
    var target = progress() * duration;
    current += (target - current) * 0.15;
    current = Math.min(duration, Math.max(0, current));
    // Skip sub-hundredth writes; setting currentTime forces a decode.
    if (Math.abs(video.currentTime - current) > 0.01) {
      video.currentTime = current;
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    duration = video.duration || 0;
    if (!duration) return;
    // Only run the rAF loop while the stage is on screen.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          if (rafId === null) rafId = requestAnimationFrame(tick);
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
      io.observe(stage);
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  // Duration is only known once metadata has loaded.
  if (video.readyState >= 1) {
    start();
  } else {
    video.addEventListener('loadedmetadata', start, { once: true });
  }

  // Cleanup when the page is being torn down.
  window.addEventListener('pagehide', function () {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  });
})();
