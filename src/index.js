import './css/styles.css';
 import { Notify } from 'notiflix/build/notiflix-notify-aio';
 import debounce from 'lodash.debounce';
 import {fetchCountry} from './js/api.js';
 import {refs} from './js/refs.js'
  const DEBOUNCE_DELAY = 300;

  // создание разметки Флага, Имя, 
  function countryСardTemplate({
    flags,
    name,
    capital,
    population,
    languages,
  }) {
    return `
      <div class="country-info__container">
        <div class="country-info__wrapper">
          <img class="country-info__flags" src="${flags.svg}" alt="${
      name.official
    }" width="50" />
          <h2 class="country-info__name">${name.official}</h2>
        </div>
        <p class="country-info__capital"><span class="country-info__weight">Capital:</span> ${capital}</p>
        <p class="country-info__population"><span class="country-info__weight">Population:</span> ${population}</p>
        <p class="country-info__languages"><span class="country-info__weight">Languages:</span> ${Object.values(
          languages
        )}</p>
      </div>
    `;
  }
  
   function countryListTemplate({ flags, name }) {
    return `
    <li class="country-list__item">
      <img class="country-list__flags" src="${flags.svg}" alt="${name.official}" width="25" />
      <h2 class="country-list__name">${name.official}</h2>
    </li>
    `;
  }

 // иницилизация
 // вешаем обработчика собітия сабмит
   refs.searchBox.addEventListener(`input`, debounce(onSearch, DEBOUNCE_DELAY));
 
  // ф-ция коллбек при сабмите на форму находит запрос
   function onSearch(event) {
     event.preventDefault();
     // выполни санитизацию введенной строки методом trim()
     const boxValue =  refs.searchBox.value;
      const searchBoxValue = boxValue.trim();
 if (searchBoxValue === '') {
     refs.countryList.innerHTML = '';
     refs.countryInfo.innerHTML = '';
 }
 // вызываем фукнция при сабмите на импут и обрабатываем ошибку 
     fetchCountry(searchBoxValue)
     .then(renderCountryCard)
     .catch((error) => {
         Notify.failure('Oops, there is no country with that name')
     });
 }
 
 //ф-ция подбора значений + интерфейс
   function renderCountryCard(countrys) {
     if (countrys.length >= 1 && countrys.length < 10) {
     const markup = countrys.map(country =>  countryListTemplate(country));
     refs.countryInfo.innerHTML = markup.join('');
     refs.countryList.innerHTML = '';    
     } 
     if (countrys.length === 1) {        
     const markup = countrys.map(country =>  countryСardTemplate(country));
     refs.countryInfo.innerHTML = markup.join('');
     refs.countryList.innerHTML = '';
    }
    if (countrys.length >= 10) {
     Notify.info('Too many matches found. Please enter a more specific name.');
    }
    
 }