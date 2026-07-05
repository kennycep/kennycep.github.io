/* Hero behavior: background video, optional audio track, header state.
   No dependencies; safe to load on any page that lacks these elements. */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Background video -------------------------------------------
     Autoplay is initiated from JS rather than the autoplay attribute
     so reduced-motion users get the static poster frame instead. */
  var video = document.getElementById('hero-video');
  if (video && !reduceMotion.matches) {
    var playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        /* Autoplay blocked: the poster frame stays, which is fine. */
      });
    }
  }

  /* ---- Optional audio track ---------------------------------------
     Never autoplays. The toggle fades in to ~0.6 on play and fades
     out before pausing. If the file is missing (it is not committed
     to the public repo) or playback is blocked, the control explains
     itself instead of failing silently. */
  var audio = document.getElementById('hero-audio');
  var toggle = document.getElementById('audio-toggle');
  if (audio && toggle) {
    var label = toggle.querySelector('.audio-label');
    var fadeTimer = null;
    var TARGET_VOLUME = 0.6;

    function setLabel(text) {
      if (label) label.textContent = text;
    }

    function fadeTo(target, done) {
      clearInterval(fadeTimer);
      fadeTimer = setInterval(function () {
        var delta = target - audio.volume;
        if (Math.abs(delta) < 0.04) {
          audio.volume = target;
          clearInterval(fadeTimer);
          if (done) done();
          return;
        }
        audio.volume += delta * 0.18;
      }, 50);
    }

    audio.addEventListener('error', function () {
      toggle.disabled = true;
      setLabel('Track unavailable');
    });

    toggle.addEventListener('click', function () {
      if (toggle.disabled) return;
      if (audio.paused) {
        audio.volume = 0;
        var p = audio.play();
        if (p && p.then) {
          p.then(function () {
            fadeTo(TARGET_VOLUME);
            toggle.setAttribute('aria-pressed', 'true');
            toggle.classList.add('playing');
            setLabel('Pause track');
          }).catch(function () {
            /* Blocked by the browser or the file is absent. */
            setLabel('Tap to enable audio');
          });
        }
      } else {
        fadeTo(0, function () {
          audio.pause();
        });
        toggle.setAttribute('aria-pressed', 'false');
        toggle.classList.remove('playing');
        setLabel('Play track');
      }
    });
  }

  /* ---- Header state ------------------------------------------------
     Transparent glass over the hero; solid once scrolled past it. */
  var header = document.getElementById('site-header');
  var hero = document.querySelector('.hero');
  if (header && hero) {
    function onScroll() {
      var past = window.scrollY > hero.offsetHeight - 90;
      header.classList.toggle('scrolled', past);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
