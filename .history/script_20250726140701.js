document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const closeMenuButton = document.querySelector('.close-menu'); // Tombol tutup menu
    const body = document.body; // Referensi ke elemen body

    // Fungsi untuk membuka menu
    const openMenu = () => {
        navList.classList.add('active');
        body.classList.add('menu-open'); // Tambahkan kelas untuk mencegah scrolling body
    };

    // Fungsi untuk menutup menu
    const closeMenu = () => {
        navList.classList.remove('active');
        body.classList.remove('menu-open'); // Hapus kelas untuk mengizinkan scrolling body
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
            closeMenu(); // Tutup menu setelah link diklik
        });
    });

    // Catatan: Navigasi antar section sekarang ditangani oleh browser secara native
    // melalui anchor link (href="#id-section") berkat `html { scroll-behavior: smooth; }` di CSS.
    // Tidak perlu lagi JavaScript untuk `showPage` karena semua section ditampilkan.
});