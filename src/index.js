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

const BASE_API_URL = 'https://pixabay.com/api';
const KEY = '35951390-f6c6ef4470c78e55c6c9cf8e4';
let page = 1;
const perPage = 30;
let totalPages = 0
let query =''

const queryParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: page,
  per_page: perPage,
});

loadMoreBtn.style.visibility = "hidden"

async function fetchImages() {
  try {
    query = searchFormEl.value;
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
    
// async function createPage() {
     
//   await renderGallery();
//     galleryEl.innerHTML=  ""
//     const newImages = await fetchImages();
//     Notiflix.Notify.success(`Hooray! We found ${newImages.totalHits} images.`);
//     loadMoreBtn.style.visibility = "visible"
//   }
  async function createPage() {
    const newImages = await fetchImages();
    Notiflix.Notify.success(`Hooray! We found ${newImages.totalHits} images.`);
    totalPages = newImages.totalHits/ perPage
    galleryEl.innerHTML=  ""
    loadMoreBtn.style.visibility = "visible"
    newImages.hits.forEach(image => renderGallery(image))
    // console.log(totalPages);
    // console.log(newImages.totalHits);
  }
  
function createNewGallery (e) {
  e.preventDefault()
  query = searchFormEl.value;
  page = 1;
  totalPages = 0;
  galleryEl.innerHTML = '';
  loadMoreBtn.style.visibility = "visible";
  createPage()

}

searchBtn.addEventListener('click', createNewGallery)


async function nextPage () {
  page ++;
  const newImages = await fetchImages();
  newImages.hits.forEach(image => renderGallery(image))
  if (page > newImages.totalHits/ perPage + 1 ) {
      Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
  }
};

loadMoreBtn.addEventListener('click' , async () => {
  await nextPage()
})
