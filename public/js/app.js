function selectBtnEventHandler() {
  document.querySelector('.select-btn').addEventListener('click', () => {
    document.querySelector('.select-options').classList.toggle('active');
  });
}

function renderFilterOptions() {
  fetch('http://localhost:3000/data/data.json')
    .then((res) => res.json())
    .then((data) => {
      return data.filterOptions.reduce((acc, str) => {
        return acc + `<li class="select-option">${str}</li>`;
      }, '');
    })
    .then((html) => {
      document.querySelector('.select-options').innerHTML += html;
    });
}
renderFilterOptions();
selectBtnEventHandler();

const timer = setInterval(() => {
  if (document.querySelector('.search-bar').value) {
    if (
      !document.querySelector('.searched-words').classList.contains('active')
    ) {
      document.querySelector('.searched-words').classList.add('active');
    }
  } else {
    if (document.querySelector('.searched-words').classList.contains('active'))
      document.querySelector('.searched-words').classList.remove('active');
  }
}, 500);

document.querySelector('.search-bar').addEventListener('keyup', () => {
  renderSuggestions(document.querySelector('.search-bar').value);
});

function renderSuggestions(prefix) {
  fetch(
    `https://completion.amazon.com/api/2017/suggestions?session-id=133-4736477-7395454&customer-id=&request-id=4YM3EXKRH1QJB16MSJGT&page-type=Gateway&lop=en_US&site-variant=desktop&client-info=amazon-search-ui&mid=ATVPDKIKX0DER&alias=aps&b2b=0&fresh=0&ks=8&prefix=${prefix}&event=onKeyPress&limit=11&fb=1&suggestion-type=KEYWORD`
  )
    .then((res) => res.json())
    .then((data) => data.suggestions.map((v) => v.value))
    .then((suggestions) => {
      return suggestions.reduce((acc, str) => {
        return acc + `<li class="searched-word">${str}</li>`;
      }, '');
    })
    .then((html) => {
      document.querySelector('.searched-words').innerHTML = '';
      document.querySelector('.searched-words').innerHTML += html;
    });
}
