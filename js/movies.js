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
            for (let obj of data) {
                movieCache[obj.Title] = obj;
            }
            generateHTML(data);
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

        let rating;

        if ($(this).hasClass("currentRating")) {
            $(this).removeClass("currentRating");
            rating = 0;
        } else {
            const classes = $(this).attr("class");
            rating = classes[classes.indexOf("rating") + 6];
            $(this).siblings().removeClass("currentRating fas").addClass("far");
            $(this).addClass("currentRating");
        }

        const movieObj = {rating: parseInt(rating)};
        const url = `${baseURL + obj.id}`;

        movieCache[obj.Title].rating = parseInt(rating);

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
    $movieCard.find(".card-body").html(createCardBodyHTML(obj));

    if (obj.review === undefined) {
        obj.review = "";
    }

    $movieCard.find("#review").click(function(e) {
        $(`.review${obj.id}`).toggleClass("d-none");
        $(this).prop("disabled", true);
    });

    $movieCard.find("#reviewDiscard").click(function(){
        $movieCard.find("textarea").val(obj.review);
        $(`.review${obj.id}`).toggleClass("d-none");
        $movieCard.find("#review").prop("disabled", false);
    });

    $movieCard.find("#reviewSave").click(function() {
        const url = `${baseURL}${obj.id}`;
        const review = $movieCard.find("textarea").val();

        const movieObj = {
            review: review
        }

        movieCache[obj.Title].review = review;
        $movieCard.find("#reviewDiv").text(review);
        $(`.review${obj.id}`).toggleClass("d-none");
        $movieCard.find("#review").prop("disabled", false);

        modifyData("PATCH", url, movieObj);
    });

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

function createCardBodyHTML(obj) {

    let review = "#review" + obj.id;
    let html =
        `<div class="d-flex text-center">
            <div class="col-4">
                <button type="button" class="btn btn-link" id="review">${obj.review !== "" ? "Edit": "Add"} Review</button>
            </div>
            <div class="col-4">
                <button type="button" class="btn btn-link" id="edit" type="button" data-toggle="modal"
                    data-target="#editMovieModal">Edit Movie Details</a>
            </div>
            <div class="col-4">
                <button type="button" class="btn btn-link" id="delete">Delete</a>
            </div>
        </div>
        <div id="reviewDiv" class="w-100 review${obj.id}">${obj.review}</div>
        <textarea class="w-100 d-none review${obj.id}" style="height: 200px">${obj.review}</textarea>
        <div class="d-flex justify-content-end">
            <button id="reviewDiscard" class="d-none review${obj.id}">Discard</button>
            <button id="reviewSave" class="d-none review${obj.id}">Save</button>
        </div>`


    return html;
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

    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (method === "POST") {
                movieCache[data.Title].id = data.id;
            }
        })
        .catch(error => console.error(error));
}