package controllers_default

import (
	"cloudMirror/models"
	"encoding/json"
	"net/http"
)

type ControllerPageCount struct{}

func (c ControllerPageCount) PageCount(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	category := q.Get("category") //get page number.
	keyWord := q.Get("keyWord")
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryPageCount(category, keyWord)
	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}
