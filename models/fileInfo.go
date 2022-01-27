package models

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"syscall"
)

type ModelsFileInfo struct {
}

type NodeFileInfo struct {
	fid         string
	filename    string
	filepath    string
	createdTime int64
	filesize    int64
	next        *NodeFileInfo
}

//FileInfo() gets infomation according to file path.
//file category are : doc , image , audio , video .
//return file category, file name, file size, file created time.
func (c ModelsFileInfo) fileInfo(fileCategory string, fileDir string) *NodeFileInfo {
	//judege file category format is correct or not.
	judgeFileCategory(fileCategory)

	//get file infomation.
	fileInfoList, err := ioutil.ReadDir(fileDir)
	if err != nil {
		log.Fatal(err)
	}

	//linked list
	var head = new(NodeFileInfo)
	var tail *NodeFileInfo //create tail while initialize first linked list address.
	for i := range fileInfoList {
		fmt.Println(fileInfoList[i].Name())
		//initialize first node.
		if i == 0 {
			head = &NodeFileInfo{
				fid:         filename2sha256(fileInfoList[i].Name()),
				filename:    fileInfoList[i].Name(),
				filepath:    fileDir,
				filesize:    fileInfoList[i].Size(),
				createdTime: getCreatedTime(fileInfoList[i]),
				next:        nil,
			}
			tail = head
		} else {
			var nodeFileInfo = NodeFileInfo{
				fid:         filename2sha256(fileInfoList[i].Name()),
				filename:    fileInfoList[i].Name(),
				filepath:    fileDir,
				filesize:    fileInfoList[i].Size(),
				createdTime: getCreatedTime(fileInfoList[i]),
			}
			(*tail).next = &nodeFileInfo
			tail = &nodeFileInfo
		}
	}
	fmt.Printf("The total number of files in the current directory(%s) is: %d.\n", fileDir, len(fileInfoList))
	return head
}

//judgeFileCategory()
func judgeFileCategory(fileCategory string) {
	var notFileCategory bool
	//judge file category.
	switch fileCategory {
	case "documents":
		notFileCategory = true
	case "images":
		notFileCategory = true
	case "audios":
		notFileCategory = true
	case "videos":
		notFileCategory = true
	default:
		notFileCategory = false

	}
	if !notFileCategory {
		panic("checked error file category , cloudMirror can't support server now.")
	}
}

//getCreatedTime()
//get file created time.
func getCreatedTime(fileInfo fs.FileInfo) int64 {
	fileSys := fileInfo.Sys().(*syscall.Win32FileAttributeData)
	nanoseconds := fileSys.CreationTime.Nanoseconds() // get nanoseconds.
	createTime := nanoseconds / 1e9                   // convert to seconds.
	return createTime
}

//filename2sha256()
func filename2sha256(src string) string {
	m := sha256.New()
	m.Write([]byte(src))
	res := hex.EncodeToString(m.Sum(nil))
	return res
}
