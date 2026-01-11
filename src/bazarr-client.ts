/**
 * Bazarr API Client
 * 
 * Client for interacting with Bazarr subtitle management API.
 * Bazarr is a companion application to Sonarr and Radarr that manages
 * and downloads subtitles based on your requirements.
 */

export interface BazarrConfig {
  url: string;
  apiKey: string;
}

export interface BazarrStatus {
  bazarr_version: string;
  sonarr_version: string;
  radarr_version: string;
  operating_system: string;
  python_version: string;
  start_time: number;
  timezone: string;
}

export interface BazarrLanguage {
  name: string;
  code2: string;
  code3: string;
  enabled: boolean;
}

export interface BazarrSubtitle {
  name: string;
  code2: string;
  code3: string;
  path?: string;
  forced: boolean;
  hi: boolean;
  file_size?: number;
}

export interface BazarrSeries {
  title: string;
  alternativeTitles: string[];
  path: string;
  sonarrSeriesId: number;
  tvdbId: number;
  imdbId: string;
  poster: string;
  fanart: string;
  year: string;
  overview: string;
  seriesType: string;
  monitored: boolean;
  ended: boolean;
  episodeFileCount: number;
  episodeMissingCount: number;
  profileId: number;
  tags: string[];
  audio_language: any[];
}

export interface BazarrEpisode {
  title: string;
  path: string;
  season: number;
  episode: number;
  sonarrSeriesId: number;
  sonarrEpisodeId: number;
  monitored: boolean;
  sceneName: string | null;
  subtitles: BazarrSubtitle[];
  missing_subtitles: BazarrSubtitle[];
  audio_language: { name: string; code2: string; code3: string }[];
}

export interface BazarrMovie {
  title: string;
  alternativeTitles: string[];
  path: string;
  radarrId: number;
  tmdbId: number;
  imdbId: string;
  poster: string;
  fanart: string;
  year: string;
  overview: string;
  monitored: boolean;
  profileId: number;
  tags: string[];
  subtitles: BazarrSubtitle[];
  missing_subtitles: BazarrSubtitle[];
  audio_language: any[];
  sceneName: string | null;
}

export interface BazarrWantedEpisode {
  seriesTitle: string;
  episode_number: string;
  episodeTitle: string;
  sonarrSeriesId: number;
  sonarrEpisodeId: number;
  sceneName: string | null;
  tags: string[];
  seriesType: string;
  missing_subtitles: BazarrSubtitle[];
}

export interface BazarrWantedMovie {
  title: string;
  radarrId: number;
  sceneName: string | null;
  tags: string[];
  missing_subtitles: BazarrSubtitle[];
}

export interface BazarrTask {
  job_id: string;
  name: string;
  interval: string;
  next_run_in: string;
  next_run_time: string;
  job_running: boolean;
}

export interface BazarrBadges {
  episodes: number;
  movies: number;
  providers: number;
  status: number;
  sonarr_signalr: string;
  radarr_signalr: string;
  announcements: number;
}

export interface BazarrHistoryItem {
  action: number;
  description: string;
  language: { name: string; code2: string; code3: string };
  path: string;
  provider: string;
  score: string;
  seriesTitle?: string;
  episode_number?: string;
  episodeTitle?: string;
  sonarrSeriesId?: number;
  sonarrEpisodeId?: number;
  title?: string;
  radarrId?: number;
  timestamp: string;
  upgradable: boolean;
}

export interface BazarrProvider {
  name: string;
  status: string;
  retry: string;
}

export interface SubtitleSearchResult {
  provider: string;
  release_info: string[];
  subtitle: string;
  matches: string[];
  score: number;
  uploader: string;
  url: string;
  language: { name: string; code2: string; code3: string };
  forced: boolean;
  hearing_impaired: boolean;
}

export class BazarrClient {
  private config: BazarrConfig;

