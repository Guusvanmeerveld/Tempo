export interface SearchHit {
	type: string;
	result: {
		api_path: string;
		full_title: string;
		url: string;
		header_image_thumbnail_url: string;
	};
}
