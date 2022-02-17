const Documents = {
    data: {
        buttonGroup: null,
        page: 1,
        pageCount: 1,
        keyWord: '',
    },
    func: {
        query: function (page, keyWord) {
            start_time = new Date().getTime()
            Documents.data.page = page
            Documents.data.keyWord = keyWord
            Documents.func.pagination()
            window.history.replaceState({
                id: null,
                name: null
            }, 'x', '?category=documents&page=1&keyWord=' + keyWord);
            $.get("/documents", {
                page: page,
                keyWord: keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                let document = ''
                data.forEach(v => {
                    document += `
                    <div class="item item-type-doc">
                        <div class="item-head-doc">
                            <img class="item-type-icon" src="/static/assets/images/doc.svg" alt="" srcset="">
                            <span class="item-doc-title">` + v.filename + `</span>
                        </div>
                        <div class="item-brief-doc">
                            ` + v.tag + `
                        </div>
                        <div class="item-tail">
                            <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                data-target=".bd-CloudMirror-modal-lg" onclick="Documents.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                            <button type="button" class="btn btn-link btn-sm">下载</button>
                        </div>
                    </div>`
                });
                let content = `
                <div id="result-stats">找到约 ${Documents.data.pageCount} 条结果<nobr> （用时 0.${(new Date().getTime() - start_time)} 秒）&nbsp;</nobr></div>
                <div class="row">   
                    <div class="col-sm-6 col-md-5 col-lg-6">
                            <div id="searchResult">
                            ` + document + `
                            <div>
                    <div>
                    <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0"></div>
                </div>
                ${Documents.data.buttonGroup}`
                $('#container').html(content)
            })
        },
        pagination: function () {
            var buttonGroup = null
            $.get("/pageCount", {
                category: "documents",
                keyWord: Documents.data.keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                Documents.data.pageCount = data
                let pageNum = Math.ceil(data / 10)
                let button = ''
                if (pageNum == 1) {
                    Documents.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            <button type="button" class="btn btn-light" >1</button>
                        </div>
                    </div>`
                } else if (Documents.data.page + 5 > pageNum) {
                    for (let i = 0; i <= pageNum - Documents.data.page; i++) {
                        button += `<button type="button" class="btn btn-light" >${Documents.data.page + i}</button>`
                    }
                    Documents.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            ${button}
                        </div>
                    </div>`
                } else {
                    for (let i = 0; i <= 4; i++) {
                        button += `<button type="button" class="btn btn-light" >${Documents.data.page + i}</button>`
                    }
                    Documents.data.buttonGroup = `
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
        download: function (event, href, title) {
            event.preventDefault()
            const a = document.createElement('a');
            a.setAttribute('href', href);
            a.setAttribute('download', title);
            a.click();
        },
        preview: function (fid, tag, filename, pathname, createdTime, filesize) {
            $.get(pathname + '/' + filename).done(function (data) {
                let fileDetail = `
                <div class='container'>
                    <b class='title'>${filename}</b>
                    <br/>
                    ${data}
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
        }
    }
}