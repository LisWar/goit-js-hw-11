
module.exports = fetchPics;

const API_KEY = '33882008-da48b9f8329c70a8d1ccf5719';
const BASE_URL = 'https://pixabay.com/api/';
let request = '';
const options = `?${API_KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true`

function fetchPics(query)
{
    const request = query;

    if (request == '') {
        return;
    }
    return fetch(`${BASE_URL}/${options}`)
    .then((response) => {
        return response.json()})
    .then((response) =>
    {        
        console.log('response: ', response);

        return response;
    })
    .catch((error) => {return error})
    .catch((TypeError) => {return TypeError})
}