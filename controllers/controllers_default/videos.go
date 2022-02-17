package controllers_default

import (
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
	targetFilename := "example.m3u8"
	resOptions := []string{"480p", "720p"}

	//create final targetPath
	str := strings.Split(srcPath, "/")
	targetPath = path.Join(targetPath, str[len(str)-1])

	//call HLS converter.
	hlsConverter.Init(targetPath)
	hlsConverter.GeneratePoster(ffmpegPath, srcPath, targetPath, framePosition)
	hlsConverter.HlsConverter(ffmpegPath, srcPath, targetPath, targetFilename, resOptions)

	t, _ := template.ParseFiles("templates/templates_default/video.html")
	t.Execute(w, r)
}
