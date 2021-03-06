# CloudMirror
<p align="center"><img src="./static/assets/images/CloudMirror.svg" style="width:28%"/></p>
<b>云镜</b>，是一款微小的站内资源搜索引擎库，是一款基于Go语言开发，独立于开发项目之外，帮助WEB网站操作者快速搜索站资源的外部工具。它由Go语言开发且独立运行于服务器之上，开发者仅仅需提供图像文件存储路径，待程序初始化后,相关资源文件所在路径被将被全部收录于SQLite数据库中，并生成唯一的HASHID，采用链式绑定，方便使用者快速搜索图像资源。
<p align="center"><img src="./static/assets/images/example.png" style="width:100%"/></p>
<p align="center"><img src="./static/assets/images/example_1.png" style="width:100%"/></p>

# CM功能流程
<p align="center"><img src="./static/assets/images/CM-function-stream.png" style="width:100%"/></p>

# 使用教程
一、修改app.ini里的参数进行配置 （目前仍在开发，不可以投入生产环境使用）

```
#CM configuration params.

app_name   = cloudMirror
address = localhost:9000
url = http://localhost:9000
# 你的ffmpegPath路径
ffmpegPath = E:/local/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe

[SQLite]
driverName      = sqlite3
dataSourceName    = ./data/cloudMirror.sqlite
```

二、启动程序
```
go run main.go
```

# 项目依赖
- MinGW-w64-v8.1.0
- Go-v1.17.5
- BootStrap-v4.6.x
- JQuery-v3.6.0
- SQLite3

# 推荐的静态文件路径结构
```
asserts
│
│
└───audios
│   │   file01.mp3
│   │   file02.mp3
│   
└───videos
|    │   file01.mp4
|    │   file02.mp4
|
└───images
|    │   file01.png
|    │   file02.jpg
|    |   file03.jpge
|
└───docs
    │   file01.md
    │   file02.docx
    |   file03.txt
```