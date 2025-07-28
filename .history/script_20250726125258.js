document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  // Mobile menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
  }

  // Optional: Smooth scrolling for anchor links (lebih baik secara native dengan CSS scroll-behavior)
  // const navLinks = document.querySelectorAll('.nav-list a');
  // navLinks.forEach(link => {
  //     link.addEventListener('click', (e) => {
  //         e.preventDefault();
  //         const targetId = link.getAttribute('href');
  //         document.querySelector(targetId).scrollIntoView({
  //             behavior: 'smooth'
  //         });
  //         // Close mobile menu after clicking a link
  //         if (navList.classList.contains('active')) {
  //             navList.classList.remove('active');
  //         }
  //     });
  // });

  // Anda bisa menambahkan CSS `html { scroll-behavior: smooth; }` untuk smooth scrolling native.
});