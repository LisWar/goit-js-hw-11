import Fetch from "./fetch"
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const fetchApi = new Fetch();

const lightbox = new SimpleLightbox('.photo-card a');

const searchForm = document.querySelector('#search-form');
const formButton = searchForm.querySelector('button');
const formInput = searchForm.querySelector('input');
const gallery = document.querySelector('.gallery');
const moreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', e => handleSubmit(e))
moreBtn.addEventListener('click', handleMore)
moreBtn.classList.add("hidden");


async function handleSubmit(e) {
    e.preventDefault();
    moreBtn.classList.add("hidden");

    clearOutput()
    
    fetchApi.page = 1;

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });

    const query = formInput.value.trim();
    if (query == '') {
        return;
    }
    const data = await getData(query);
    const hits = await data.totalHits;
    if (hits == 0) {
        moreBtn.classList.add("hidden");
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }

    await draw(data).then(() => {
        if (fetchApi.page * fetchApi.perPage >= hits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        moreBtn.classList.add("hidden");
        return;
        }
        
    })
    .then(moreBtn.classList.remove("hidden"));

    fetchApi.page = 2;

}

async function handleMore() {
    const request = formInput.value
    const data = await getData(request);
    const hits = await data.totalHits;

    if (fetchApi.page * fetchApi.perPage >= hits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        moreBtn.classList.add("hidden");
    }
   
    draw(data)

    const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();
  
    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });

    fetchApi.page += 1;
}

async function getData(query) {
    fetchApi.query = query;
    try {
        const response = await fetchApi.fetchPics();
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function draw(data) {
    const page = fetchApi.page;
    const collectedData = await data;
    const galleryImages = collectedData.hits;
    if (page == 1) {
        Notiflix.Notify.success(`Hooray! We found ${collectedData.totalHits} images`)
    }

    const galleryArr = await galleryImages.map(img => {
        const markup = `
        <div class="photo-card">
            <a class="gallery-item" href="${img.largeImageURL}">
                <img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}"/></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${img.likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${img.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${img.comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${img.downloads}</span>
                </p>
            </div>
        </div>
        `        
        return markup;
      })
    await gallery.insertAdjacentHTML('beforeend', galleryArr)
    lightbox.refresh()

}

function clearOutput() {
    gallery.innerHTML = '';
}


// async function checkMore(data) {
//     const hits = await data.totalHits;
//     console.log('(page * perPage >= hits): ', (page * perPage >= hits));
//     return (page * perPage >= hits)
// }

// function scrollRefresh() {
//     const galleryRect = gallery.getBoundingClientRect();
//     const windowHeight = window.innerHeight;
    
//     if (galleryRect.bottom <= windowHeight) {
//         handleMore();
//     }
// }

// function returnToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     moreBtn.classList.add("hidden");
// }
