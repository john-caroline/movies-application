//TODO: single-page application
// loading animation
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
        let $title = $(document.createElement("div")).append(obj.title)
            .click(function (){
                $("#titleEdit").val(obj.title);
                $("#ratingEdit").val(obj.rating)
                $("#submitEdit").attr("currentEdit", obj.id)
            });

        let $rating = $(document.createElement("div")).append(obj.rating);
        let $delete = $(document.createElement("div"))
            .append("delete")
            .click(function () {
                deleteItem(obj.id);
            })

        $titles.append($title);
        $ratings.append($rating);
        $deletions.append($delete);

    }
    $("#movieTable").append($titles).append($ratings).append($deletions);
}
$("#editMovie").submit(event => {
    event.preventDefault();

    let title = $("#titleEdit").val();
    let rating = $("#ratingEdit").val();

    const movieObj = {
        title: title,
        rating: rating,
    };
    const url = 'https://platinum-satisfying-caption.glitch.me/movies/' + $("#submitEdit").attr("currentEdit");
    const options = {
        method: 'PUT',
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


function deleteItem(id) {
    const url = "https://platinum-satisfying-caption.glitch.me/movies/" + id;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }
    fetch(url, options)
        .then(response => console.log(response))
        .then(()=>loadHTML())
        .catch (error => console.error(error));
}

// fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=summer`)
//     .then(response => response.json())
//     .then(data => console.log(data));