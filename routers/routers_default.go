package routers

import (
	"cloudMirror/controllers/controllers_default"
	"net/http"
)

func ApiRoutersDefault() {
	http.HandleFunc("/", controllers_default.ControllerIndex{}.Index)
	http.HandleFunc("/search", controllers_default.ControllerSearch{}.Search)
	http.HandleFunc("/documents", controllers_default.ControllerDocuments{}.Documents)
	http.HandleFunc("/video", controllers_default.ControllerVideo{}.Video)
	http.HandleFunc("/statistics", controllers_default.ControllerStatistics{}.Statistics)
}
