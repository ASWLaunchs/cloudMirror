package controllers_default

import (
	"cloudMirror/models/hlsConverter"
	"net/http"
	"text/template"
)

type ControllerVideos struct{}

func (c ControllerVideos) Videos(w http.ResponseWriter, r *http.Request) {
	ffmpegPath := "E:/env/pkg/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe"
	srcPath := "static/assets/videos/example.mp4"
	targetPath := "static/assets/videos"
	targetFilename := "example.m3u8"
	resOptions := []string{"480p"}
	hlsConverter.HlsConverter("video", ffmpegPath, srcPath, targetPath, targetFilename, resOptions)

	t, _ := template.ParseFiles("templates/templates_default/video.html")
	t.Execute(w, r)
}
