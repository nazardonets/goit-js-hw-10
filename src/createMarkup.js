import countryDetailsTmp from './templates/countryDetails.hbs';
import countriesListTmp from './templates/countriesList.hbs';
import getRefs from './getRefs';

const refs = getRefs();

export function createCountryDetailsMarkup(countryName) {
   let template = countryDetailsTmp(countryName);

   return (refs.countryContainerEl.innerHTML = template);
}

export function createCountriesListMarkup(countries) {
   let markup = '';
   let iteration = 1;

   countries.forEach(country => {
      if (iteration >= 10) {
         return;
      }

      iteration += 1;
      return (markup += countriesListTmp(country));
   });

   return (refs.countriesListEl.innerHTML = markup);
}
