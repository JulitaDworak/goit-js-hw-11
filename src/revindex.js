import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchFormEl = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadMoreBtn = document.getElementById('load-more');
const galleryEl = document.querySelector('.gallery');
const perPage = 40;
let page = 1;
let totalPages = 0
let query =''



const BASE_API_URL = 'https://pixabay.com/api';
const KEY = '35951390-f6c6ef4470c78e55c6c9cf8e4';


loadMoreBtn.style.visibility = "hidden";

// funkcja, która pobiera dane  z serwera
async function fetchImages() {
  try {
    query = searchFormEl.value;
    const queryParams = new URLSearchParams({
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      });
    const response = await axios.get(
      `${BASE_API_URL}?key=${KEY}&q=${query}&${queryParams}`
    );
    if (response.data.hits.length === 0) throw new Error(); 
    loadMoreBtn.style.visibility = "hidden";
     return response.data;
  } catch (error) {
    Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.visibility = "hidden";
  }
}



// funkcja która wyswietla dane na stronie
async function renderGallery(images) {
  const imagesHTML = images
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

 galleryEl.insertAdjacentHTML('beforeend', imagesHTML)
 new SimpleLightbox('.gallery a', {});
}

// funkcja która utworzy nową stronę 
async function createPage() {
    const newImages = await fetchImages();
    Notiflix.Notify.success(`Hooray! We found ${newImages.totalHits} images.`);
    totalPages = newImages.totalHits / perPage
renderGallery(newImages.hits)
}

// funkcja, która umożliwa załadowanie kolejnych stron
async function nextPage () {
    ++page;
    const newImages = await fetchImages()
  try{
        if(page > totalPages) {
        throw new Error(error)}
        console.log('render');
        renderGallery(newImages.hits)
        } catch {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
    }
    }

async function createNewGallery (e) {
  e.preventDefault()
  query = searchFormEl.value;
  page = 1;
  totalPages = 0;
  galleryEl.innerHTML = '';
  loadMoreBtn.style.visibility = "visible";
  await createPage()
}

searchBtn.addEventListener('click', createNewGallery)

loadMoreBtn.addEventListener('click', ()=> nextPage( ))