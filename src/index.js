import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import countryDetailsTmp from './templates/countryDetails.hbs';
import countriesListTmp from './templates/countriesList.hbs';

const BASE_URL = 'https://restcountries.com/v3.1';
const OPTIONS = 'fields=name,capital,population,flags,languages';
const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryContainerEl = document.querySelector('.country');
const countriesListEl = document.querySelector('.country-list');

function fetchCountriesByName(name) {
   return fetch(`${BASE_URL}/name/${name}?${OPTIONS}`)
      .then(response => {
         if (response.status === 404) {
            throw new Error('grebanniy "fetch" ne lovit oshibku normalno');
         }
         return response.json();
      })
      .catch(error => console.log(error));
}

function onInputEvent(e) {
   let countryName = removeSpacesFromInput(e.target.value);

   if (countryName === '') {
      return resetMarkup();
   }

   return renderUI(countryName);
}

function renderUI(countryName) {
   fetchCountriesByName(countryName)
      .then(jsonData => {
         if (jsonData.length === 1) {
            resetMarkup();
            return createCountryDetailsMarkup(jsonData[0]);
         }
         if (jsonData.length > 1 && jsonData.length <= 9) {
            resetMarkup();
            return createCountriesListMarkup(jsonData);
         }

         if (jsonData.length > 10) {
            return Notify.info(
               'Too many matches found. Please enter a more specific name.'
            );
         }
      })
      .catch(() => {
         Notify.failure(`Oops, there is no country with name "${countryName}"`);
         resetMarkup();
      });
}

function createCountryDetailsMarkup(countryName) {
   let template = countryDetailsTmp(countryName);

   return (countryContainerEl.innerHTML = template);
}

function createCountriesListMarkup(countries) {
   let markup = '';
   let iteration = 1;

   countries.forEach(country => {
      if (iteration > 5) {
         return;
      }

      markup += countriesListTmp(country);

      iteration += 1;

      return markup;
   });

   return (countriesListEl.innerHTML = markup);
}

function resetMarkup() {
   countryContainerEl.innerHTML = '';
   countriesListEl.innerHTML = '';
}

function removeSpacesFromInput(value) {
   return value.trim();
}

searchInputEl.addEventListener(
   'input',
   debounce(e => onInputEvent(e), DEBOUNCE_DELAY)
);
