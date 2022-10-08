import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import countryDetailsTmp from './templates/countryDetails.hbs';
import countriesListTmp from './templates/countriesList.hbs';
import { fetchCountriesByName } from './api-service.js';

const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryContainerEl = document.querySelector('.country');
const countriesListEl = document.querySelector('.country-list');

function onInputEvent(e) {
   let countryName = removeSpacesFromInput(e.target.value);

   if (countryName === '') {
      return resetMarkup();
   } else {
      return renderUI(countryName);
   }
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
         return Notify.failure(
            `Oops, there is no country with name "${countryName}"`
         );
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

      iteration += 1;
      return (markup += countriesListTmp(country));
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
