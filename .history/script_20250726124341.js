document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-list a');
  const pageSections = document.querySelectorAll('.page-section');
  const menuToggle = document.querySelector('.menu-toggle'); // Hanya satu menu-toggle di header
  const navList = document.querySelector('.nav-list');
  const allButtons = document.querySelectorAll('button[data-target-page]'); // Select all buttons with data-target-page

  // Function to show a specific page and hide others
  const showPage = (pageId) => {
    pageSections.forEach(section => {
      section.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top of the new page
    }
  };

  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = link.getAttribute('data-page');
      showPage(pageId);
      // Close mobile menu after clicking a link
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
      }
    });
  });

  // Handle button clicks that navigate to other pages
  allButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const targetPageId = button.getAttribute('data-target-page');
      if (targetPageId) {
        showPage(targetPageId);
      }
    });
  });

  // Mobile menu toggle (hanya satu event listener untuk menu di header)
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
    });
  }

  // Show the home page initially
  showPage('home');
});