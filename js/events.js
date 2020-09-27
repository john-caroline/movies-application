let searchCache = new Array(10).fill(0);
let movieCache = {};

$("#saveTitle").click(function() {
    let title = $("#newMovieTitle").val();
    const movieObj = {
        Title: title,
        rating: 0,
        review: "",
    }
    const properties = ["Plot", "Actors", "Genre", "Director", "Writer", "Rated",
        "Runtime", "Released", "Poster"];
    for (let prop of properties) {
        movieObj[prop] = "(empty)";
    }

    $("#saveModal").modal("toggle");
    movieCache[title] = movieObj;
    modifyData("POST", baseURL, movieObj)
        .then(() => {
            $("#movieTable").append(createMovieCard(movieCache[title]));
        });
});

//submission of user input to search for a movie via title
$("#searchMovie").submit(function (e) {
    e.preventDefault();
    let searchStr = $("#addSearch").val();
    searchCache = new Array(10).fill(0);

    $("#pages").removeClass("d-none");

    fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=${searchStr}&type=movie&page=1`)
        .then(response => response.json())
        .then(data => {
            searchCache[0] = data;
            populateSearchResults(data);

            let totalPages = Math.ceil(parseInt(data.totalResults) / 10);
            populatePageNav(totalPages);

            $("#previous").click(function (e) {
                e.preventDefault();
                previousPage();
            });

            $("#next").click(function (e) {
                e.preventDefault();
                nextPage();
            });

            $(".pageNumber").click(function (e) {
                e.preventDefault();
                turnPageTo($(this).parent());
            });
        });
});

//receives current page of data and fills the searchResults div
function populateSearchResults(data) {
    let arr = data.Search;
    let $results = $("#searchResults");
    $results.empty();

    $("#searchPlaceholder").addClass("d-none");

    for (let obj of arr) {
        $results.append(
            $(document.createElement("li"))
                .html(`<span class="titleOnly">${obj.Title}</span>&nbsp;(${obj.Year})`));
    }
    $results.find("li").hover(
        function () {
            $(this).addClass("titleHover");
        },
        function () {
            $(this).removeClass("titleHover");
        }).click(
        function () {
            let title = $(this).find(".titleOnly").text();
            $("#dataPlaceholder").addClass("d-none");

            populateData(title);
        });
}

function populateData(title, div="#dataDiv") {
    if (!movieCache[title]) {
        fetch(`https://omdbapi.com/?apikey=${omdbToken}&t=${title}`)
            .then(response => response.json())
            .then(data => {
                movieCache[title] = data;
                fillData(data);
            });
    } else {
        fillData(movieCache[title], div);
    }
}

function fillData(data, div="#dataDiv") {
    const top = ["Released", "Genre", "Rated",
        "Runtime"];
    const bottom = ["Plot", "Actors", "Director",
        "Writer"];

    let $dataDiv = $(div);

    $dataDiv.empty();

    let $titleDiv = $(document.createElement("div")).addClass("text-center dataTitle");
    $titleDiv.text(data.Title).attr("id", "movieTitle");

    let $topHalf = $(document.createElement("div"));
    $topHalf.addClass("row");

    if (data.Poster.includes("http")) {
        let $posterDiv = $(document.createElement("div"));
        let $img = $(document.createElement("img"));
        $img.attr("src", data.Poster);
        $img.attr("height", "240px");
        $posterDiv.addClass("col-6 text-center").append($img);
        $topHalf.append($posterDiv);
    }

    let $detailsDiv = $(document.createElement("div")).addClass("col-6");

    for (let property of top) {
        if (data[property]) {
            let $element = $(document.createElement("div"));
            $element.html(`<span class="prop">${property}:</span><br>${data[property]}`);
            $detailsDiv.append($element);
        }
    }
    $topHalf.append($detailsDiv);
    $dataDiv.append($titleDiv, $topHalf);

    for (let property of bottom) {
        if (data[property]) {
            let $element = $(document.createElement("div"));
            $element.html(`<span class="prop">${property}:</span><br>${data[property]}`);
            $dataDiv.append($element);
        }
    }
}

$("#addToList").click(function (){
    let title = $("#movieTitle").text();

    movieCache[title].review = "";
    movieCache[title].rating = 0;

    let data = movieCache[title];

    $("#addMovieModal").modal("toggle");
    modifyData("POST", baseURL, data)
        .then(() => {
            data = movieCache[title];
            $("#movieTable").append(createMovieCard(data))
        });
})

function populatePageNav(totalPages) {
    let searchPage = $("#searchPage");

    searchPage.html(
        `<li class="page-item">
            <a class="page-link" id="previous" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`);

    let i = 1;
    while (i <= 10 && i <= totalPages) {
        searchPage.append(`<li class="page-item"><a class="page-link pageNumber" href="#">${i}</a></li>`);
        i++;
    }
    searchPage.append(
        `<li class="page-item">
            <a class="page-link" id="next" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`);
    searchPage.find("li:nth-of-type(2)").addClass("active");
}

function previousPage() {
    const $active = $(".active");
    const currentPage = $active.text();
    const page = (parseInt(currentPage) - 1);

    if (page >= 1) {
        turnPageTo($active.prev());
    }
}

function nextPage() {
    const $active = $(".active");
    const currentPage = $active.text();
    const page = parseInt(currentPage) + 1;

    if (page <= 10) {
        turnPageTo($active.next());
    }
}

function turnPageTo($pageClicked) {
    const page = $pageClicked.text();
    const searchStr = $("#addSearch").val();

    $(".active").removeClass("active");
    $pageClicked.addClass("active");

    getData(searchStr, page);
}

function getData(searchStr, page = 1) {
    if (searchCache[page - 1] === 0) {
        fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=${searchStr}&type=movie&page=${page}`)
            .then(response => response.json())
            .then(data => {
                searchCache[page - 1] = data;
                populateSearchResults(data);
            });
    } else {
        populateSearchResults(searchCache[page - 1]);
    }
}

$("#titleSearch").on("input", filterTable);

$("#genreSearch").on("input", filterTable);

$("#checkboxes .form-check-input").change(filterTable);

function filterTable() {
    let title = $("#titleSearch").val();
    let genre = $("#genreSearch").val()
    let ratings = [];

    for (let i = 1; i <= 4; i++) {
        ratings.push($(`#inlineCheckbox${i}`).prop("checked"));
    }

    for (let child of $("#movieTable").children()) {
        let t = $(child).find(".movieTitle").text();
        let genres = movieCache[t].Genre;
        let rating = movieCache[t].rating;
        let hasGenre = genres.toLowerCase().includes(genre.toLowerCase().trim());
        let hasPartialTitle = t.toLowerCase().includes(title.trim().toLowerCase());

        // if (!hasPartialTitle || !hasGenre || !ratings[rating - 1]) {
        //
        // } else {
        //
        // }

        if (hasPartialTitle && hasGenre && (rating === 0 || ratings[rating - 1])) {
            $(child).show();
        } else {
            $(child).hide();
        }
    }
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

    $("#editMovieModal").modal('toggle');
});