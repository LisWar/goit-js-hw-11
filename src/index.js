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
const returnBtn = document.querySelector('.load-more');

returnBtn.addEventListener('click', returnToTop);
searchForm.addEventListener('submit', e => handleSubmit(e))
returnBtn.addEventListener('click', handleMore)

async function handleSubmit(e) {
    e.preventDefault();
    clearOutput()
    
    fetchApi.page = 1;

    request = formInput.value.trim();
    if (request == '') {
        return;
    }
    const data = await getData(request);
    const hits = await data.totalHits;
    if (hits == 0) {
        returnBtn.classList.add("hidden");
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    }

    await draw(data).then(() => {
        if (fetchApi.page * fetchApi.perPage >= hits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        return;
        }
        // returnBtn.classList.remove("hidden");
    })
    fetchApi.page = 2;

    window.addEventListener('scroll', scrollRefresh);    
}

async function handleMore() {
    const request = formInput.value
    const data = await getData(request);
    const hits = await data.totalHits;

    if (fetchApi.page * fetchApi.perPage >= hits) {
        window.removeEventListener('scroll', scrollRefresh);
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        
        const pageBottomPos = document
          .querySelector(".gallery")
          .firstElementChild.getBoundingClientRect();

          console.log('pageBottomPos: ', pageBottomPos.bottom);
        if  (pageBottomPos.bottom < 0
            ) {
                returnBtn.classList.remove('hidden')
            }

        const AAA =   document
          .querySelector(".gallery")
          .firstElementChild.getBoundingClientRect();

          console.log('AAA: ', AAA);
        //   window.innerHeight
          console.log('window.innerHeight: ', window.innerHeight);
          console.log(AAA.bottom > 0);

    }

    // const { height: cardHeight } = document
    // .querySelector(".gallery")
    // .firstElementChild.getBoundingClientRect();

    draw(data)

    // .then(() =>
    //     window.scrollBy({
    //     top: cardHeight * 2,
    //     behavior: "smooth",
    // }  
    //  ));

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


async function checkMore(data) {
    const hits = await data.totalHits;
    console.log('(page * perPage >= hits): ', (page * perPage >= hits));
    return (page * perPage >= hits)
}

function scrollRefresh() {
    const galleryRect = gallery.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (galleryRect.bottom <= windowHeight) {
        handleMore();
    }
}

function returnToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    returnBtn.classList.add("hidden");
}