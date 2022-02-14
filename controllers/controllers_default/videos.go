package controllers_default

import (
	"cloudMirror/models/hlsConverter"
	"fmt"
	"net/http"
	"text/template"
)

type ControllerVideos struct{}

func (c ControllerVideos) Videos(w http.ResponseWriter, r *http.Request) {
	ffmpegPath := "E:/env/pkg/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe"
	srcPath := "static/assets/videos/example.mp4"
	targetPath := "static/assets/hls"
	resOptions := []string{"480p"}

	variants, _ := hlsConverter.GenerateHLSVariant(resOptions, "")
	hlsConverter.GeneratePlaylist(variants, targetPath, "example.m3u8")

	for _, res := range resOptions {
		err := hlsConverter.GenerateHLS(ffmpegPath, srcPath, targetPath, res)
		if err != nil {
			fmt.Println(err)
		}
	}

	t, _ := template.ParseFiles("templates/templates_default/video.html")
	t.Execute(w, r)
}
