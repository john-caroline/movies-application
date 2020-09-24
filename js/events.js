let searchCache = new Array(10).fill(0);
let movieCache = {};

$("#addMovie").submit(event => {
    event.preventDefault();

    const movieObj = {
        title: $("#titleInput").val(),
        rating: $("#ratingInput").val(),
    };

    modifyData("POST", baseURL, movieObj);

    $("#addMovie").addClass("d-none")
});

$("#editMovie").submit(event => {
    event.preventDefault();

    const movieObj = {
        title: $("#titleEdit").val(),
        rating: $("#ratingEdit").val(),
    };
    const url = `${baseURL + $("#submitEdit").attr("currentEdit")}`;

    modifyData("PUT", url, movieObj);

});

$("#addBtn").click(function (e) {
    // $("#addMovie").removeClass("d-none")
    $("#searchMovie").removeClass("d-none");
    $("#pages").removeClass("d-none");

})

$("#searchMovie").submit(function (e) {
    e.preventDefault();
    let searchStr = $("#addSearch").val();
    searchCache = new Array(10).fill(0);

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

function populateSearchResults(data) {
    let arr = data.Search;
    let $results = $("#searchResults");
    $results.empty();

    $("#searchPlaceholder").addClass("d-none");

    for (let obj of arr) {
        $results.append($(document.createElement("li")).text(obj.Title));
    }
    $results.find("li").hover(
        function () {
            $(this).addClass("titleHover");
        },
        function () {
            $(this).removeClass("titleHover");
        }).click(
        function () {
            let title = $(this).text();
            $("#dataPlaceholder").addClass("d-none");

            populateData(title);
        });
}

function populateData(title) {
    if (!movieCache[title]) {
        fetch(`https://omdbapi.com/?apikey=${omdbToken}&t=${title}`)
            .then(response => response.json())
            .then(data => {
                movieCache[title] = data;
            });
    }
}

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