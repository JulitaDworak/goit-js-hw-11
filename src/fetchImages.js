
import Notiflix from 'notiflix';
export {fetchImages}

const BASE_API_URL = 'https://pixabay.com/api'
const KEY = "35951390-f6c6ef4470c78e55c6c9cf8e4"
let page = 1
let query = ''
const perPage = 40

 const queryParams = new URLSearchParams({
        image_type: "photo",
        orientation: "hotizontal",
        safesearch: true
   })

async function fetchImages() {
   try{
    query = searchFormEl.value
   const response = await axios.get(`${BASE_API_URL}?key=${KEY}&q=${query}&${queryParams}&page=${page}$per_page=${perPage}`);
   if(response.data.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
   }
console.log(response.data);
return response.data;
   }
   catch (error) {
    console.log(`errrror`);
   }
}

