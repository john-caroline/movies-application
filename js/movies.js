//TODO: single-page application
// loading animation
// disable while promise is fulfilling
// modals for forms
// add a genre property
// allow users to sort
// allow users to filter/search
// use OMDB

const baseURL = "https://platinum-satisfying-caption.glitch.me/movies/";

loadHTML();

function loadHTML() {
    let $load = $("#load");

    $("#movieTable").empty();

    $load.removeClass("d-none");

    fetch(baseURL)
        .then(response => response.json())
        .then(data => generateHTML(data))
        .then(() => $load.addClass("d-none"));
}

function generateHTML(data) {
    for (let obj of data) {
        let $newCard = createMovieCard(obj);
        $("#movieTable").append($newCard);
    }
}

function createMovieCard(obj) {
    let $movieCard = $(document.createElement("div"))
        .addClass("card")
        .html($("#movieCardTemplate").html());

    $movieCard.find(".card-header").attr("id", `movie${obj.id}`);
    $movieCard.find(".movieTitle").text(obj.title);
    $movieCard.find(".movieRating").text(obj.rating);
    $movieCard.find(".headerBtn").attr({
        "data-target": `#collapse${obj.id}`,
        "aria-controls": `collapse${obj.id}`,
    });
    $movieCard.find(".cardBodyDiv").attr({
        "id": `collapse${obj.id}`,
        "aria-labelledby": `movie${obj.id}`,
    });
    $movieCard.find(".card-body").text(obj.title);
    return $movieCard;
}

function deleteItem(id) {
    const url = `${baseURL + id}`;

    modifyData("DELETE", url);

}

// fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=summer`)
//     .then(response => response.json())
//     .then(data => console.log(data));

function modifyData(method, url, obj) {

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    }

    if (obj) {
        options.body = JSON.stringify(obj);
    }

    fetch(url, options)
        .then(response => console.log(response))
        .then(loadHTML)
        .catch(error => console.error(error));
}