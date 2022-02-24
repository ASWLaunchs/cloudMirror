package controllers_default

import (
	"cloudMirror/models"
	"cloudMirror/models/hlsConverter"
	"encoding/json"
	"net/http"
	"path"

	"gopkg.in/ini.v1"
)

type ControllerVideos struct{}

func (c ControllerVideos) Videos(w http.ResponseWriter, r *http.Request) {
	cfg, _ := ini.Load("./conf/app.ini")
	q := r.URL.Query()
	page := q.Get("page")       //get page number.
	keyWord := q.Get("keyWord") //searching key word.
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryByCategory("videos", page, keyWord)

	for _, v := range res1 {
		ffmpegPath := cfg.Section("").Key("ffmpegPath").String()
		srcPath := v.Pathname + "/" + v.Filename
		targetPath := path.Join("static/assets/hls", v.Fid)
		framePosition := "1"

		//call HLS converter generate poster.
		hlsConverter.Init(targetPath)
		hlsConverter.GeneratePoster(ffmpegPath, srcPath, targetPath, framePosition)
	}

	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
}

func (c ControllerVideos) VideosView(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	fid := q.Get("fid") //get page number.
	res1 := models.ModelsCoreSQLite{}.DBSQLiteQueryByFid(fid, "videos")

	cfg, _ := ini.Load("./conf/app.ini")
	ffmpegPath := cfg.Section("").Key("ffmpegPath").String()
	var srcPath string
	targetPath := path.Join("static/assets/hls", fid)
	targetFilename := "video.m3u8"
	resOptions := []string{"480p", "720p"}
	for _, v := range res1 {
		srcPath = v.Pathname + "/" + v.Filename
	}

	//call HLS converter generate hls.
	hlsConverter.HlsConverter(ffmpegPath, srcPath, targetPath, targetFilename, resOptions)

	res2, _ := json.Marshal(res1)
	w.WriteHeader(200)
	w.Write(res2)
	// t, _ := template.ParseFiles("templates/templates_default/video.html")
	// t.Execute(w, r)
}
