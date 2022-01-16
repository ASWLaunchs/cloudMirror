package routers

import (
	"cloudMirror/controllers/controllers_default"
	"net/http"
)

func ApiRoutersDefault() {
	http.HandleFunc("/", controllers_default.ControllerIndex{}.Index)
	http.HandleFunc("/search", controllers_default.ControllerSearch{}.Search)
}
