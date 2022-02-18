package models

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	_ "github.com/mattn/go-sqlite3"
)

type ModelsCoreSQLite struct{}

var DBSQLite *sql.DB
var stmt *sql.Stmt
var err error
var sqlStmt string
var pagination map[string]int

//SQLiteInit() initialization data
func DBSQLiteInit() {
	db, err := sql.Open("sqlite3", "./data/cloudMirror.sqlite")
	checkErr(err)
	fmt.Println("🥥 SQLite was initialized successfully.")
	DBSQLite = db

	//table > fid (file id ) / tag / filename / pathname  / created_time / filesize
	//document table
	sqlStmt = `
	CREATE TABLE IF NOT EXISTS documents(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);
	`
	db.Exec(sqlStmt)

	//audio table
	sqlStmt = `
	CREATE TABLE IF NOT EXISTS audios(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);
	`
	db.Exec(sqlStmt)

	//image table
	sqlStmt = `
	 CREATE TABLE IF NOT EXISTS images(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	 );
	 `
	db.Exec(sqlStmt)

	//video table
	sqlStmt = `
	CREATE TABLE IF NOT EXISTS videos(
		fid VARCHAR(64) PRIMARY KEY,
		tag VARCHAR(255) NULL,
		filename VARCHAR(255) NOT NULL,
		pathname VARCHAR(4096) NOT NULL,
		created_time DATETIME NOT NULL,
		filesize int NOT NULL
	);`
	db.Exec(sqlStmt)
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
	sqlStmt = `INSERT INTO ` + fileCategory + `( fid, filename, tag, pathname, created_time, filesize) SELECT ?,?,?,?,?,? WHERE NOT EXISTS(SELECT 1 FROM ` + fileCategory + ` WHERE fid = ?) `
	//read linked list.
	var nodeFileInfo *NodeFileInfo
	nodeFileInfo = ModelsFileInfo{}.fileInfo(fileCategory, fileDir)
	for nodeFileInfo != nil {

		//prepare sql string.
		stmt, err := DBSQLite.Prepare(sqlStmt)
		checkErr(err)
		res, err := stmt.Exec(nodeFileInfo.fid, nodeFileInfo.filename, "", nodeFileInfo.filepath, nodeFileInfo.createdTime, nodeFileInfo.filesize, nodeFileInfo.fid)
		checkErr(err)

		//feedback result.
		affect, _ := res.RowsAffected()
		if affect > 0 {
			log.Printf("inserted in %s successfully.\n", fileCategory)
		} else {
			log.Printf("failed inserting in %s.\n", fileCategory)
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
//searching by file category when fileCategory isn't null.
//all searching.
func (c ModelsCoreSQLite) DBSQLiteQuery(category []string, page string, keyWord string) []SearchResult {
	var result = make([]SearchResult, 0)
	pageNum, _ := strconv.Atoi(page) //convert string to int , and make pageNum multiplied 10.
	page = strconv.Itoa((pageNum - 1) * 10)

	//initialize some struct variables.
	var fid, filename, tag, pathname, createdTime string
	var filesize int

	for _, v := range category {
		//documents
		sqlStmt = `SELECT fid, tag, filename, pathname,created_time, filesize FROM ` + v + ` WHERE filename LIKE '%` + keyWord + `%' ORDER BY fid limit ` + page + `,2`
		//prepare sql string.
		stmt, err := DBSQLite.Prepare(sqlStmt)
		checkErr(err)
		rows, err := stmt.Query()
		checkErr(err)
		for rows.Next() {
			rows.Scan(&fid, &tag, &filename, &pathname, &createdTime, &filesize)
			result = append(result, SearchResult{v, fid, tag, filename, pathname, createdTime, filesize})
		}
	}

	return result
}

//DBSQLiteQueryStatistics()
func (c ModelsCoreSQLite) DBSQLiteQueryStatistics(category []string) []Statistics {
	var result = make([]Statistics, 0)

	for _, v := range category {
		sqlStmt = `SELECT count(*) FROM ` + v
		//prepare sql string.
		stmt, err := DBSQLite.Prepare(sqlStmt)
		checkErr(err)
		rows, err := stmt.Query()
		checkErr(err)

		var count int
		for rows.Next() {
			rows.Scan(&count)
			result = append(result, Statistics{v, count})
		}
	}
	return result
}

//DBSQLiteQueryByFid() -> executes precise query by fid.
func (c ModelsCoreSQLite) DBSQLiteQueryByFid(fid string, category string) []Resource {
	var result = make([]Resource, 0)
	sqlStmt = `SELECT fid, tag, filename, pathname, created_time, filesize FROM` + category + `WHERE fid = ` + fid
	stmt, err := DBSQLite.Prepare(sqlStmt)
	checkErr(err)
	rows, err := stmt.Query()
	checkErr(err)

	var filename, tag, pathname, createdTime string
	var filesize int
	for rows.Next() {
		rows.Scan(&fid, &tag, &filename, &pathname, &createdTime, &filesize)
		result = append(result, Resource{fid, tag, filename, pathname, createdTime, filesize})
	}

	return result
}

//DBSQLiteQueryByCategory() -> default query by category.
//return resource info and page number count.
func (c ModelsCoreSQLite) DBSQLiteQueryByCategory(category string, page string, keyWord string) []Resource {
	var result = make([]Resource, 0)
	pageNum, _ := strconv.Atoi(page) //convert string to int , and make pageNum multiplied 10.
	page = strconv.Itoa((pageNum - 1) * 10)
	sqlStmt = `SELECT fid, tag, filename, pathname, created_time, filesize FROM ` + category + ` WHERE filename LIKE '%` + keyWord + `%' ORDER BY fid limit ` + page + `,10`
	//prepare sql string.
	stmt, err := DBSQLite.Prepare(sqlStmt)
	checkErr(err)
	rows, err := stmt.Query()
	checkErr(err)

	var fid, filename, tag, pathname, createdTime string
	var filesize int
	for rows.Next() {
		rows.Scan(&fid, &tag, &filename, &pathname, &createdTime, &filesize)
		result = append(result, Resource{fid, tag, filename, pathname, createdTime, filesize})
	}

	return result
}

//DBSQLiteQueryPageCount()
func (c ModelsCoreSQLite) DBSQLiteQueryPageCount(category string, keyWord string) int {
	pagination = make(map[string]int)
	var count int

	// category equal default means all query.
	if category == "default" {
		err := DBSQLite.QueryRow(`SELECT sum(co) FROM (SELECT count(*) co FROM documents as d WHERE d.filename LIKE '` + keyWord + `%' GROUP BY fid UNION ALL SELECT count(*) co FROM images as i WHERE i.filename LIKE '%` + keyWord + `%' GROUP BY fid UNION ALL SELECT count(*) co FROM audios as a WHERE a.filename LIKE '%` + keyWord + `%' GROUP BY fid UNION ALL SELECT count(*) co FROM videos as v WHERE v.filename LIKE '%` + keyWord + `%' GROUP BY fid ) as tb`).Scan(&count)
		checkErr(err)
	} else {
		err := DBSQLite.QueryRow(`SELECT count(*) FROM ` + category + ` WHERE filename LIKE '%` + keyWord + `%' ORDER BY fid`).Scan(&count)
		checkErr(err)
	}
	pagination[category] = count
	return pagination[category]
}