  constructor(config: BazarrConfig) {
    this.config = config;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.url}/api${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${this.config.apiKey}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Bazarr API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // System endpoints
  async getStatus(): Promise<BazarrStatus> {
    const result = await this.request<{ data: BazarrStatus }>('/system/status');
    return result.data;
  }

  async getHealth(): Promise<any[]> {
    const result = await this.request<{ data: any[] }>('/system/health');
    return result.data;
  }

  async getLanguages(): Promise<BazarrLanguage[]> {
    return this.request<BazarrLanguage[]>('/system/languages');
  }

  async getEnabledLanguages(): Promise<BazarrLanguage[]> {
    const languages = await this.getLanguages();
    return languages.filter(lang => lang.enabled);
  }

  async getTasks(): Promise<BazarrTask[]> {
    const result = await this.request<{ data: BazarrTask[] }>('/system/tasks');
    return result.data;
  }

  async runTask(taskId: string): Promise<void> {
    await this.request(`/system/tasks?taskid=${taskId}`, { method: 'POST' });
  }

  async getBadges(): Promise<BazarrBadges> {
    return this.request<BazarrBadges>('/badges');
  }

  async getProviders(): Promise<BazarrProvider[]> {
    const result = await this.request<{ data: BazarrProvider[] }>('/system/providers');
    return result.data;
  }

  // Series endpoints
  async getSeries(): Promise<BazarrSeries[]> {
    const result = await this.request<{ data: BazarrSeries[]; total: number }>('/series');
    return result.data;
  }

  async getSeriesById(seriesId: number): Promise<BazarrSeries> {
    const result = await this.request<{ data: BazarrSeries[] }>(`/series?seriesid[]=${seriesId}`);
    return result.data[0];
  }

  async getEpisodes(seriesId: number): Promise<BazarrEpisode[]> {
    const result = await this.request<{ data: BazarrEpisode[] }>(`/episodes?seriesid[]=${seriesId}`);
    return result.data;
  }

  async getEpisodeById(episodeId: number): Promise<BazarrEpisode> {
    const result = await this.request<{ data: BazarrEpisode[] }>(`/episodes?episodeid[]=${episodeId}`);
    return result.data[0];
  }

  async getWantedEpisodes(page: number = 1, pageSize: number = 50): Promise<{ data: BazarrWantedEpisode[]; total: number }> {
    const start = (page - 1) * pageSize;
    return this.request<{ data: BazarrWantedEpisode[]; total: number }>(`/episodes/wanted?start=${start}&length=${pageSize}`);
  }

  async searchEpisodeSubtitles(episodeId: number, language: string): Promise<SubtitleSearchResult[]> {
    const result = await this.request<{ data: SubtitleSearchResult[] }>(
      `/providers/episodes?episodeid=${episodeId}&language=${language}`
    );
    return result.data;
  }

  async downloadEpisodeSubtitle(
    episodeId: number,
    provider: string,
    subtitle: string,
    language: string,
    forced: boolean = false,
    hi: boolean = false
  ): Promise<void> {
    await this.request('/providers/episodes', {
      method: 'POST',
      body: JSON.stringify({
        episodeid: episodeId,
        provider,
        subtitle,
        language,
        forced,
        hi,
      }),
    });
  }

  async searchMissingEpisodeSubtitles(seriesId?: number): Promise<void> {
    const endpoint = seriesId 
      ? `/episodes/subtitles?seriesid=${seriesId}`
      : '/episodes/subtitles';
    await this.request(endpoint, { method: 'POST' });
  }

  // Movie endpoints
  async getMovies(): Promise<BazarrMovie[]> {
    const result = await this.request<{ data: BazarrMovie[]; total: number }>('/movies');
    return result.data;
  }

  async getMovieById(movieId: number): Promise<BazarrMovie> {
    const result = await this.request<{ data: BazarrMovie[] }>(`/movies?radarrid[]=${movieId}`);
    return result.data[0];
  }

  async getWantedMovies(page: number = 1, pageSize: number = 50): Promise<{ data: BazarrWantedMovie[]; total: number }> {
    const start = (page - 1) * pageSize;
    return this.request<{ data: BazarrWantedMovie[]; total: number }>(`/movies/wanted?start=${start}&length=${pageSize}`);
  }

  async searchMovieSubtitles(movieId: number, language: string): Promise<SubtitleSearchResult[]> {
    const result = await this.request<{ data: SubtitleSearchResult[] }>(
      `/providers/movies?radarrid=${movieId}&language=${language}`
    );
    return result.data;
  }

  async downloadMovieSubtitle(
    movieId: number,
    provider: string,
    subtitle: string,
    language: string,
    forced: boolean = false,
    hi: boolean = false
  ): Promise<void> {
    await this.request('/providers/movies', {
      method: 'POST',
      body: JSON.stringify({
        radarrid: movieId,
        provider,
        subtitle,
        language,
        forced,
        hi,
      }),
    });
  }

  async searchMissingMovieSubtitles(movieId?: number): Promise<void> {
    const endpoint = movieId 
      ? `/movies/subtitles?radarrid=${movieId}`
      : '/movies/subtitles';
    await this.request(endpoint, { method: 'POST' });
  }

  // History endpoints
  async getSeriesHistory(page: number = 1, pageSize: number = 50): Promise<{ data: BazarrHistoryItem[]; total: number }> {
    const start = (page - 1) * pageSize;
    return this.request<{ data: BazarrHistoryItem[]; total: number }>(`/history/series?start=${start}&length=${pageSize}`);
  }

  async getMovieHistory(page: number = 1, pageSize: number = 50): Promise<{ data: BazarrHistoryItem[]; total: number }> {
    const start = (page - 1) * pageSize;
    return this.request<{ data: BazarrHistoryItem[]; total: number }>(`/history/movies?start=${start}&length=${pageSize}`);
  }

  // Sync endpoints
  async syncSeries(): Promise<void> {
    await this.runTask('update_series');
  }

  async syncMovies(): Promise<void> {
    await this.runTask('update_movies');
  }
}
