const BASE_URL = 'https://restcountries.com/v3.1';
const OPTIONS = 'fields=name,capital,population,flags,languages';

export function fetchCountriesByName(name) {
   return fetch(`${BASE_URL}/name/${name}?${OPTIONS}`)
      .then(response => {
         if (!response.ok) {
            throw new Error();
         }
         return response.json();
      })
      .catch(() => {});
}
