package models

import "database/sql"

var DBSQLite *sql.DB

//sqlite初始化
func init() {
	db, err := sql.Open("sqlite3", "./data/cloudMirror.db")
	checkErr(err)
	DBSQLite = db
	//表的创建 > bid (block id 区块ID) / fid (file id 文件ID) / filename (文件名字) / pathname (路径名字) / created_time (创建时间)
	var sql string
	//创建文档表
	sql = `
	CREATE TABLE IF NOT EXISTS documents(
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64),
		filename VARCHAR(255) NULL,
		pathname VARCHAR(4096) NULL,
		created_time DATETIME NULL
	);
	`
	db.Exec(sql)

	//创建音乐表
	sql = `
	CREATE TABLE IF NOT EXISTS audios(
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64),
		filename VARCHAR(255) NULL,
		pathname VARCHAR(4096) NULL,
		created_time DATETIME NULL
	);
	`
	db.Exec(sql)

	//创建图片表
	sql = `
	 CREATE TABLE IF NOT EXISTS images(
		 bid VARCHAR(64) PRIMARY KEY,
		 fid VARCHAR(64),
		 filename VARCHAR(255) NULL,
		 pathname VARCHAR(4096) NULL,
		 created_time DATETIME NULL
	 );
	 `
	db.Exec(sql)

	//创建视频表
	sql = `
	CREATE TABLE IF NOT EXISTS videos(
		bid VARCHAR(64) PRIMARY KEY,
		fid VARCHAR(64),
		filename VARCHAR(255) NULL,
		pathname VARCHAR(4096) NULL,
		created_time DATETIME NULL
	);
	`
	db.Exec(sql)
}

//checkErr用于错误检测
func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

//DBSQLiteInsert()用于插入数据
func DBSQLiteInsert(pathname string, createdTime string) {
	stmt, err := DBSQLite.Prepare("INSERT INTO userinfo(pathname, created_time) values(?,?)")
	checkErr(err)

	res, err := stmt.Exec(pathname, createdTime)
	checkErr(err)
	affect, err := res.RowsAffected()
	if affect > 0 {

	} else {

	}
}

//DBSQLiteDelete()用于删除数据
func DBSQLiteDelete(bid string, pathname string, createdTime string) {

}

//DBSQLiteUpdate()用于更新数据
func DBSQLiteUpdate(pathname string, createdTime string) {
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

//DBSQLiteQuery()用于查询数据
func DBSQLiteQuery() {

}
