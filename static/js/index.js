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

var func = {
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
    //文件详情
    fileDetail: function (e, bid, fid, fileType, created_time) {
        let content = null
        switch (fileType) {
            case "doc":
                content = func.getDoc(bid, fid, fileType, created_time)
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
    //getDoc() 用于获取文档内容
    getDoc(fid) {
        $.get("/getDoc", {
            "fid": fid
        }).done(function (data) {
            if (data.status) {
                let content = `
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
            "fid": fid
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