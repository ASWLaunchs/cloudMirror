package models

//table SearchResult
type SearchResult struct {
	Category    string `json:"category"`
	Fid         string `json:"fid"`
	Tag         string `json:"tag"`
	Filename    string `json:"filename"`
	Pathname    string `json:"pathname"`
	CreatedTime string `json:"created_time"`
	Filesize    int    `json:"filesize"`
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
	Tag         string `json:"tag"`
	Filename    string `json:"filename"`
	Pathname    string `json:"pathname"`
	CreatedTime string `json:"created_time"`
	Filesize    int    `json:"filesize"`
}

func (Resource) TableResource() string {
	return "Resource"
}
