package controllers_default

import (
	"fmt"
	"net/http"
	"os"
)

type ControllerSearch struct{}

func (c ControllerSearch) Search(w http.ResponseWriter, r *http.Request) {
	// models.DBSQLiteQuery()
	q := r.URL.Query()
	fmt.Println(q.Get("w"))
	file, err := os.Open("main.go")

	if err == nil {
		fi, _ := file.Stat()
		fmt.Println("file size is ", fi.Size())
	}
}
