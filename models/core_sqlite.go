package models

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var DBSQLite *sql.DB

//SQLiteInit() initialization data
func DBSQLiteInit() {
	db, err := sql.Open("sqlite3", "./data/cloudMirror.sqlite")
	checkErr(err)
	DBSQLite = db
	//表的创建 > bid (block id 区块ID) / fid (file id 文件ID) / filename (文件名字) / pathname (路径名字) / created_time (创建时间)
	var sql string
	//Block table
	sql = `
	CREATE TABLE IF NOT EXISTS block(
		bid VARCHAR(64) PRIMARY KEY
	);
	`
	db.Exec(sql)

	//document table
	sql = `
	CREATE TABLE IF NOT EXISTS documents(
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64) NOT NULL,
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
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64) NOT NULL,
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
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64) NOT NULL,
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
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64) NOT NULL,
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
	} else {
		fmt.Println("🥥SQLite was initialized successfully")
	}
}

//DBSQLiteInsert()用于插入数据
func DBSQLiteInsert(bid string, fid string, filename string, pathname string, createdTime string) {
	stmt, err := DBSQLite.Prepare("INSERT INTO userinfo(bid, fid, filename, pathname, created_time) values(?,?,?,?,?)")
	checkErr(err)

	res, err := stmt.Exec(pathname, createdTime)
	checkErr(err)
	affect, _ := res.RowsAffected()
	if affect > 0 {
		fmt.Println("")
	} else {
		fmt.Println("")
	}
}

//DBSQLiteDelete()用于删除数据
func DBSQLiteDelete(bid string, fid string, filename string, pathname string, createdTime string) {}

//DBSQLiteUpdate()用于更新数据
func DBSQLiteUpdate(bid string, fid string, filename string, pathname string, createdTime string) {
	stmt, err := DBSQLite.Prepare("update userinfo set pathname=? where created_time=?")
	checkErr(err)

	res, err := stmt.Exec(pathname, createdTime)
	checkErr(err)

	affect, err := res.RowsAffected()
	checkErr(err)

	if affect > 0 {

	} else {

	}
}

//DBSQLiteQuery() use to query data.
func DBSQLiteQuery(bid string, fid string, filename string, pathname string, createdTime string) {
	stmt, err := DBSQLite.Prepare("SELECT * From userinfo where bid=? or description=? or tag=? )")
	checkErr(err)

	res, err := stmt.Exec(bid, fid, filename, pathname, createdTime)
	checkErr(err)
	affect, _ := res.RowsAffected()
	if affect > 0 {
		fmt.Println(res)
	} else {
		fmt.Println("")
	}
}
