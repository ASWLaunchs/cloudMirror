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
