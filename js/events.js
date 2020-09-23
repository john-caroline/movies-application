$("#addMovie").submit(event => {
    event.preventDefault();

    const movieObj = {
        title: $("#titleInput").val(),
        rating: $("#ratingInput").val(),
    };

    modifyData("POST", baseURL, movieObj);
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