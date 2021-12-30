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
    func.getImgData()
})

var func = {
    //获取图像
    getImgData: function () {
        $.get("/CloudMirror", function (data) {
            if (data.status) {
                let content = ''
                data.msg.forEach(function (value) {
                    content += "<div class='item' data-toggle=\"modal\" data-target=\".bd-CloudMirror-modal-lg\" onclick=\"func.imgDetail(event,'" + value.adding_time + "','" + value.did + "')\"><img src=\'" + value.url + "\' /></div>"
                })
                // append new items
                $("#container").append(content);
            }
        }).done(function () {
            // arrange appended items
            $("#container").rowGrid("appended");
        })
    },
    //图像详情
    imgDetail: function (e, adding_time, did) {
        $("#imgDetail").find("img").eq(0).attr("src", e.target.src)
        $("#imgDetail").find("div").eq(0).html(
            `<p>URL:${e.target.src}</p><p>所属区块:${did}</p><p>添加时间:${adding_time}</p>`
        )
    }
}