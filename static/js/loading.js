document.onreadystatechange = function () {
    if (document.readyState != "complete") {
        $("#loadingView").fadeIn();
    } else {
        console.log("The CM was Loaded!")
        $("#loadingView").fadeOut("slow");
    }
}