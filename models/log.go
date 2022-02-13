package models

import (
	"log"
	"os"
	"time"
)

//CMlog()
// all working error and tip info will be printed into this logs.txt
func CMLog() {
	// if logs.txt isn't exist , then it will be created.
	file, err := os.OpenFile("./logs/logs_"+time.Now().Format("2006-01-02")+".txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	log.SetOutput(file)
	log.Println("CMLog is working!")
}
