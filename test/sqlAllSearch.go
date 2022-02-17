// package test

// import (
// 	"database/sql"
// 	"encoding/json"
// 	"fmt"
// )

// func (c ModelsCoreSQLite) DBSQLiteQuery(fileCategory string, fid string, tag string, filename string, createdTime string) []byte {
// 	var res sql.Result
// 	if len(filename) > 0 {
// 		//preset sql statement.
// 		sqlStmt = "SELECT * FROM " + fileCategory + " where filename like '%?%' "
// 		stmt, err = DBSQLite.Prepare(sqlStmt)
// 		checkErr(err)

// 		//execute sql statement.
// 		res, err = stmt.Exec(fid, tag, filename, createdTime)
// 		checkErr(err)
// 	} else if len(filename) > 0 && len(tag) > 0 { //tag method.
// 		//preset sql statement.
// 		sqlStmt = "SELECT * FROM " + fileCategory + " where filename like '%?%' and tag like '%?%' "
// 		stmt, err = DBSQLite.Prepare(sqlStmt)
// 		checkErr(err)

// 		//execute sql statement.
// 		res, err = stmt.Exec(fid, tag, filename, createdTime)
// 		checkErr(err)
// 	} else if len(filename) > 0 && len(createdTime) > 0 { //time method.
// 		//preset sql statement.
// 		sqlStmt = "SELECT * FROM " + fileCategory + " where filename like '%?%' and created_time < ?"
// 		stmt, err = DBSQLite.Prepare(sqlStmt)
// 		checkErr(err)

// 		//execute sql statement.
// 		res, err = stmt.Exec(fid, tag, filename, createdTime)
// 		checkErr(err)
// 	} else if len(fid) > 0 { //fid method.
// 		sqlStmt = "SELECT * FROM " + fileCategory + " where fid = ?"
// 	}

// 	affect, _ := res.RowsAffected()
// 	var rs []byte
// 	if affect > 0 {
// 		rs, _ = json.Marshal(SearchResult{
// 			Status:      true,
// 			Fid:         "",
// 			Tag:         "",
// 			Filename:    "",
// 			Pathname:    "",
// 			CreatedTime: "",
// 			Filesize:    "",
// 		})
// 	} else {
// 		rs, _ = json.Marshal(SearchResult{
// 			Status:      false,
// 			Fid:         "",
// 			Tag:         "",
// 			Filename:    "",
// 			Pathname:    "",
// 			CreatedTime: "",
// 			Filesize:    "",
// 		})
// 	}
// 	fmt.Println(rs)
// 	DBSQLite.Close()
// 	return rs
// }
