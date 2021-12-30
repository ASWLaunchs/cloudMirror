# CloudMirror
<p align="center"><img src="./static/image/CloudMirror.svg" style="width:28%"/></p>
云镜，是一款微小的站内资源搜索引擎库，是一款基于Go语言开发，独立于开发项目之外，帮助WEB网站操作者快速搜索站资源的外部工具。它由Go语言开发且独立运行于服务器之上，开发者仅仅需提供图像文件存储路径，待程序初始化后,相关资源文件所在路径被将被全部收录于SQLite数据库中，并生成唯一的HASHID，采用链式绑定，方便使用者快速搜索图像资源。
