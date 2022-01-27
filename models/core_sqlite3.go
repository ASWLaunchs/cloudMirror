package models

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type ModelsCoreSQLite struct{}

var DBSQLite *sql.DB

//SQLiteInit() initialization data
func DBSQLiteInit() {
	db, err := sql.Open("sqlite3", "./data/cloudMirror.sqlite")
	checkErr(err)
	fmt.Println("🥥 SQLite was initialized successfully.")
	DBSQLite = db
	//table > fid (file id ) / tag / filename / pathname  / created_time / filesize
	var sql string

	//document table
	sql = `
	CREATE TABLE IF NOT EXISTS documents(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);
	`
	db.Exec(sql)

	//audio table
	sql = `
	CREATE TABLE IF NOT EXISTS audios(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);
	`
	db.Exec(sql)

	//image table
	sql = `
	 CREATE TABLE IF NOT EXISTS images(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	 );
	 `
	db.Exec(sql)

	//video table
	sql = `
	CREATE TABLE IF NOT EXISTS videos(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);`
	db.Exec(sql)
}

//checkErr() can check err.
func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

//DBSQLiteInsert() insert newer data into sqlite3.
//fileDir such as : static/assets/docs.
func (c ModelsCoreSQLite) DBSQLiteInsert(fileCategory string, fileDir string) {
	//insert new data.
	var sql string = `INSERT INTO ` + fileCategory + `( fid, filename, pathname, created_time, filesize) SELECT ?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM ` + fileCategory + ` WHERE fid = ?) `
	//read linked list.
	var nodeFileInfo *NodeFileInfo
	nodeFileInfo = ModelsFileInfo{}.fileInfo(fileCategory, fileDir)
	for nodeFileInfo != nil {

		//prepare sql string.
		stmt, err := DBSQLite.Prepare(sql)
		checkErr(err)
		res, err := stmt.Exec(nodeFileInfo.fid, nodeFileInfo.filename, nodeFileInfo.filepath, nodeFileInfo.createdTime, nodeFileInfo.filesize, nodeFileInfo.fid)
		checkErr(err)

		//feedback result.
		affect, _ := res.RowsAffected()
		if affect > 0 {
			fmt.Printf("inserted in %s successfully.\n", fileCategory)
		} else {
			fmt.Printf("failed inserting in %s.\n", fileCategory)
		}

		//Move pointer points down one linked table block
		nodeFileInfo = nodeFileInfo.next
	}
}

//DBSQLiteDelete() delete those redundant and deprecated data.
func (c ModelsCoreSQLite) DBSQLiteDelete(fid string, tag string, filename string, pathname string, createdTime string) {
}

//DBSQLiteUpdate() update existed data.
func (c ModelsCoreSQLite) DBSQLiteUpdate(fid string, tag string, filename string, pathname string, createdTime string) {
	stmt, err := DBSQLite.Prepare("update userinfo set pathname=? where created_time=?")
	checkErr(err)

	res, err := stmt.Exec(pathname, createdTime)

	checkErr(err)

	affect, err := res.RowsAffected()
	checkErr(err)

	if affect > 0 {

	} else {

	}

	DBSQLite.Close()
}

//DBSQLiteQuery() be used to query data.
func (c ModelsCoreSQLite) DBSQLiteQuery(fid string, tag string, filename string, createdTime string) []byte {
	fmt.Println("ok")
	stmt, err := DBSQLite.Prepare("SELECT * FROM documents where fid like '%?%' or tag like '%?%' or filename like '%?%' or created_time like '%?%')")
	checkErr(err)
	res, err := stmt.Exec(fid, tag, filename, createdTime)
	checkErr(err)
	affect, _ := res.RowsAffected()
	var rs []byte
	if affect > 0 {
		rs, _ = json.Marshal(SearchResult{
			Status:      true,
			Fid:         "",
			Tag:         "",
			Filename:    "",
			CreatedTime: "",
		})
	} else {
		rs, _ = json.Marshal(SearchResult{
			Status:      false,
			Fid:         "",
			Tag:         "",
			Filename:    "",
			CreatedTime: "",
		})
	}
	fmt.Println(rs)
	DBSQLite.Close()
	return rs
}
