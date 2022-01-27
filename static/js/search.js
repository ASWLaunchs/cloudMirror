const search = {
    func: {
        //获取图像
        getImgData: function () {
            $.get("/CloudMirror", function (data) {
                if (data.status) {
                    let content = ''
                    data.msg.forEach(function (value) {
                        content += `<div 
                    class='item' 
                    data-toggle=\"modal\"
                    data-target=\".bd-CloudMirror-modal-lg\"
                    onclick=\"func.fileDetail(event,'${value.bid}','${value.fid}','${fileType}','${value.created_time}')\">
                    <img src=\'" + value.url + "\' />
                    </div>`
                    })
                    // append new items
                    $("#container").append(content);
                }
            }).done(function () {
                // arrange appended items
                $("#container").rowGrid("appended");
            })
        },
        //fileDetail() support file detail that display on modal content.
        fileDetail: function (e, bid, fid, fileType, created_time) {
            let content = null
            switch (fileType) {
                case "doc":
                    content = func.getDoc(e, bid, fid, fileType, created_time)
                    break;
                case "audio":
                    content = func.getAudio(e, bid, fid, fileType, created_time)
                    break;
                case "image":
                    content = func.getImage(e, bid, fid, fileType, created_time)
                    break;
                case "video":
                    content = func.getVideo(e, bid, fid, fileType, created_time)
                    break;
                default:
                    break;
            }
            $("#fileDetail").html(content)
        },
        //getQueryVariable() gets url params based on the url string.
        //if can't get nothing , then return false.
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
        //getAll() gets any type file about search key.
        //all files info.
        getAll: function (isAuto = true, keyWord = '') {
            //isAuto equal true , then system will automaticlly search something based on url's keyword.
            if (isAuto) {
                let keyWord = this.getQueryVariable("w")
                $("#searchResult").html(keyWord)
            } else {
                $.get("/search", {
                    "w": keyWord
                },function(){
                    $("#searchResult").html(' ')
                    console.log(keyWord)
                }).done(function (data) {
                    $("#searchResult").html(' ')
                    console.log(data)
                })
                console.log(keyWord)
            }
        },
        //getDoc() 用于获取文档内容
        getDoc(fid) {
            $.get("/getDoc", {
                "w": keyWord
            }).done(function (data) {
                if (data.status) {
                    let content = `
                <div class="previewContent">
                    Nothing
                </div>
                <hr>
                <div class="text-light bg-dark">
                    <p>URL:${e.target.src}</p>
                    <p>区块ID:${bid}</p>
                    <p>文件ID:${fid}</p>
                    <p>创建时间:${created_time}</p>
                </div>`
                }
            })
            return content
        },
        //getImage() 用于获取图像内容
        getImage(fid) {
            $.get("/getImage", {
                "w": keyWord
            }).done(function (data) {
                if (data.status) {
                    let content = `
                <img src="${e.target.src}" alt="">
                <hr>
                <div class="text-light bg-dark">
                    <p>URL:${e.target.src}</p>
                    <p>区块ID:${bid}</p>
                    <p>文件ID:${fid}</p>
                    <p>创建时间:${created_time}</p>
                </div>`
                }
            })
            return content
        }
    }
}