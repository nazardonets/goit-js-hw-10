import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountriesByName } from './fetchCountries.js';
import {
   createCountryDetailsMarkup,
   createCountriesListMarkup,
} from './createMarkup';
import getRefs from './getRefs';

const DEBOUNCE_DELAY = 300;
const refs = getRefs();

function resetMarkup() {
   refs.countryContainerEl.innerHTML = '';
   refs.countriesListEl.innerHTML = '';
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
         resetMarkup();

         return Notify.failure(
            `Oops, there is no country with name "${countryName}"`
         );
      });
}

function removeSpacesFromInput(value) {
   return value.trim();
}

function onInputEvent(e) {
   let countryName = removeSpacesFromInput(e.target.value);

   if (countryName === '') {
      return resetMarkup();
   } else {
      return renderUI(countryName);
   }
}

refs.searchInputEl.addEventListener(
   'input',
   debounce(e => onInputEvent(e), DEBOUNCE_DELAY)
);
