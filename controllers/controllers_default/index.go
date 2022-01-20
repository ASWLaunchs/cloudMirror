package controllers_default

import (
	"net/http"
	"text/template"
)

type ControllerIndex struct{}

func (c ControllerIndex) Index(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("templates/templates_default/index.html")
	//填入存放静态资源的文件路径，系统将自动读取相关信息并存入到数据库中

	//云图提供的资源路径读取
	// fmt.Println(models.FileInfo("static/assets/videos"))
	// fmt.Println(models.FileInfo("static/assets/docs"))
	// fmt.Println(models.FileInfo("static/assets/images"))
	// fmt.Println(models.FileInfo("static/assets/audios"))
	t.Execute(w, r)
}
