const Images = {
    data: {
        buttonGroup: null,
        page: 1,
        pageCount: 1,
        keyWord: '',
    },
    func: {
        query: function (page, keyWord) {
            start_time = new Date().getTime()
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
        },
        pagination: function () {
            var buttonGroup = null
            $.get("/pageCount", {
                category: "images",
                keyWord: Images.data.keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                Images.data.pageCount = data
                let pageNum = Math.ceil(data / 10)
                let button = ''
                if (pageNum == 1) {
                    Images.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            <button type="button" class="btn btn-light" >1</button>
                        </div>
                    </div>`
                } else if (Images.data.page + 5 > pageNum) {
                    for (let i = 0; i <= pageNum - Images.data.page; i++) {
                        button += `<button type="button" class="btn btn-light" >${Images.data.page + i}</button>`
                    }
                    Images.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            ${button}
                        </div>
                    </div>`
                } else {
                    for (let i = 0; i <= 4; i++) {
                        button += `<button type="button" class="btn btn-light" >${Images.data.page + i}</button>`
                    }
                    Images.data.buttonGroup = `
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
        preview: function (fid, tag, filename, pathname, createdTime, filesize) {
            $.get(pathname + '/' + filename).done(function (data) {
                let fileDetail = `
                <div class='container'>
                    <b class='title'>${filename}</b>
                    <br/>
                    <img src="${pathname}/${filename}" style="min-width:40%;max-width:100%" />
                </div>
                <div class="fileInfo text-light bg-dark">
                    文件ID：${fid}
                    <br>
                    创建时间: ${createdTime}
                    <br>
                    文件大小: ${filesize}B
                </div>`
                $("#fileDetail").html(fileDetail)
            })
        },
        download: function (event, href, title) {
            event.preventDefault()
            const a = document.createElement('a');
            a.setAttribute('href', href);
            a.setAttribute('download', title);
            a.click();
        }
    }
}