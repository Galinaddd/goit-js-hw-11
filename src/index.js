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
  keyword = evt.currentTarget.elements.searchQuery.value.trim();
  try {
    const resault = await searchByKeyword(keyword);

    if (resault.data.hits.length) {
      galleryRef.innerHTML = createMarkup(resault.data.hits);
      lightbox.refresh();
      loadBtnRef.removeAttribute('hidden');
    } else
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  } catch (err) {
    console.log(err);
  }
}

async function searchByKeyword(keyword) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = 'key=31640971-742b32395d0b897b4125e0e70';
  const PER_PAGE = 40;
  const params = `image_type=photo&orientation=horizontal&safesearch=true`;
  const searchQuery = `${BASE_URL}?${KEY}&${params}&per_page=${PER_PAGE}&page=${page}&q=${keyword}`;

  try {
    const response = await axios.get(searchQuery);
    return response;
  } catch (error) {
    console.log(error);
  }
}

function createMarkup(arr) {
  // console.log('arr in createmarkup', arr);
  return arr
    .map(
      el => `
     <div class="photo-card"><a  href="${el.largeImageURL}">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" /></a>
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
`
    )
    .join(' ');
}

async function onLoadMore() {
  page += 1;
  console.log('load more click');

  const resault = await searchByKeyword(keyword);

  galleryRef.insertAdjacentHTML('beforeend', createMarkup(resault.data.hits));
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });

  if (page * 40 >= resault.data.totalHits) {
    loadBtnRef.setAttribute('hidden', true);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
