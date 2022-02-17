package controllers_default

import (
	"cloudMirror/models"
	"encoding/json"
	"net/http"
)

type ControllerSearch struct{}

func (c ControllerSearch) Search(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	page := q.Get("page")
	keyWord := q.Get("keyWord")
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQuery([]string{"documents", "images", "audios", "videos"}, page, keyWord)
	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}
