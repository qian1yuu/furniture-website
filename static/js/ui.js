(function () {
    'use strict';

    var toggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    if (toggle && navMenu) {
        toggle.addEventListener('click', function () {
            var open = navMenu.classList.toggle('open');
            toggle.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        navMenu.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('open');
                toggle.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    var header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }
    }, { passive: true });
})();
