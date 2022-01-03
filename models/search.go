package models

import (
	"fmt"
	"net/http"
)

//Search()用于接收提交的关键字
func Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	fmt.Println(q.Get("q"))
}
