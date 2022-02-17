package hlsConverter

import (
	"fmt"
	"os"
	"os/exec"
)

// GenerateHLS() be used to generate the hls files by resolutions.
// The available resolutions are: 360p, 480p, 720p and 1080p..
func GenerateHLS(ffmpegPath, srcPath, targetPath, resolution string) error {
	options, err := getOptions(srcPath, targetPath, resolution)
	if err != nil {
		return err
	}

	return GenerateHLSCustom(ffmpegPath, options)
}

// GenerateHLSCustom() will according the options to genereta hls files.
// this function call the command line execution generation command.
func GenerateHLSCustom(ffmpegPath string, options []string) error {
	cmd := exec.Command(ffmpegPath, options...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Start()
	return err
}

//HlsConverter main execution function.
func HlsConverter(category string, ffmpegPath string, srcPath string, targetPath string, targetFilename string, resOptions []string) {
	if category == "post" {

	} else if category == "video" {
		variants, _ := GenerateHLSVariant(resOptions, "")
		GeneratePlaylist(variants, targetPath, targetFilename)

		for _, res := range resOptions {
			err := GenerateHLS(ffmpegPath, srcPath, targetPath, res)
			if err != nil {
				fmt.Println(err)
			}
		}
	}
}
