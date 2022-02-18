package controllers_default

import (
	"cloudMirror/models"
	"cloudMirror/models/hlsConverter"
	"net/http"
	"path"
	"strings"
	"text/template"
)

type ControllerVideos struct{}

func (c ControllerVideos) Videos(w http.ResponseWriter, r *http.Request) {
	ffmpegPath := "E:/env/pkg/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe"
	srcPath := "static/assets/videos/example.mp4"
	targetPath := "static/assets/hls"
	framePosition := "1"

	//create final targetPath.
	str := strings.Split(srcPath, "/")
	targetPath = path.Join(targetPath, models.MD5(str[len(str)-1]))

	//call HLS converter.
	hlsConverter.Init(targetPath)
	hlsConverter.GeneratePoster(ffmpegPath, srcPath, targetPath, framePosition)
}

func (c ControllerVideos) VideosView(w http.ResponseWriter, r *http.Request) {
	ffmpegPath := "E:/env/pkg/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe"
	srcPath := "static/assets/videos/example.mp4"
	targetPath := "static/assets/hls"
	targetFilename := "video.m3u8"
	resOptions := []string{"480p", "720p"}

	hlsConverter.HlsConverter(ffmpegPath, srcPath, targetPath, targetFilename, resOptions)

	t, _ := template.ParseFiles("templates/templates_default/video.html")
	t.Execute(w, r)
}
