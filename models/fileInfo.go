package models

import (
	"fmt"
	"io/ioutil"
	"log"
)

//FileInfo()用于录入从指定文件目录读取到的信息,返回读取到的文件列表信息
func FileInfo(dirname string) []string {
	fileInfo := []string{}
	fileInfoList, err := ioutil.ReadDir(dirname)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("当前目录下文件总数量为:", len(fileInfoList))
	for i := range fileInfoList {
		fileInfo = append(fileInfo, fileInfoList[i].Name())
	}
	return fileInfo
}
