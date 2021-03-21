export interface SpotifyTrackAPI {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: ExternalIDS;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}

interface Album {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images: Image[];
	name: string;
	release_date: string;
	release_date_precision: string;
	type: string;
	uri: string;
}

interface Artist {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface ExternalUrls {
	spotify: string;
}

interface Image {
	height: number;
	url: string;
	width: number;
}

interface ExternalIDS {
	isrc: string;
}

export interface SpotifySearchAPI {
	tracks: Tracks;
}

interface Tracks {
	href: string;
	items: SpotifyTrackAPI[];
	limit: number;
	next: string;
	offset: number;
	previous: null;
	total: number;
}

export interface SpotifyAlbumAPI {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	copyrights: Copyright[];
	external_ids: ExternalIDS;
	external_urls: ExternalUrls;
	genres: any[];
	href: string;
	id: string;
	images: Image[];
	label: string;
	name: string;
	popularity: number;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	tracks: Tracks;
	type: string;
	uri: string;
}

interface Copyright {
	text: string;
	type: string;
}

export interface Item {
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
}
