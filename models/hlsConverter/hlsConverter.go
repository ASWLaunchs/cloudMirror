package hlsConverter

import (
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
