//TODO: single-page application
// loading animation
// edit listings
// delete movies
// disable while promise is fulfilling
// modals for forms
// add a genre property
// allow users to sort
// allow users to filter/search
// use OMDB


loadHTML();

$("#addMovie").submit(event => {
    event.preventDefault();

    let title = $("#titleInput").val();
    let rating = $("#ratingInput").val();

    const movieObj = {
        title: title,
        rating: rating,
    };
    const url = 'https://platinum-satisfying-caption.glitch.me/movies';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObj),
    };
    fetch(url, options)
        .then(response => console.log(response))
        .then(() => loadHTML())
        .catch(error => console.error(error));
});

function loadHTML() {
    let $load = $("#load");

    $("#movieTable").children().empty();

    $load.append("Loading...");

    fetch("https://platinum-satisfying-caption.glitch.me/movies")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            generateHTML(data);
        })
        .then($load.addClass("d-none"));
}


function generateHTML(data) {

    let $titles = $("#titles");
    let $ratings = $("#ratings");
    let $deletions = $("#delete");

    for (let obj of data) {
        let $title = $(document.createElement("div")).append(obj.title);
        let $rating = $(document.createElement("div")).append(obj.rating);
        let $delete = $(document.createElement("div"))
            .append("delete")
            .click(function() {
                deleteItem(data, obj.id);
            })

        $titles.append($title);
        $ratings.append($rating);
        $deletions.append($delete);

    }
    $("#movieTable").append($titles).append($ratings).append($deletions);
}
function deleteItem(data, id) {
    for (let obj of data) {
        if (obj.id === id) {
            //delete
        }
    }
}

// fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=summer`)
//     .then(response => response.json())
//     .then(data => console.log(data));