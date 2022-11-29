import Notiflix from 'notiflix';
import { PixApi } from './js/fetchImage';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import imageMarkUp from './templates/imageCardMarkUp.hbs';

// key (required)	str	Your API key: 31532418-13e40827eb9e43f177cec6109
const pixApi = new PixApi();
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 500,
});

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

async function onSubmit(event) {
  event.preventDefault();

  const inputValue = event.currentTarget.elements.searchQuery.value;
  pixApi.query = inputValue.toLowerCase().trim();

  if (!pixApi.query) {
    Notiflix.Notify.info(`Please, enter search query`);
    return;
  }
  pixApi.query = inputValue;
  refs.gallery.innerHTML = '';
  pixApi.page = 1;
  refs.loadMoreBtn.classList.add('is-hidden');
  createLightBox();

  try {
    const imageRender = await pixApi.fetchImage();
    const { hits, totalHits } = imageRender.data;
    if (!totalHits) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    createGallery(hits);

    if (totalHits > pixApi.per_page) {
      refs.loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
  event.target.reset();
}

async function onLoadMore() {
  pixApi.page += 1;
  try {
    const imageRender = await pixApi.fetchImage();
    const { hits, totalHits } = imageRender.data;
    createGallery(hits);
    console.log(`This is totalHits typeof`, typeof totalHits);

    if (pixApi.page > totalHits / pixApi.per_page) {
      refs.loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function createGallery(arrayOfPhotos) {
  refs.gallery.insertAdjacentHTML('beforeend', imageMarkUp(arrayOfPhotos));
  lightbox.refresh();
}

function createLightBox() {
  return lightbox;
}

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
