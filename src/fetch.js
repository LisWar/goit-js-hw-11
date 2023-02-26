const axios = require('axios').default;
// module.exports = Fetch;

const API_KEY = '33882008-da48b9f8329c70a8d1ccf5719';
const BASE_URL = 'https://pixabay.com/api/';
// const settings = {key: API_KEY, url: BASE_URL, perPage: 40}


export default class Fetch {
    constructor() {
        this.query = '';
        this.page = 1;
        this.perPage = 40;
    }

    async fetchPics()
    {
        const options = `?key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
        const url = `${BASE_URL}/${options}`;
        // console.log('fetchPics url: ', url);

        const response = await axios.get(url);
        // console.log('fetchPics response: ', response);
        const data = await response.data;
        // console.log('fetchPics: ', data);

        return data;   
    }

    setPage(page){
        this.page = page
    }
    getPage(){
        return this.page;
    }
    setQuery(query){
        this.query = query
    }
    getQuery(){
        return this.query;
    }
}