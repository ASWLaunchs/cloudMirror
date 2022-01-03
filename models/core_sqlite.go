package models

import "database/sql"

var DBSQLite *sql.DB

//sqlite初始化
func init() {
	db, err := sql.Open("sqlite3", "./data/cloudMirror.db")
	checkErr(err)
	DBSQLite = db
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

//DBSQLiteInsert()用于插入数据
func DBSQLiteInsert() {

}

//DBSQLiteDelete()用于删除数据
func DBSQLiteDelete() {

}

//DBSQLiteUpdate()用于更新数据
func DBSQLiteUpdate() {

}

//DBSQLiteQuery()用于查询数据
func DBSQLiteQuery() {

}
