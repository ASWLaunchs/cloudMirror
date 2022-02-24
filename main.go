//云镜主程序
package main

import (
	"cloudMirror/models"
	"cloudMirror/routers"
	"fmt"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
	"gopkg.in/ini.v1"
)

func main() {
	cfg, _ := ini.Load("./conf/app.ini")
	//initialized database.
	models.DBSQLiteInit()

	// static files path.
	http.Handle("/static/css/", http.StripPrefix("/static/css/", http.FileServer(http.Dir("static/css/"))))
	http.Handle("/static/js/", http.StripPrefix("/static/js/", http.FileServer(http.Dir("static/js/"))))
	http.Handle("/static/pkg/", http.StripPrefix("/static/pkg/", http.FileServer(http.Dir("static/pkg/"))))
	http.Handle("/static/assets/", http.StripPrefix("/static/assets/", http.FileServer(http.Dir("static/assets/"))))

	// load routers.
	routers.ApiRoutersDefault()

	// start port server.
	fmt.Printf("This is CloudMirror，server is started at %s\n.", cfg.Section("").Key("url").String())
	models.CMLog() //start logs server.
	log.Println("the CM server was start!")
	log.Fatal(http.ListenAndServe(cfg.Section("").Key("address").String(), nil))
}
