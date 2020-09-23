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
    $movieCard.find(".movieRating").html(`<i class="far fa-meh-rolling-eyes rating1"></i>
    <i class="far fa-frown rating2"></i>
    <i class="far fa-meh rating3"></i>
    <i class="far fa-smile rating4"></i>`);
    $movieCard.find("i").hover(function (){
        $(this).removeClass("far").addClass("fas")
    },
        function (){
        let rating = "rating" + obj.rating
            if (!$(this).hasClass(rating)){
            $(this).removeClass("fas").addClass("far")
            }
        }).click(function (e){
        e.stopPropagation();
        console.log($(this).attr("class"))
        let classes = $(this).attr("class")
        let rating = classes[classes.indexOf("rating") + 6]
        let movieObj = {rating:parseInt(rating)}
        const url = `${baseURL + obj.id}`;
        modifyData("PATCH", url, movieObj)
    })
    $movieCard.find(".rating" + obj.rating).removeClass("far").addClass("fas")
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