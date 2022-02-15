//云镜主程序
package main

import (
	"cloudMirror/models"
	"cloudMirror/routers"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	//initialized database.
	models.DBSQLiteInit()

	// 静态文件路径
	http.Handle("/static/css/", http.StripPrefix("/static/css/", http.FileServer(http.Dir("static/css/"))))
	http.Handle("/static/js/", http.StripPrefix("/static/js/", http.FileServer(http.Dir("static/js/"))))
	http.Handle("/static/pkg/", http.StripPrefix("/static/pkg/", http.FileServer(http.Dir("static/pkg/"))))
	http.Handle("/static/assets/", http.StripPrefix("/static/assets/", http.FileServer(http.Dir("static/assets/"))))

	//加载路由
	routers.ApiRoutersDefault()

	// 启动web服务，监听9090端口
	fmt.Println("This is CloudMirror，server is started at http://localhost:9090.")
	models.CMLog() //start logs server.
	log.Println("the CM server was start!")
	log.Fatal(http.ListenAndServe("localhost:9090", nil))
}
