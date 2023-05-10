export {renderGallery}

const galleryEl = document.querySelector('.gallery')

function renderGallery (images) {
    const allImages = images
    .map((({id, largeImageURL, webformatURL, tags, likes, views, comments, downloads }) =>  {
        return `
        <div class="photo-card">
  <img src="${Object.values(webformatURL)}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${Object.values(likes)}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
        `})
    )
.join('')
galleryEl.innerHTML = allImages
}