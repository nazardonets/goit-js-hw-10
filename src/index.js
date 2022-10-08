import './css/styles.css';
import debounce from 'lodash.debounce';

const BASE_URL = 'https://restcountries.com/v3.1';
const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryContainerEl = document.querySelector('.country');

function fetchCountriesByName(name) {
   fetch(`${BASE_URL}/name/${name}`)
      .then(r => {
         return r.json();
      })
      .then(data => {
         console.log(data);
         renderTemplate(data[0]);
         return data;
      })
      .catch(error => console.log(error));
}

searchInputEl.addEventListener(
   'input',
   debounce(e => {
      if (e.target.value === '') {
         return (countryContainerEl.innerHTML = '');
      }
      let countryName = e.target.value;
      fetchCountriesByName(countryName);
   }, DEBOUNCE_DELAY)
);

function renderTemplate(country) {
   let template = `<h1 class='country-title'>
            <img class='country-flag' src='${
               country.flags.png
            }' height="25" width="auto"/>
            <span data-country-name>${country.name.official}</span>
            </h1>
            <ul class='country-info__list'>
               <li class='country-info__item'>
                  <b>Capital:</b> ${country.name.common}
               </li>
               <li class='country-info__item'>
                  <b>Population:</b> ${country.population}
               </li>
               <li class='country-info__item'>
                  <b>Languages:</b> ${Object.values(country.languages).join(
                     ', '
                  )}
               </li>
            </ul>`;

   return (countryContainerEl.innerHTML = template);
}
