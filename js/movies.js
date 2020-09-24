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
    $movieCard.find(".card-body").html(`${obj.Title}<button id = "edit">Edit</button><button id ="delete">Delete</button>`);
    $movieCard.find("#delete").click(function (){
        let id = $movieCard.attr("id")
        $("#" + id).remove()
        deleteItem(id.replace("movie", ""))
    })
    return $movieCard;
}

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