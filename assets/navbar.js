// About dropdown (loaded lazily by loader.js).
(() => {
    const navBtn = document.getElementById('about-menu-btn');
    const dropdownContainer = document.querySelector('.dropdown');
    const backBtn = document.querySelector('.d-content-back');

    // cek apakah perangkat menggunakan layar sentuh (touch) atau tidak
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;

    const closeDropdown = () => {
        if (!navBtn) return;
        navBtn.classList.remove('active');
        navBtn.setAttribute('aria-expanded', 'false');
        if (document.activeElement && dropdownContainer && dropdownContainer.contains(document.activeElement)) {
            document.activeElement.blur();
        }
    };

    if (navBtn && dropdownContainer) {
        if (isTouchDevice) {
            //handphone / tablet mode
            navBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Cegah halaman melompat
                const open = navBtn.classList.toggle('active');
                navBtn.setAttribute('aria-expanded', String(open));
            });

            //tutup dropdown jika menyentuh area di luar menu
            document.addEventListener('click', (e) => {
                if (!dropdownContainer.contains(e.target)) {
                    closeDropdown();
                }
            });

        } else {
            //cursor mode
            dropdownContainer.addEventListener('mouseenter', () => {
                navBtn.classList.add('active'); // Buka saat kursor masuk
                navBtn.setAttribute('aria-expanded', 'true');
            });

            dropdownContainer.addEventListener('mouseleave', () => {
                closeDropdown(); // Tutup saat kursor keluar
            });

            //cegah halaman melompat jika pengguna desktop iseng mengkliknya
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const open = navBtn.classList.toggle('active');
                navBtn.setAttribute('aria-expanded', String(open));
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeDropdown();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDropdown();
        });
    }
})();
