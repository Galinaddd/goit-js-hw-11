import Notiflix from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');

import axios from 'axios';

const formRef = document.querySelector('.search-form');
const loadBtnRef = document.querySelector('.load-more');
const galleryRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSearch);
loadBtnRef.addEventListener('click', onLoadMore);

let page = 1;
let keyword = '';

async function onSearch(evt) {
  page = 1;
  evt.preventDefault();
  console.log('its a search', page);

  keyword = evt.currentTarget.elements.searchQuery.value.trim();

  const resault = await searchByKeyword(keyword);
  console.log('resault', resault);

  if (resault.data.hits.length) {
    galleryRef.innerHTML = createMarkup(resault.data.hits);
    lightbox.refresh();
    loadBtnRef.removeAttribute('hidden');

    console.log(loadBtnRef);
  } else
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
}

async function searchByKeyword(keyword) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = 'key=31640971-742b32395d0b897b4125e0e70';
  const PER_PAGE = 40;
  const params = `image_type=photo&orientation=horizontal&safesearch=true`;
  const searchQuery = `${BASE_URL}?${KEY}&${params}&per_page=${PER_PAGE}&page=${page}&q=${keyword}`;
  // console.log(searchQuery);
  return (response = await axios.get(searchQuery));
}

function createMarkup(arr) {
  console.log('arr in createmarkup', arr);
  return arr
    .map(
      el => `<a  href="${el.largeImageURL}">
     <div class="photo-card">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${el.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${el.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${el.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${el.downloads}</b>
    </p>
  </div>
</div>
</a>`
    )
    .join(' ');
}

async function onLoadMore() {
  page += 1;
  console.log('load more click');
  const resault = await searchByKeyword(keyword);
  console.log(resault);
  galleryRef.insertAdjacentHTML('beforeend', createMarkup(resault.data.hits));
  if (page * 40 >= resault.data.totalHits) {
    loadBtnRef.setAttribute('hidden', true);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
