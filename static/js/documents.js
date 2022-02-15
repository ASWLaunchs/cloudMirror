const Documents = {
    func: {
        query: function () {
            $.get("/documents").done(function (data) {
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
                <div class="col-sm-6 col-md-5 col-lg-6">
                    <div id="searchResult">
                       ` + document + `
                    <div>
                <div>`
                $('#container').html(content)
            })
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
                    文件大小: ${filesize}
                </div>`
                $("#fileDetail").html(fileDetail)
            })
        }
    }
}