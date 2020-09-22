//TODO: single-page application
// loading animation
// form for adding
// edit listings
// delete movies
// disable while promise is fulfilling
// modals for forms
// add a genre property
// allow users to sort
// allow users to filter/search
// use OMDB

let $load = $("#load");

$load.append("Loading...");

fetch("https://platinum-satisfying-caption.glitch.me/movies")
    .then(response => response.json())
    .then(data => generateHTML(data))
    .then($load.addClass("d-none"));

function generateHTML(data) {

    let $titles = $("#titles");
    let $ratings = $("#ratings");

    for (let obj of data) {
        let $title = $(document.createElement("div")).append(obj.title);
        let $rating = $(document.createElement("div")).append(obj.rating);

        $titles.append($title);
        $ratings.append($rating);

    }

    $("#movieTable").append($titles).append($ratings);

}

// fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=summer`)
//     .then(response => response.json())
//     .then(data => console.log(data));