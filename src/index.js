import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('[id="search-box"]');
const countryList = document.querySelector('.country-list');
const countryCommonInfo = document.querySelector('.country-info');

function showCountry() {
  fetchCountries(searchBox.value.trim())
    .then(country => {
      countryList.innerHTML = '';
      countryCommonInfo.innerHTML = '';

      if (country.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (country.length >= 2 && country.length <= 10) {
        listCountry(country);
      } else if (country.length === 1) {
        infoAboutCountry(country);
      }
    })
    .catch(showError);
}

function listCountry() {
  const markup = country
    .map(({ flags, name }) => {
      return `<li class="country-list">
        <img class="flag-list" src="${flags.svg} alt="${name.common}" width="50"/>
        <span class="name-list">${name.common}</span>
    </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function infoAboutCountry([{ flags, name, capital, population, languages }]) {
  countryCommonInfo.innerHTML = `<img src=${flags.svg} class="flags" alt="Flag of ${
    name.official
  }" width="50"/>
    <span class="country-name">${name.official}</span>
    <p class="info">Capital: <span class="info-span">${capital}</span></p>
    <p class="info">Population: <span class="info-span">${population}</span></p>
    <p class="info">Languages: <span class="info-span">${Object.values(languages).join(
      ', ',
    )}</span></p>
    `;
}

function showError(error) {
  Notify.failure('Oops, there is no country with that name');

  countryCommonInfo.innerHTML = '';
  countryList.innerHTML = '';
}

searchBox.addEventListener('input', debounce(showCountry, DEBOUNCE_DELAY));
