package models

//table SearchResult
type SearchResult struct {
	Status      bool   `json:"status"`
	Fid         string `json:"fid"`
	Tag         string `json:"tag"`
	Filename    string `json:"filename"`
	CreatedTime string `json:"created_time"`
}

func (SearchResult) TableSearchResult() string {
	return "searchResult"
}
