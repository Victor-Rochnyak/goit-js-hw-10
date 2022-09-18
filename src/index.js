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
 if  (!searchBoxValue) {
      return;
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
  };





//  }
// import './css/styles.css';
// import { fetchCountries } from './js/api';
// //  import {fetchCountry} from './js/api.js';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import debounce from 'lodash.debounce';

// const DEBOUNCE_DELAY = 300;
// const refs = {
//   inputBox: document.querySelector('#search-box'),
//   countriList: document.querySelector('.country-list'),
//   countriInfo: document.querySelector('.country-info'),
// };

// refs.inputBox.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

// function onInputChange(e) {
//   const countryName = e.target.value.trim();

//   if (!countryName) {
//     clearTemplate();
//     return;
//   }

//   fetchCountries(countryName)
//     .then(data => {
//       if (data.length > 10) {
//         specificNameInfo();
//         clearTemplate();
//         return;
//       }
//       renderTemplate(data);
//     })
//     .catch(error => {
//       clearTemplate();
//       errorWarn();
//     });
// }

// function errorWarn() {
//     Notify.failure(`Oops, there is no country with that name`);
//   }

//   function specificNameInfo() {
//     Notify.info(`Too many matches found. Please enter a more specific name.`);
//   }

// function clearTemplate() {
//     refs.countriInfo.innerHTML = '';
//     refs.countriList.innerHTML = '';
//   }

// function renderTemplate(elements) {
//   let template = '';
//   let refsTemplate = '';
//   clearTemplate();

//   if (elements.length === 1) {
//     template = createItem(elements);
//     refsTemplate = refs.countriInfo;
//   } else {
//     template = createList(elements);
//     refsTemplate = refs.countriList;
//   }

//   drawTemplate(refsTemplate, template);
// }

// function createItem(element) {
//   return element.map(
//     ({ name, capital, population, flags, languages }) =>
//       `
//       <img
//         src="${flags.svg}" 
//         alt="${name.official}" 
//         width="80" 
//         height="50">
//       <h1 class="country-info__title">${name.official}</h1>
//       <ul class="country-info__list">
//           <li class="country-info__item">
//           <span>Capital:</span>
//         ${capital}
//           </li>
//           <li class="country-info__item">
//           <span>Population:</span>
//           ${population}
//           </li>
//           <li class="country-info__item">
//           <span>Lenguages:</span>
//           ${Object.values(languages)}
//           </li>
//       </ul>
//   `
//   );
// }

// function createList(elements) {
//   return elements
//     .map(
//       ({ name, flags }) => `
//       <li class="country-list__item">
//         <img class="country-list__img" 
//           src="${flags.svg}" 
//           alt="${name.official}" 
//           width="50" 
//           height="50">
//         ${name.official}
//       </li>`
//     )
//     .join('');
// }

// function drawTemplate(refs, markup) {
//   refs.innerHTML = markup;
// }