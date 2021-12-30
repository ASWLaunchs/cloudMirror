//云镜主程序
package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

// w表示response对象，返回给客户端的内容都在对象里处理
// r表示客户端请求对象，包含了请求头，请求参数等等
func index(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("html/index.html")
	t.Execute(w, r)
}

func main() {
	// 设置路由，如果访问/，则调用index方法
	http.Handle("/static/css/", http.StripPrefix("/static/css/", http.FileServer(http.Dir("static/css/"))))
	http.Handle("/static/js/", http.StripPrefix("/static/js/", http.FileServer(http.Dir("static/js/"))))
	http.Handle("/static/pkg/", http.StripPrefix("/static/pkg/", http.FileServer(http.Dir("static/pkg/"))))
	http.Handle("/static/assets/videos/", http.StripPrefix("/static/assets/videos/", http.FileServer(http.Dir("static/assets/videos/"))))
	http.Handle("/static/assets/images/", http.StripPrefix("/static/assets/images/", http.FileServer(http.Dir("static/assets/images/"))))
	http.Handle("/static/assets/fonts/", http.StripPrefix("/static/assets/fonts/", http.FileServer(http.Dir("static/assets/fonts/"))))
	http.HandleFunc("/", index)
	// 启动web服务，监听9090端口
	fmt.Println("这里是云镜服务中心，云镜已经启动！")
	log.Fatal(http.ListenAndServe("localhost:9090", nil))
}
