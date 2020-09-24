//TODO: single-page application
// loading animation
// disable while promise is fulfilling
// modals for forms
// add a genre property
// allow users to sort
// allow users to filter/search
// use OMDB

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

const baseURL = "https://platinum-satisfying-caption.glitch.me/movies/";

loadHTML();

function loadHTML() {
    let $load = $("#load");

    $("#movieTable").empty();

    $load.removeClass("d-none");

    fetch(baseURL)
        .then(response => response.json())
        .then(data => {
            generateHTML(data);
            for (let obj of data) {
                movieCache[obj.Title] = obj;
            }
        })
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
        .attr("id", `movie${obj.id}`)
        .html($("#movieCardTemplate").html());

    // $movieCard.find(".card-header").attr("id", `movie${obj.id}`);
    $movieCard.find(".movieTitle").text(obj.Title);
    $movieCard.find(".movieRating").html(
        `<i class="far fa-meh-rolling-eyes rating1"></i>
        <i class="far fa-frown rating2"></i>
        <i class="far fa-meh rating3"></i>
        <i class="far fa-smile rating4"></i>`);

    $movieCard.find("i").hover(
        function () {
            $(this).removeClass("far").addClass("fas");
        },
        function () {
            if (!$(this).hasClass("currentRating")) {
                $(this).removeClass("fas").addClass("far")
            }
        });

    $movieCard.find("i").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        const classes = $(this).attr("class");
        const rating = classes[classes.indexOf("rating") + 6];
        console.log(rating);
        $(this).siblings().removeClass("currentRating fas").addClass("far");
        $(this).addClass("currentRating");

        const movieObj = {rating: parseInt(rating)};
        const url = `${baseURL + obj.id}`;

        modifyData("PATCH", url, movieObj);
    });

    $movieCard.find(".rating" + obj.rating).removeClass("far").addClass("fas").addClass("currentRating");
    $movieCard.find(".headerBtn").attr({
        "data-target": `#collapse${obj.id}`,
        "aria-controls": `collapse${obj.id}`,
    });
    $movieCard.find(".cardBodyDiv").attr({
        "id": `collapse${obj.id}`,
        "aria-labelledby": `movie${obj.id}`,
    });
    $movieCard.find(".card-body").html(
        `${obj.Title}
        <button id="edit" type="button" class="btn btn-primary" data-toggle="modal"
            data-target="#editMovieModal">Edit</button>
        <button id="delete">Delete</button>`);

    $movieCard.find("#edit").click(function() {
        const properties = ["Plot", "Actors", "Genre", "Director", "Writer", "Rated",
            "Runtime", "Released"];
        for (let property of properties) {
            $(`#${property.toLowerCase()}`).val(obj[property]);
        }
        $("#editTitle").text(obj.Title);
    });

    $movieCard.find("#edit").attr("movieID", obj.id);

    $movieCard.find("#delete").click(function () {
        let id = $movieCard.attr("id")
        $("#" + id).remove()
        deleteItem(id.replace("movie", ""))
    })
    return $movieCard;
}

$("#saveEdit").click(function() {
    const properties = ["Plot", "Actors", "Genre", "Director", "Writer", "Rated",
        "Runtime", "Released"];

    let id = $("#edit").attr("movieID");
    let $editForm = $("#editForm");
    let movieObj = {};

    let $oldElement = $(`#movie${id}`);

    for (let property of properties) {
        movieObj[property] = $editForm.find(`#${property.toLowerCase()}`).val();
    }
    movieObj.id = parseInt(id);
    movieObj.Title = $("#editTitle").text();

    let $newElement = createMovieCard(movieObj);
    const url = `${baseURL + id}`;
    $oldElement.replaceWith($newElement);
    modifyData("PATCH", url, movieObj);
});

function deleteItem(id) {
    const url = `${baseURL + id}`;

    modifyData("DELETE", url);

}

function modifyData(method, url, obj) {

    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    }

    if (obj) {
        options.body = JSON.stringify(obj);
    }

    fetch(url, options)
        .catch(error => console.error(error));
}