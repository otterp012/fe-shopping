document.querySelector('.select-btn').addEventListener('click', () => {
  document.querySelector('.select-options').classList.toggle('active');
});

const timer = setInterval(() => {
  if (document.querySelector('.search-bar').value) {
    document.querySelector('.searched-words').classList.add('active');
  } else {
    if (document.querySelector('.searched-words').classList.contains('active'))
      document.querySelector('.searched-words').classList.remove('active');
  }
}, 500);
