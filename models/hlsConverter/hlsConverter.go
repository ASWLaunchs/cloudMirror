package hlsConverter

import (
	"fmt"
	"os"
	"os/exec"
)

//Init() -> initialize file storage path.
//if you want to use hlsConverter make something , then you must use Init() before your any step.
func Init(targetPath string) {
	exist, err := PathExists(targetPath)
	if err != nil {
		fmt.Printf("get dir error![%v]\n", err)
		return
	}
	if exist {
		fmt.Printf("has dir![%v]\n", targetPath)
	} else {
		fmt.Printf("no dir![%v]\n", targetPath)
		// create dir.
		err := os.Mkdir(targetPath, os.ModePerm)
		if err != nil {
			fmt.Printf("mkdir failed![%v]\n", err)
		} else {
			fmt.Printf("mkdir success!\n")
		}
	}
}

//PathExists() judege the dir exist or not.
func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}

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

//GeneratePoster() generate poster according to source video file.
func GeneratePoster(ffmpegPath string, srcPath string, targetPath string, framePosition string) error {
	cmd := exec.Command(ffmpegPath, "-i", srcPath, "-ss", framePosition, "-frames:v", "1", "-y", targetPath+"/poster.jpg")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	err := cmd.Start()
	return err
}

//HlsConverter() main execution function.
//generate m3u8 file and ts file.
func HlsConverter(ffmpegPath string, srcPath string, targetPath string, targetFilename string, resOptions []string) {
	variants, _ := GenerateHLSVariant(resOptions, "")
	GeneratePlaylist(variants, targetPath, targetFilename)

	for _, res := range resOptions {
		err := GenerateHLS(ffmpegPath, srcPath, targetPath, res)
		if err != nil {
			fmt.Println(err)
		}
	}
}
