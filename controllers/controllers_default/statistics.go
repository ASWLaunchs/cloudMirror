package controllers_default

import (
	"cloudMirror/models"
	"net/http"
)

type ControllerStatistics struct{}

//Statistics() will initialization data that based on time.
func (c ControllerStatistics) Statistics(w http.ResponseWriter, r *http.Request) {
	models.DBSQLiteInit()
}
