package controllers_default

import (
	"fmt"
	"net/http"
)

type ControllerSearch struct{}

func (c ControllerSearch) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	fmt.Println(q.Get("q"))
}
