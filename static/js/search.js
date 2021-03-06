const search = {
    func: {
        //θ·εεΎε
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
        //getDoc() η¨δΊθ·εζζ‘£εε?Ή
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
                    <p>εΊεID:${bid}</p>
                    <p>ζδ»ΆID:${fid}</p>
                    <p>εε»ΊζΆι΄:${created_time}</p>
                </div>`
                }
            })
            return content
        },
        //getImage() η¨δΊθ·εεΎεεε?Ή
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
                    <p>εΊεID:${bid}</p>
                    <p>ζδ»ΆID:${fid}</p>
                    <p>εε»ΊζΆι΄:${created_time}</p>
                </div>`
                }
            })
            return content
        }
    }
}