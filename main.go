//云镜主程序
package main

import (
	"cloudMirror/routers"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	// 静态文件路径
	http.Handle("/static/css/", http.StripPrefix("/static/css/", http.FileServer(http.Dir("static/css/"))))
	http.Handle("/static/js/", http.StripPrefix("/static/js/", http.FileServer(http.Dir("static/js/"))))
	http.Handle("/static/pkg/", http.StripPrefix("/static/pkg/", http.FileServer(http.Dir("static/pkg/"))))
	http.Handle("/static/assets/videos/", http.StripPrefix("/static/assets/videos/", http.FileServer(http.Dir("static/assets/videos/"))))
	http.Handle("/static/assets/images/", http.StripPrefix("/static/assets/images/", http.FileServer(http.Dir("static/assets/images/"))))
	http.Handle("/static/assets/fonts/", http.StripPrefix("/static/assets/fonts/", http.FileServer(http.Dir("static/assets/fonts/"))))

	//加载路由
	routers.ApiRoutersDefault()

	// 启动web服务，监听9090端口
	fmt.Println("这里是云镜服务中心，云镜已经启动！请打开端口9090查看.")
	log.Fatal(http.ListenAndServe("localhost:9090", nil))
}
