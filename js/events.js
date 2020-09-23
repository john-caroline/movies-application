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
            console.log(data);
            let arr = data.Search;
            for (let obj of arr) {
                $("#searchResults").prepend($(document.createElement("div")).text(obj.Title));
            }
            let totalPages = Math.ceil(parseInt(data.totalResults) / 10);
            console.log(totalPages);
            let searchPage = $("#searchPage");
            searchPage.html(`<li class="page-item">
                <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
                </a>
                </li>`)
            let i = 1;
            while (i <= 10 && i <= totalPages) {
                searchPage.append(`<li class="page-item"><a class="page-link pageNumber" href="#">${i}</a></li>`);
                i++;
            }
            searchPage.append(`<li class="page-item">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
            </li>`)
            searchPage.find("li:nth-of-type(2)").addClass("active");
            $(".pageNumber").click(function(e) {
                e.preventDefault();
                let searchStr = $("#addSearch").val();
                $(".active").removeClass("active");
                let page = $(this).text();
                $(this).parent().addClass("active");
                console.log($(this).text());
                fetch(`https://omdbapi.com/?apikey=${omdbToken}&s=${searchStr}&type=movie&page=${page}`)
                    .then(response => response.json())
                    .then(data => {
                        let arr = data.Search;
                        $("#searchResults").empty();
                        for (let obj of arr) {
                            $("#searchResults").append($(document.createElement("div")).text(obj.Title));
                        }
                    })
            })
        });
});

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