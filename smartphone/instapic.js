document.addEventListener('DOMContentLoaded', function() {
  // Like
  document.querySelectorAll('.instapic-like-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      var post = btn.closest('.instapic-post');
      var likes = post.querySelector('.likes-count');
      var liked = btn.classList.toggle('liked');
      let count = parseInt(likes.textContent, 10);
      likes.textContent = liked ? count + 1 : Math.max(0, count - 1);
    });
  });
  // Comment
  document.querySelectorAll('.instapic-comment-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var val = input.value.trim();
      if (!val) return;
      var postId = form.getAttribute('data-post');
      var commentsDiv = document.getElementById('instapic-comments-' + postId);
      var commentEl = document.createElement('div');
      commentEl.innerHTML = `<b>You</b> ${val}`;
      commentsDiv.appendChild(commentEl);
      input.value = '';
    });
  });
  // Add post (demo)
  var addBtn = document.getElementById('instapic-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      alert('Funzione di aggiunta post/storia non implementata in questa demo.');
    });
  }

  // Storie interagibili
  const stories = {
    your: {
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      user: "Your Story"
    },
    lb: {
      img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
      user: "lb"
    },
    breze: {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      user: "breze"
    },
    loaf: {
      img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      user: "loaf"
    },
    giulia: {
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      user: "giulia"
    }
  };
  // Chiudi la modale storia solo cliccando fuori dall'immagine o premendo ESC
  const storyModal = document.getElementById('story-modal');
  document.querySelectorAll('.instapic-story').forEach(story => {
    story.addEventListener('click', function() {
      const key = story.getAttribute('data-story');
      if (!stories[key]) return;
      document.getElementById('story-modal-img').src = stories[key].img;
      document.getElementById('story-modal-user').textContent = stories[key].user;
      storyModal.classList.add('active');
    });
  });
  // Chiudi storia cliccando fuori dal contenuto
  storyModal.addEventListener('click', function(e) {
    if (e.target === storyModal) {
      storyModal.classList.remove('active');
    }
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      storyModal.classList.remove('active');
      document.getElementById('dm-modal').classList.remove('active');
    }
  });

  // DM interagibile
  document.getElementById('open-dm').addEventListener('click', function() {
    document.getElementById('dm-modal').classList.add('active');
  });
  // Chiudi DM cliccando fuori dal contenuto
  document.getElementById('dm-modal').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
});
