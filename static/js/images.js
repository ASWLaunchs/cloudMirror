const Images = {
    func: {
        query: function (page) {
            start_time = new Date().getTime()
            $.get("/images", {
                page: page
            }).done(function (data) {
                var data = JSON.parse(data)
                let pagination = Images.func.pagination()
                let image = ''
                data.forEach(v => {
                    image += `
                    <!--Image CONTENT -->
                    <div class="item item-type-image" data-toggle="modal" data-target=".bd-CloudMirror-modal-lg">
                        <div class="item-head-image"><img class="item-type-icon" src="/static/assets/images/image.svg"
                                alt="" srcset=""><span class="item-image-title">云镜Logo</span></div>
                        <div class="item-brief-doc">
                            <img src="${v.pathname}/${v.filename}" height="100" />
                        </div>
                        <div class="item-tail">
                            <button type="button" class="btn btn-link btn-sm" data-toggle="modal"
                                data-target=".bd-CloudMirror-modal-lg" onclick="Images.func.preview('${v.fid}','${v.tag}','${v.filename}','${v.pathname}','${v.created_time}',${v.filesize})">预览</button>
                            <button type="button" class="btn btn-link btn-sm">下载</button>
                        </div>
                    </div>`
                });
                let content = `
                <div id="result-stats">找到约 12,200,000 条结果<nobr> （用时 0.${(new Date().getTime() - start_time)} 秒）&nbsp;</nobr></div>
                <div class="row">
                    <div class="col-sm-6 col-md-5 col-lg-6">
                        <div id="searchResult">
                        ` + image + `
                        <div>
                    <div>
                    <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0"></div>
                </div>
                ${pagination}
                `
                $('#container').html(content)
            })
        },
        pagination: function () {
            let buttonGroup = ''
            $.get("/pageCount", {
                category: "images"
            }).done(function (data) {
                var data = JSON.parse(data)
                console.log(data)
                buttonGroup = `
                <!-- button group -->
                <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <div class="btn-group mr-2" role="group" aria-label="First group">
                        <button type="button" class="btn btn-light" >1</button>
                        <button type="button" class="btn btn-light" >2</button>
                        <button type="button" class="btn btn-light" >3</button>
                        <button type="button" class="btn btn-light" >`+ Math.ceil(data/10) + `</button>
                    </div>
                    <div class="btn-group" role="group" aria-label="Second group">
                        <button type="button" class="btn btn-light">下一页</button>
                    </div>
                </div>`
                console.log(buttonGroup)
                return buttonGroup
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
                    文件大小: ${filesize}
                </div>`
                $("#fileDetail").html(fileDetail)
            })
        }
    }
}