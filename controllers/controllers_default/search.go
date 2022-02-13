package controllers_default

import (
	"fmt"
	"net/http"
)

type ControllerSearch struct{}

func (c ControllerSearch) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	fid := ""
	tag := ""
	filename := q.Get("w")
	createdTime := ""
	// fmt.Println(models.ModelsCoreSQLite{}.DBSQLiteQuery("documents", fid, tag, filename, createdTime))
	fmt.Println(fid, tag, filename, createdTime)
	w.WriteHeader(200)
	w.Write([]byte{1})
}
