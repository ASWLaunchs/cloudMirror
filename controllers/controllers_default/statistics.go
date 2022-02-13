package controllers_default

import (
	"cloudMirror/models"
	"encoding/json"
	"fmt"
	"net/http"
)

type ControllerStatistics struct{}

//Statistics() will initialization data that based on time.
func (c ControllerStatistics) Statistics(w http.ResponseWriter, r *http.Request) {
	//initialized database.
	models.DBSQLiteInit()
	//read file info while write into corresponding database table.
	defer models.ModelsCoreSQLite{}.DBSQLiteInsert("documents", "static/assets/docs") //docs
	defer models.ModelsCoreSQLite{}.DBSQLiteInsert("audios", "static/assets/audios")  //audios
	defer models.ModelsCoreSQLite{}.DBSQLiteInsert("images", "static/assets/images")  //images
	defer models.ModelsCoreSQLite{}.DBSQLiteInsert("videos", "static/assets/videos")  //videos
	fmt.Println("statistics is working.")
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryStatistics([]string{"documents", "images", "audios", "videos"})
	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}
