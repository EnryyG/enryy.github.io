document.addEventListener('DOMContentLoaded', function() {
  // Handle navigation
  const navLinks = document.querySelectorAll('.mdt-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Handle search
  const searchForm = document.querySelector('.mdt-search-box');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add search logic here
    });
  }

  // Chat send
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const val = chatInput.value.trim();
      if (val.length > 0) {
        const msg = document.createElement('div');
        msg.className = 'mdt-chat-message';
        msg.innerHTML = `
          <img src="assets/john-smith.jpg" alt="You">
          <div>
            <b>You</b>
            <div>${val}</div>
          </div>
        `;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.value = '';
      }
    });
  }
  // Sidebar nav highlight
  const navItems = document.querySelectorAll('.mdt-nav li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
  // Exit button
  const exitBtn = document.querySelector('.mdt-exit');
  if (exitBtn) {
    exitBtn.addEventListener('click', function() {
      window.close();
    });
  }
});
