package controllers_default

import (
	"cloudMirror/models"
	"encoding/json"
	"net/http"
)

type ControllerAudios struct{}

func (c ControllerAudios) Audios(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	page := q.Get("page")       //get page number.
	keyWord := q.Get("keyWord") //searching key word.
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryByCategory("audios", page, keyWord)
	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}
