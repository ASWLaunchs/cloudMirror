const Audios = {
    data: {
        buttonGroup: null,
        page: 1,
        pageCount: 1,
        keyWord: '',
    },
    func: {
        query: function (page, keyWord) {
            start_time = new Date().getTime()
            Audios.data.page = page
            Audios.data.keyWord = keyWord
            Audios.func.pagination()
            window.history.replaceState({
                id: null,
                name: null
            }, 'x', '?category=audios&page=1&keyWord=' + keyWord);
            $.get("/audios", {
                page: page,
                keyWord: keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                let audio = ''
                data.forEach(v => {
                    audio += `
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
                });
                let content = `
                <div id="result-stats">找到约 ${Audios.data.pageCount} 条结果<nobr> （用时 0.${(new Date().getTime() - start_time)} 秒）&nbsp;</nobr></div>
                <div class="row">
                    <div class="col-sm-6 col-md-5 col-lg-6">
                        <div id="searchResult">
                        ` + audio + `
                        <div>
                    <div>
                    <div class="col-sm-6 col-md-5 offset-md-2 col-lg-6 offset-lg-0"></div>
                </div>
                ${Audios.data.buttonGroup}
                `
                $('#container').html(content)
            })
        },
        pagination: function () {
            $.get("/pageCount", {
                category: "audios",
                keyWord: Audios.data.keyWord,
            }).done(function (data) {
                var data = JSON.parse(data)
                Audios.data.pageCount = data
                let pageNum = Math.ceil(data / 10)
                let button = ''
                if (pageNum == 1) {
                    Audios.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            <button type="button" class="btn btn-light" >1</button>
                        </div>
                    </div>`
                } else if (Audios.data.page + 5 > pageNum) {
                    for (let i = 0; i <= pageNum - Audios.data.page; i++) {
                        button += `<button type="button" class="btn btn-light" >${Audios.data.page + i}</button>`
                    }
                    Audios.data.buttonGroup = `
                    <!-- button group -->
                    <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                        <div class="btn-group mr-2" role="group" aria-label="First group">
                            ${button}
                        </div>
                    </div>`
                } else {
                    for (let i = 0; i <= 4; i++) {
                        button += `<button type="button" class="btn btn-light" >${Audios.data.page + i}</button>`
                    }
                    Audios.data.buttonGroup = `
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
        }
    }
}