export interface SoundCloudTrackAPI {
	artwork_url: string;
	caption: null;
	commentable: boolean;
	comment_count: number;
	created_at: string;
	description: string;
	downloadable: boolean;
	download_count: number;
	duration: number;
	full_duration: number;
	embeddable_by: string;
	genre: string;
	has_downloads_left: boolean;
	id: number;
	kind: string;
	label_name: null;
	last_modified: string;
	license: string;
	likes_count: number;
	permalink: string;
	permalink_url: string;
	playback_count: number;
	public: boolean;
	publisher_metadata: PublisherMetadata;
	purchase_title: string;
	purchase_url: string;
	release_date: string;
	reposts_count: number;
	secret_token: null;
	sharing: string;
	state: string;
	streamable: boolean;
	tag_list: string;
	title: string;
	track_format: string;
	uri: string;
	urn: string;
	user_id: number;
	visuals: null;
	waveform_url: string;
	display_date: string;
	media?: Media;
	monetization_model: string;
	policy: string;
	user?: User;
}

export interface Media {
	transcodings: Array<Transcoding>;
}

export interface Transcoding {
	url: string;
	preset: string;
	duration: number;
	snipped: boolean;
	format: { protocol: string; mime_type: string };
	quality: string;
}

export interface PublisherMetadata {
	id: number;
	urn: string;
	artist: string;
	album_title: string;
	contains_music: boolean;
	upc_or_ean: string;
	isrc: string;
	explicit: boolean;
	p_line: string;
	p_line_for_display: string;
	c_line: string;
	c_line_for_display: string;
	release_title: string;
}

export interface User {
	avatar_url: string;
	city: string;
	comments_count: number;
	country_code: null;
	created_at: string;
	creator_subscriptions: Array<null[]>;
	creator_subscription: CreatorSubscription;
	description: string;
	followers_count: number;
	followings_count: number;
	first_name: string;
	full_name: string;
	groups_count: number;
	id: number;
	kind: string;
	last_modified: string;
	last_name: string;
	likes_count: number;
	playlist_likes_count: number;
	permalink: string;
	permalink_url: string;
	playlist_count: number;
	reposts_count: null;
	track_count: number;
	uri: string;
	urn: string;
	username: string;
	verified: boolean;
	visuals: Visuals;
	badges: Badges;
}

export interface Badges {
	pro: boolean;
	pro_unlimited: boolean;
	verified: boolean;
}

export interface CreatorSubscription {
	product: null[];
}

export interface Visuals {
	urn: string;
	enabled: boolean;
	visuals: null[];
	tracking: null;
}

export interface SoundCloudSearchAPI {
	collection: Collection[];
	total_results: number;
	next_href: string;
	query_urn: string;
}

export interface Collection {
	artwork_url: null | string;
	caption: null;
	commentable: boolean;
	comment_count: number;
	created_at: string;
	description: string;
	downloadable: boolean;
	download_count: number;
	duration: number;
	full_duration: number;
	embeddable_by: EmbeddableBy;
	genre: string;
	has_downloads_left: boolean;
	id: number;
	kind: CollectionKind;
	label_name: null | string;
	last_modified: string;
	license: License;
	likes_count: number;
	permalink: string;
	permalink_url: string;
	playback_count: number;
	public: boolean;
	publisher_metadata: PublisherMetadata | null;
	purchase_title: null;
	purchase_url: null;
	release_date: null;
	reposts_count: number;
	secret_token: null;
	sharing: Sharing;
	state: State;
	streamable: boolean;
	tag_list: string;
	title: string;
	track_format: TrackFormat;
	uri: string;
	urn: string;
	user_id: number;
	visuals: null;
	waveform_url: string;
	display_date: string;
	media: Media;
	monetization_model: MonetizationModel;
	policy: Policy;
	user: User;
}

export enum EmbeddableBy {
	All = 'all',
}

export enum CollectionKind {
	Track = 'track',
}

export enum License {
	AllRightsReserved = 'all-rights-reserved',
}

export interface Media {
	transcodings: Transcoding[];
}

export interface Format {
	protocol: Protocol;
	mime_type: MIMEType;
}

export enum MIMEType {
	AudioMPEG = 'audio/mpeg',
	AudioOggCodecsOpus = 'audio/ogg; codecs="opus"',
}

export enum Protocol {
	HLS = 'hls',
	Progressive = 'progressive',
}

export enum Preset {
	Mp30_0 = 'mp3_0_0',
	Mp30_1 = 'mp3_0_1',
	Opus0_0 = 'opus_0_0',
}

export enum Quality {
	Sq = 'sq',
}

export enum MonetizationModel {
	Blackbox = 'BLACKBOX',
	NotApplicable = 'NOT_APPLICABLE',
}

export enum Policy {
	Allow = 'ALLOW',
	Monetize = 'MONETIZE',
}

export enum Sharing {
	Public = 'public',
}

export enum State {
	Finished = 'finished',
}

export enum TrackFormat {
	SingleTrack = 'single-track',
}

export interface Badges {
	pro: boolean;
	pro_unlimited: boolean;
	verified: boolean;
}

export interface Product {
	id: ID;
}

export enum ID {
	CreatorProUnlimited = 'creator-pro-unlimited',
	Free = 'free',
}

export enum UserKind {
	User = 'user',
}

export interface Visual {
	urn: string;
	entry_time: number;
	visual_url: string;
}
