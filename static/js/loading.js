document.onreadystatechange = function () {
    if (document.readyState != "complete") {
        $("#loadingView").fadeIn();
    } else {
        console.log("加载完成")
        $("#loadingView").fadeOut("slow");
    }
}