// Live chat e officers online demo

const officers = [
  {
    name: "John Smith",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    grade: "Sergeant",
    badge: "21-267",
    radio: "1.00 MHz"
  },
  {
    name: "Emily Davis",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    grade: "Recruit",
    badge: "00-310",
    radio: "1.00 MHz"
  },
  {
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    grade: "Chief Of Police",
    badge: "10-163",
    radio: "1.00 MHz"
  }
];

function renderOfficers() {
  const list = document.getElementById('officers-list');
  list.innerHTML = '';
  officers.forEach(off => {
    const div = document.createElement('div');
    div.className = 'mdt-officer';
    div.innerHTML = `
      <img class="mdt-officer-avatar" src="${off.avatar}" alt="${off.name}">
      <div class="mdt-officer-info">
        <span class="mdt-officer-name">${off.name}</span>
        <span class="mdt-officer-grade">${off.grade}</span>
        <span class="mdt-officer-badge">${off.badge}</span>
        <span class="mdt-officer-radio"><i class="fa fa-broadcast-tower"></i> ${off.radio}</span>
      </div>
    `;
    list.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Chat functionality
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  const messages = [
    {
      sender: 'Dispatch',
      text: 'Welcome to the MDT system. Stay safe out there.',
      time: new Date().toLocaleTimeString()
    }
  ];

  function addMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'mdt-chat-message';
    messageEl.innerHTML = `
      <strong>${message.sender}</strong>
      <span>${message.text}</span>
      <small>${message.time}</small>
    `;
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Render initial messages
  messages.forEach(addMessage);

  // Handle new message submission
  chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      const message = {
        sender: 'Officer',
        text: text,
        time: new Date().toLocaleTimeString()
      };
      addMessage(message);
      chatInput.value = '';
    }
  });

  renderOfficers();

  // Navigation highlight
  const navItems = document.querySelectorAll('.mdt-nav li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
