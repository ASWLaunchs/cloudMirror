package models

//table SearchResult
type SearchResult struct {
	Status      bool   `json:"status"`
	Fid         string `json:"fid"`
	Tag         string `json:"tag"`
	Filename    string `json:"filename"`
	Pathname    string `json:"pathname"`
	CreatedTime string `json:"created_time"`
	Filesize    string `json:"filesize"`
}

func (SearchResult) TableSearchResult() string {
	return "searchResult"
}

//table Statistics
type Statistics struct {
	Category string `json:"category"`
	Count    int    `json:"count"`
}

func (Statistics) TableStatistics() string {
	return "statistics"
}

//table Resource
type Resource struct {
	Fid         string `json:"fid"`
	Filename    string `json:"filename"`
	Tag         string `json:"tag"`
	Pathname    string `json:"pathname"`
	CreatedTime int    `json:"created_time"`
	Filesize    int    `json:"filesize"`
}

func (Resource) TableResource() string {
	return "Resource"
}
