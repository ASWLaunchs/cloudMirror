$(function () {
    $("#container").rowGrid({
        itemSelector: ".item",
        minMargin: 10,
        maxMargin: 35,
        resize: true,
        lastRowClass: "last-row",
        firstItemClass: "first-item"
    });
    //获取图像
    // func.getImgData()
})

const CM = {
    func: {
        getQueryVariable: function (variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        }
    }
}