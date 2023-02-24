// import fetchPics from "./fetch"
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
const axios = require('axios').default;




const API_KEY = '33882008-da48b9f8329c70a8d1ccf5719';
const BASE_URL = 'https://pixabay.com/api/';
let request = '';
let page = 1;
const perPage = 40;
// let options = `?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`

async function fetchPics(query)
{
    request = query;

    let options = `?key=${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    const url = `${BASE_URL}/${options}`;


    const response = await axios.get(url);

    console.log('data: ', response);

    const data = await response.data;
    console.log('data: ', data);
    // axios.formToJSON(url);

    
    return data;
    
}

// //////////////////////////////////////////////////////////////////////

const searchForm = document.querySelector('#search-form');
const formButton = searchForm.querySelector('button');
const formInput = searchForm.querySelector('input');
const gallery = document.querySelector('.gallery');
const showMoreBtn = document.querySelector('.load-more');
// console.log('gallery: ', gallery);
searchForm.addEventListener('submit', e => handleSubmit(e))
showMoreBtn.addEventListener('click', handleMore)

async function handleSubmit(e) {
    e.preventDefault();
    clearOutput()
    page = 1;

    request = formInput.value
    if (request == '') {
        return;
    }
    const data = await getData(request);
    if (data.totalHits == 0) {
        Notiflix.Notify.failure("No images found!");
        return;
    }
    await draw(data)
    page = 2;
    showMoreBtn.classList.remove("hidden");
}

async function handleMore() {
    console.log('HANDLE page: ', page);

    const request = formInput.value

    const data = await getData(request);
    const hits = await data.totalHits;
    console.log('handleMore data: ', data.totalHits);
    if (page * perPage >= hits) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        showMoreBtn.classList.add("hidden");
    }
    await draw(data)
    page += 1;


}

async function getData(query) {
    try {
        const response = await fetchPics(query);
        console.log("SHOW PAGE response", response);
        // const data = await response.json();
        // console.log('getData data: ', data);
        // return data;
        return response;
    } catch (error) {
        console.log(error);
    }
}

async function draw(data) {
    
    const collectedData = await data;
    console.log('collectedData: ', collectedData);
    const galleryImages = collectedData.hits;
    if (page == 1) {
        Notiflix.Notify.success(`Hooray! We found ${collectedData.totalHits} images`)
    }

    galleryImages.forEach(element => {
        // console.log('element: ', ${element});
        const markup = `
        <div class="photo-card">
            <a class="gallery-item" href="${element.largeImageURL}">
                <img class="gallery-image" src="${element.webformatURL}" alt="${element.tags}"/></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <span>${element.likes}</span>
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <span>${element.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <span>${element.comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <span>${element.downloads}</span>
                </p>
            </div>
        </div>
        `

        gallery.insertAdjacentHTML('beforeend', markup)
    }
    );
    
}

function clearOutput() {
    gallery.innerHTML = '';
}

var lightbox = new SimpleLightbox('.photo-card a');