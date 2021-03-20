export interface YoutubeVideoAPI {
	kind: string;
	etag: string;
	items: Item[];
	pageInfo: PageInfo;
}

interface Item {
	kind: string;
	etag: string;
	id: string;
	snippet: Snippet;
	statistics: Statistics;
}

interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: string;
	tags: string[];
	categoryId: string;
	liveBroadcastContent: string;
	localized: Localized;
	defaultAudioLanguage: string;
}

interface Localized {
	title: string;
	description: string;
}

interface Thumbnails {
	default: Default;
	medium: Default;
	high: Default;
	standard: Default;
}

interface Default {
	url: string;
	width: number;
	height: number;
}

interface Statistics {
	viewCount: string;
	likeCount: string;
	dislikeCount: string;
	favoriteCount: string;
	commentCount: string;
}

interface PageInfo {
	totalResults: number;
	resultsPerPage: number;
}
