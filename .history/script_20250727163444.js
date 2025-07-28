// script.js (untuk index.html, about.html, how-it-works.html, dll.)

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const closeMenuButton = document.querySelector('.close-menu');
    const body = document.body;

    // Fungsi untuk membuka menu
    const openMenu = () => {
        navList.classList.add('active');
        body.classList.add('menu-open');
    };

    // Fungsi untuk menutup menu
    const closeMenu = () => {
        navList.classList.remove('active');
        body.classList.remove('menu-open');
    };

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }

    // Tombol tutup menu
    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMenu);
    }

    // Menutup menu saat mengklik link di dalam menu
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Karena setiap page sekarang file HTML terpisah,
    // tidak perlu lagi logika untuk showPage antar section.
    // Navigasi dilakukan oleh browser secara native melalui href.
});