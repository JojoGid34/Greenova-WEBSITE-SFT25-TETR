// BAKAL DIGANTI
// YANG INI BELUM ADA AI NYA
// BARU TEMPLATE DOANG
// KUDU BUAT BACKEND NYA LAGI HADEH

document.addEventListener('DOMContentLoaded', () => {
  // Navigasi menu burger di halaman chat.html
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');
  const closeMenuButton = document.querySelector('.close-menu');
  const body = document.body;

  const openMenu = () => {
    navList.classList.add('active');
    body.classList.add('menu-open');
  };

  const closeMenu = () => {
    navList.classList.remove('active');
    body.classList.remove('menu-open');
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', closeMenu);
  }

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // --- LOGIKA CHAT KHUSUS UNTUK CHAT.HTML ---

  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessagesContainer = document.getElementById('chat-messages');

  // Fungsi untuk menambahkan pesan ke container chat
  const addMessage = (message, sender) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    if (sender === 'user') {
      messageDiv.classList.add('user-message');
    } else {
      messageDiv.classList.add('bot-message');
    }
    const p = document.createElement('p');
    p.textContent = message;
    messageDiv.appendChild(p);
    chatMessagesContainer.appendChild(messageDiv);

    // Scroll ke bawah secara otomatis
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  };

  // Fungsi untuk mensimulasikan respons bot
  const simulateBotResponse = (userMessage) => {
    let botReply = "Maaf, saya belum memahami pertanyaan Anda. Bisakah Anda mencoba bertanya hal lain?";

    // Logika respons sederhana berdasarkan kata kunci
    if (userMessage.toLowerCase().includes('kualitas udara')) {
      botReply = "Kualitas udara saat ini di Surabaya terpantau sedang. Disarankan untuk mengurangi aktivitas di luar ruangan jika Anda sensitif terhadap polusi.";
    } else if (userMessage.toLowerCase().includes('pm2.5')) {
      botReply = "PM2.5 adalah partikel halus di udara yang berukuran 2.5 mikrometer atau kurang. Partikel ini sangat kecil dan bisa masuk jauh ke paru-paru, berpotensi menyebabkan masalah kesehatan.";
    } else if (userMessage.toLowerCase().includes('lokasi robot')) {
      botReply = "Robot Greenova AI kami saat ini tersebar di beberapa titik strategis di area perkotaan untuk pemantauan dan pembersihan udara. Anda bisa melihat peta lokasi detail di halaman 'Live Map & Robot Locations'.";
    } else if (userMessage.toLowerCase().includes('halo') || userMessage.toLowerCase().includes('hi')) {
      botReply = "Halo! Ada yang bisa Greenova AI bantu?";
    }

    // Delay sedikit untuk simulasi "bot mengetik"
    setTimeout(() => {
      addMessage(botReply, 'bot');
    }, 800);
  };

  // Event listener untuk tombol kirim pesan
  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      const message = chatInput.value.trim();
      if (message) {
        addMessage(message, 'user');
        simulateBotResponse(message);
        chatInput.value = ''; // Kosongkan input
      }
    });
  }

  // Event listener untuk tombol Enter di input chat
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        chatSendBtn.click(); // Panggil fungsi klik tombol kirim
      }
    });
  }
});