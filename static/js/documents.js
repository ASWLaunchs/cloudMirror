const documents = {
    func: {
        query: function () {
            $.get("/documents").done(function (data) {
                console.log(data)
                var data = JSON.parse(data)
                var document = ''
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
                                data-target=".bd-CloudMirror-modal-lg">预览</button>
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
        }
    }
}