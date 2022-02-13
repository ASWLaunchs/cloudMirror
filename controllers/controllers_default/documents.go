package controllers_default

import (
	"cloudMirror/models"
	"encoding/json"
	"net/http"
)

type ControllerDocuments struct{}

func (c ControllerDocuments) Documents(w http.ResponseWriter, r *http.Request) {
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryOf("documents")
	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}
