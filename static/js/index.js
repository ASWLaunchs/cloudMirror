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
    data: {
        buttonGroup: null,
        page: 1,
        pageCount: 1,
        keyWord: '',
    },
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
        query: function (category, page, keyWord) {
            if ($("#searchValue").val().trim().length > 0) {
                keyWord = $("#searchValue").val()
            }
            //category choice.
            if (category == "documents") {
                Documents.func.query(page, keyWord)
            } else if (category == "images") {
                Images.func.query(page, keyWord)
            } else if (category == "audios") {
                Audios.func.query(1, keyWord)
            } else if (category == "videos") {
                Videos.func.query(1, keyWord)
            } else if (category == "default") {
                start_time = new Date().getTime()
                window.history.replaceState({
                    id: null,
                    name: null
                }, 'x', '?category=default&page=1&keyWord=' + keyWord);
                $("#searchingPage").fadeOut()
                $("#searchValue").val(keyWord)
                CM.data.page = page
                CM.data.keyWord = keyWord
                CM.func.pagination()
                $.get("/search", {
                    page: page,
                    keyWord: keyWord,
                }).done(function (data) {
                    var data = JSON.parse(data)
                    CM.func.pagination()
                    let searchResult = ''
                    data.forEach(v => {
                        if (v.category == "documents") {
                            searchResult += `
                            <div class="item item-type-doc">
                                <div class="item-head-doc">
                                    <img class="item-type-icon" src="/static/assets/images/doc.svg" alt="" srcset="">
                                    <span class="item-doc-title">${v.filename}</span>
                                </div>
                                <div class="item-brief-doc">
                                    ${v.tag}
                                </div>
                                <div class="item-tail">
                                    <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                        data-target=".bd-CloudMirror-modal-lg" onclick="Documents.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                                    <button type="button" class="btn btn-link btn-sm">下载</button>
                                </div>
                            </div>`
                        } else if (v.category == "images") {
                            searchResult += `
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
                        } else if (v.category == "audios") {
                            searchResult += `
                            <!-- Music CONTENT -->
                            <div class="item item-type-audio">
                                <div class="item-head-audio"><img class="item-type-icon" src="/static/assets/images/audio.svg"
                                        alt="" srcset=""><span class="item-audio-title">${v.filename}</span></div>
                                <div class="item-brief-audio">
                                    <audio controls src="${v.pathname}/${v.filename}">
                                        Your browser does not support the
                                        <code>audio</code> element.
                                    </audio>
                                </div>
                                <div class="item-tail">
                                    <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                        data-target=".bd-CloudMirror-modal-lg" onclick="Audios.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                                    <button type="button" class="btn btn-link btn-sm" onclick="Audios.func.download(event,'${v.pathname}/${v.filename}','${v.filename}')">下载</button>
                                </div>
                            </div>`
                        } else if (v.category == "videos") {
                            searchResult += `
                            <div class="item item-type-video" data-toggle="modal" data-target=".bd-CloudMirror-modal-lg">
                                <div class="item-head-image"><img class="item-type-icon" src="/static/assets/images/video.svg"
                                        alt="" srcset=""><span class="item-image-title">${v.filename}</span></div>
                                <div class="item-brief-doc">
                                    <img src="/static/assets/hls/${v.fid}/poster.jpg" height="200" />
                                </div>
                                <div class="item-tail">
                                    <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                        data-target=".bd-CloudMirror-modal-lg" onclick="Videos.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                                    <button type="button" class="btn btn-link btn-sm" onclick="Videos.func.download(event,'${v.pathname}/${v.filename}','${v.filename}')">下载</button>
                                </div>
                            </div>`
                        }
                    });
                    let content = `
                    <div id="result-stats">找到约 ${CM.data.pageCount} 条结果<nobr> （用时 0.${(new Date().getTime() - start_time)} 秒）&nbsp;</nobr></div>
                    <div class="row">
                        <div class="col-sm-6 col-md-5 col-lg-6">
                            <div id="searchResult">
                            ` + searchResult + `
                            <div>
                        <div>
                        <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0"></div>
                    </div>
                    ${CM.data.buttonGroup}
                    `
                    $('#container').html(content)
                })
            } else {
                console.log(category)
                $('#container').html(`param error`)
            }
            return false
        },
        pagination: function () {
            $.get("/pageCount", {
                category: "default",
                keyWord: CM.data.keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                CM.data.pageCount = data
                let pageNum = Math.ceil(data / 10)
                let button = ''
                if (pageNum == 1) {
                    CM.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            <button type="button" class="btn btn-light" >1</button>
                        </div>
                    </div>`
                } else if (CM.data.page + 5 > pageNum) {
                    for (let i = 0; i <= pageNum - CM.data.page; i++) {
                        button += `<button type="button" class="btn btn-light" >${CM.data.page + i}</button>`
                    }
                    CM.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            ${button}
                        </div>
                    </div>`
                } else {
                    for (let i = 0; i <= 4; i++) {
                        button += `<button type="button" class="btn btn-light" >${CM.data.page + i}</button>`
                    }
                    CM.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            ${button}
                        </div>
                        <div class="btn-group" role="group" aria-label="Second group">
                            <button type="button" class="btn btn-light">下一页</button>
                        </div>
                    </div>`
                }
            })
        },
    }
}