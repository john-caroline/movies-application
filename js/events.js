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

    fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=${searchStr}&type=movie&page=1`)
        .then(response => response.json())
        .then(data => {

            populateSearchResults(data);

            let totalPages = Math.ceil(parseInt(data.totalResults) / 10);
            populatePageNav(totalPages);

            $("#previous").click(function (e) {
                e.preventDefault();
                previousPage();
            })

            $(".pageNumber").click(function (e) {
                e.preventDefault();
                turnPageTo($(this));
            })
        });
});

function populateSearchResults(data) {
    let arr = data.Search;
    let $results = $("#searchResults");
    $results.empty();

    for (let obj of arr) {
        $results.append($(document.createElement("div")).text(obj.Title));
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
    searchPage.append(`<li class="page-item">
                <a class="page-link" id="next" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
            </li>`);
    searchPage.find("li:nth-of-type(2)").addClass("active");
}

function previousPage() {
    let $active = $(".active");
    let currentPage = $active.text();
    let page = parseInt(currentPage) - 1;

    if (page > 0) {
        let searchStr = $("#addSearch").val();
        let $prev = $active.prev();

        $active.removeClass("active");
        $prev.addClass("active");

        getData(searchStr, page);
    }
}

function turnPageTo($pageClicked) {
    let page = $pageClicked.text();
    let searchStr = $("#addSearch").val();
    $(".active").removeClass("active");

    $pageClicked.parent().addClass("active");

    getData(searchStr, page)
}

function getData(searchStr, page = 1) {
    fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=${searchStr}&type=movie&page=${page}`)
        .then(response => response.json())
        .then(data => {
            populateSearchResults(data);
        });
}

`<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
    </a>
</li>
<li class="page-item active"><a class="page-link" href="#">1</a></li>
<li class="page-item"><a class="page-link" href="#">2</a></li>
<li class="page-item"><a class="page-link" href="#">3</a></li>
<li class="page-item">
    <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only">Next</span>
    </a>
</li>`