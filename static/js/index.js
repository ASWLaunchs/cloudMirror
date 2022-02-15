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
        },
        query: function (page, keyWord) {
            start_time = new Date().getTime()
            window.history.replaceState({
                id: null,
                name: null
            }, '下载', '?page=1&keyWord=' + keyWord);
            $("#searchingPage").fadeOut()
            Images.data.page = page
            Images.data.keyWord = keyWord
            Images.func.pagination()
            $.get("/images", {
                page: page,
                keyWord: keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                let image = ''
                data.forEach(v => {
                    image += `
                    <!--Image CONTENT -->
                    <div class="item item-type-image">
                        <div class="item-head-image"><img class="item-type-icon" src="/static/assets/images/image.svg"
                                alt="" srcset=""><span class="item-image-title">${v.filename}</span></div>
                        <div class="item-brief-doc">
                            <img src="${v.pathname}/${v.filename}" height="100" />
                        </div>
                        <div class="item-tail">
                            <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                data-target=".bd-CloudMirror-modal-lg" onclick="Images.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                            <button type="button" class="btn btn-link btn-sm" onclick="Images.func.download(event,'${v.pathname}/${v.filename}','${v.filename}')">下载</button>
                        </div>
                    </div>`
                });
                let content = `
                <div id="result-stats">找到约 ${Images.data.pageCount} 条结果<nobr> （用时 0.${(new Date().getTime() - start_time)} 秒）&nbsp;</nobr></div>
                <div class="row">
                    <div class="col-sm-6 col-md-5 col-lg-6">
                        <div id="searchResult">
                        ` + image + `
                        <div>
                    <div>
                    <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0"></div>
                </div>
                ${Images.data.buttonGroup}
                `
                $('#container').html(content)
            })
        }
    }
}