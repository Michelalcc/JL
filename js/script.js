document.addEventListener('DOMContentLoaded', function(){
  // sticky nav on scroll
  var nav = document.getElementById('siteNav');
  if(nav){
    var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if(toggle && links){
    var setMenu = function(open){
      links.classList.toggle('open', open);
      toggle.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function(){
      setMenu(!links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setMenu(false); });
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){ setMenu(false); }
    });
  }

  // grupos filter chips
  var filtros = document.getElementById('filtros');
  if(filtros){
    filtros.addEventListener('click', function(e){
      var btn = e.target.closest('.chip');
      if(!btn) return;
      filtros.querySelectorAll('.chip').forEach(function(c){c.classList.remove('active');});
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      document.querySelectorAll('#gp-list .gp-card').forEach(function(card){
        var pub = card.getAttribute('data-publico');
        card.style.display = (filter === 'todos' || pub === filter) ? '' : 'none';
      });
    });
  }

  // generic modal helper — used by the "Servir" and "Oración" popup forms
  function setupModal(modalId, opts){
    var modal = document.getElementById(modalId);
    if(!modal) return;
    opts = opts || {};
    var closeBtn = modal.querySelector('.modal-close');
    var firstFieldId = opts.firstFieldId;
    var lastFocused = null;

    var openModal = function(triggerEl){
      lastFocused = document.activeElement;
      if(opts.onOpen){ opts.onOpen(triggerEl); }
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      window.setTimeout(function(){
        var firstField = firstFieldId && document.getElementById(firstFieldId);
        if(firstField){ firstField.focus(); }
      }, 260);
    };
    var closeModal = function(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if(lastFocused && lastFocused.focus){ lastFocused.focus(); }
    };

    (opts.openTriggers || []).forEach(function(el){
      el.addEventListener('click', function(){ openModal(el); });
    });
    if(closeBtn){ closeBtn.addEventListener('click', closeModal); }
    modal.addEventListener('click', function(e){ if(e.target === modal){ closeModal(); } });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal.classList.contains('open')){ closeModal(); }
    });

    return { open: openModal, close: closeModal };
  }

  // voluntariado: clicking an area opens the signup modal, preselected
  var areaSelect = document.getElementById('v-area');
  var servirTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-area], #servirGeneralBtn'));
  setupModal('servirModal', {
    firstFieldId: 'v-nombre',
    openTriggers: servirTriggers,
    onOpen: function(triggerEl){
      if(areaSelect){ areaSelect.value = (triggerEl && triggerEl.getAttribute('data-area')) || ''; }
    }
  });

  // oración: "Enviar mi petición" opens the prayer request modal
  var oracionTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-open-oracion]'));
  setupModal('oracionModal', {
    firstFieldId: 'o-nombre',
    openTriggers: oracionTriggers
  });

  // cada área de voluntariado: el botón abre su modal de información;
  // el CTA de "Quiero servir en..." cierra ese modal y abre el de inscripción
  function wireAreaModal(modalId, infoBtnId, ctaBtnId){
    var infoBtn = document.getElementById(infoBtnId);
    var handle = setupModal(modalId, { openTriggers: infoBtn ? [infoBtn] : [] });
    var ctaBtn = document.getElementById(ctaBtnId);
    if(ctaBtn && handle){
      ctaBtn.addEventListener('click', function(){ handle.close(); });
    }
  }
  wireAreaModal('visualesModal', 'visualesInfoBtn', 'visualesCtaBtn');
  wireAreaModal('programacionModal', 'programacionInfoBtn', 'programacionCtaBtn');
  wireAreaModal('alabanzaModal', 'alabanzaInfoBtn', 'alabanzaCtaBtn');
  wireAreaModal('ninosModal', 'ninosInfoBtn', 'ninosCtaBtn');
  wireAreaModal('fotografiaModal', 'fotografiaInfoBtn', 'fotografiaCtaBtn');
  wireAreaModal('equiposModal', 'equiposInfoBtn', 'equiposCtaBtn');

  // "Contáctanos": abre el formulario general de contacto
  var contactoTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-open-contacto]'));
  setupModal('contactoModal', {
    firstFieldId: 'c-nombre',
    openTriggers: contactoTriggers
  });

  // scroll-reveal animations
  if('IntersectionObserver' in window){
    var revealEls = document.querySelectorAll('[data-reveal]');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function(el){ el.classList.add('is-visible'); });
  }
});
