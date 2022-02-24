package main

import (
	"fmt"
	"log"
	"net/http"
)

func index(w http.ResponseWriter, r *http.Request) {
	fmt.Println("请求的路径是：", r.URL.Path)
	fmt.Fprintf(w, "Hello 我是输出信息!") // 这个写入到 w 的是输出到客户端的
}

func main() {
	http.HandleFunc("/kok/", index)          // 设置访问的路由
	err := http.ListenAndServe(":9090", nil) // 设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
	fmt.Println("已经启用监听在9090端口")
}
