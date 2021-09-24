const search = document.querySelector('.nav__search');
const container = document.querySelector('.container');
const message = document.querySelector('.message');
const error = document.querySelector('.error');

const state = {
  query: '',
  previous: [],
  result: {},
};

const AJAX = async function (country) {
  try {
    const fetchData = await fetch(
      `https://disease.sh/v3/covid-19/countries/${country}?strict=true`
    );
    const data = await fetchData.json();

    if (data.message) throw new Error(`${data.message} (${fetchData.status})`);

    state.query = country;
    state.result = data;

    render(state.result);

    if (state.query !== state.previous[0] && state.previous.length > 0) {
      update(state.result);
      state.previous.splice(state.previous[0]);
    }

    console.log(data);
  } catch (err) {
    renderError(err.message);
    console.error(err);
  }
};

const query = function () {
  const country = search.querySelector('.search__input').value;

  state.query = country;
  state.previous.push(country);
  AJAX(country);

  search.querySelector('.search__input').value = '';
};

search.addEventListener('submit', function (e) {
  e.preventDefault();
  message.classList.add('hidden');
  query();
  error.classList.add('hidden');
});

const render = function (data) {
  try {
    const markup = `
    <div class="content content__item-0">
      <img crossorigin="anonymous" class="country country__flag"src="${
        data.countryInfo.flag
      }"/>
      <p class="country country__name">${data.country}</p>
      <p class="country__details-1">Continent <span id="details">${
        data.continent
      }</span></p>
      <p class="country__details-2">Population <span id="details2">${data.population
        .toLocaleString()
        .toString()}</span></p>
    </div>
    <div class="content content__item-1">
    <p>Total cases<span id="total">${data.cases
      .toLocaleString()
      .toString()}</span></p>
    </div>
    <div class="content content__item-2">
        <p>Active cases<span id="active">${data.active
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-3">
        <p>Recovered<span id="recovered">${data.recovered
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-4">
        <p>Critical cases<span id="critical">${data.critical
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-5">
        <p>Deaths<span id="deaths">${data.deaths
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-6">
        <p>Cases today<span id="todayCases">${data.todayCases
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-7">
        <p>Deaths today<span id="todayDeaths">${data.todayDeaths
          .toLocaleString()
          .toString()}</span></p>
    </div>
    `;

    container.insertAdjacentHTML('afterbegin', markup);
  } catch (err) {
    throw err;
  }
};

const update = function (data) {
  const newMarkup = `
      <nav class="nav">
      <form class="nav__search">
        <input
          type="text"
          class="search__input"
          placeholder="Search country"
        />
      </form>
      <div class="nav__link-box">
        <a href="#" id="home" class="nav__link-1">Home</a>
      </div>
      <div class="nav__link-box">
        <a href="#" class="nav__link-2">Health & Safety</a>
      </div>
      <div class="nav__link-box">
        <a href="#" class="nav__link-3">Tools</a>
      </div>
      <div class="nav__link-box">
        <a href="#" class="nav__link-4">Contact</a>
      </div>
    </nav>

    <div class="content content__item-0">
      <img crossorigin="anonymous" class="country country__flag"src="${
        data.countryInfo.flag
      }"/>
      <p class="country country__name">${data.country}</p>
      <p class="country__details-1">Continent <span id="details">${
        data.continent
      }</span></p>
      <p class="country__details-2">Population <span id="details2">${data.population
        .toLocaleString()
        .toString()}</span></p>
    </div>
    <div class="content content__item-1">
    <p>Total cases<span id="total">${data.cases
      .toLocaleString()
      .toString()}</span></p>
    </div>
    <div class="content content__item-2">
        <p>Active cases<span id="active">${data.active
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-3">
        <p>Recovered<span id="recovered">${data.recovered
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-4">
        <p>Critical cases<span id="critical">${data.critical
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-5">
        <p>Deaths<span id="deaths">${data.deaths
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-6">
        <p>Cases today<span id="todayCases">${data.todayCases
          .toLocaleString()
          .toString()}</span></p>
    </div>
    <div class="content content__item-7">
        <p>Deaths today<span id="todayDeaths">${data.todayDeaths
          .toLocaleString()
          .toString()}</span></p>
    </div>
    `;

  const newDOM = document.createRange().createContextualFragment(newMarkup);

  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const curElements = Array.from(container.querySelectorAll('*'));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];

    if (!newEl.isEqualNode(curEl)) {
      Array.from(newEl.attributes).forEach(attr =>
        curEl.setAttribute(attr.name, attr.value)
      );
    }
  });
  container.innerHTML = '';
  container.insertAdjacentHTML('afterbegin', newMarkup);
};

const renderError = function (err) {
  const markup = `
    <div class="error">${err}</div>
  `;

  container.insertAdjacentHTML('afterbegin', markup);
};
