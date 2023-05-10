import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchFormEl = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadMoreBtn = document.getElementById('load-more');
const galleryEl = document.querySelector('.gallery');
const DEBOUNCE_DELAY = 2000;
// import { fetchImages } from './fetchImages';
// import { renderGallery } from './renderGallery';

const BASE_API_URL = 'https://pixabay.com/api';
const KEY = '35951390-f6c6ef4470c78e55c6c9cf8e4';
const page = 1;
// let query = '';
const perPage = 10;

const queryParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: perPage,
});


async function fetchImages() {
  try {
    
    const query = searchFormEl.value;

    const response = await axios.get(
      `${BASE_API_URL}?key=${KEY}&q=${query}&${queryParams}`
    );
    if (response.data.hits.length === 0) 
     throw new Error();
     return response.data

  } catch (error) {
    Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }
}

async function renderGallery() {
  const newImages = await fetchImages();
  const imagesHTML = newImages.hits
    .map(image => ` <div class="photo-card">
    <a href="${image.largeImageURL}">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${image.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${image.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${image.downloads}
    </p>
  </div>
</div>
        `)
 .join('');  
 galleryEl.innerHTML += imagesHTML;
 new SimpleLightbox('.gallery a', { });
}
    
async function createPage() {
    
    galleryEl.innerHTML=  ""
    const newImages = await fetchImages();
    Notiflix.Notify.success(`Hooray! We found ${newImages.totalHits} images.`);
    renderGallery();
    
  }


  searchFormEl.addEventListener('input', (createPage) );
 
async function nextPage () {
    page ++;
    const newImages = await fetchImages();
    if (page > newImages.totalHits/ perPage + 1 ) {
        Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          );
    }
};

loadMoreBtn.addEventListener('click', nextPage)

