/**
 * Lingarr API Client
 *
 * Lingarr is an application that leverages translation technologies to
 * automatically translate subtitle files to your desired target language.
 *
 * API Authentication: X-Api-Key header
 */

export interface LingarrConfig {
  url: string;
  apiKey: string;
}

// Enums
export enum MediaType {
  Movie = 0,
  Show = 1,
  Season = 2,
  Episode = 3,
}

export enum TranslationStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
  Failed = 3,
  Cancelled = 4,
  Interrupted = 5,
}

// Entities
export interface LingarrImage {
  id: number;
  type: string;
  path: string;
  showId: number | null;
  movieId: number | null;
}

export interface LingarrMovie {
  id: number;
  radarrId: number;
  title: string;
  fileName: string | null;
  path: string | null;
  mediaHash: string;
  dateAdded: string | null;
  images: LingarrImage[];
  excludeFromTranslation: boolean;
  translationAgeThreshold: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface LingarrEpisode {
  id: number;
  sonarrId: number;
  episodeNumber: number;
  title: string;
  fileName: string;
  path: string;
  mediaHash: string;
  dateAdded: string | null;
  seasonId: number;
  excludeFromTranslation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LingarrSeason {
  id: number;
  seasonNumber: number;
  path: string;
  episodes: LingarrEpisode[];
  showId: number;
  excludeFromTranslation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LingarrShow {
  id: number;
  sonarrId: number;
  title: string;
  path: string;
  dateAdded: string | null;
  images: LingarrImage[];
  seasons: LingarrSeason[];
  excludeFromTranslation: boolean;
  translationAgeThreshold: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationRequest {
  id: number;
  jobId: string | null;
  mediaId: number | null;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  subtitleToTranslate: string | null;
  translatedSubtitle: string | null;
  mediaType: MediaType;
  status: TranslationStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LingarrStatistics {
  id: number;
  totalLinesTranslated: number;
  totalFilesTranslated: number;
  totalCharactersTranslated: number;
  totalMovies: number;
  totalEpisodes: number;
  totalSubtitles: number;
  translationsByMediaType: Record<string, number>;
  translationsByService: Record<string, number>;
  subtitlesByLanguage: Record<string, number>;
  translationsByModel: Record<string, number>;
}

export interface DailyStatistics {
  id: number;
  date: string;
  translationCount: number;
}

export interface RecurringJobStatus {
  id: string;
  cron: string;
  queue: string;
  jobMethod: string;
  nextExecution: string | null;
  lastJobId: string | null;
  lastJobState: string | null;
  lastExecution: string | null;
  createdAt: string | null;
  timeZoneId: string | null;
  currentState: string;
  isCurrentlyRunning: boolean;
  currentJobId: string | null;
}

export interface VersionInfo {
  newVersion: boolean;
  currentVersion: string;
  latestVersion: string;
}

export interface SourceLanguage {
  name: string;
  code: string;
  targets: string[];
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface Subtitle {
  path: string;
  fileName: string;
  language: string;
  caption: string;
  format: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// Request types
export interface TranslateFileRequest {
  mediaId: number;
  subtitlePath: string;
  sourceLanguage: string;
  targetLanguage: string;
  mediaType: MediaType;
  subtitleFormat: string;
}

export interface TranslateLineRequest {
  subtitleLine: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextLinesBefore?: string[];
  contextLinesAfter?: string[];
}

export interface ExcludeRequest {
  mediaType: MediaType;
  id: number;
}

export interface ThresholdRequest {
  mediaType: MediaType;
  id: number;
  hours: number;
}

export class LingarrClient {
  private config: LingarrConfig;

  constructor(config: LingarrConfig) {
    this.config = {
      url: config.url.replace(/\/$/, ''),
      apiKey: config.apiKey,
    };
  }

  /**
   * Make an API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.url}/api${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.config.apiKey,
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Lingarr API error: ${response.status} ${response.statusText} - ${text}`
      );
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  }

  // ============ Version & Health ============

  /**
   * Get version info and check for updates
   */
  async getVersion(): Promise<VersionInfo> {
    return this.request<VersionInfo>('/Version');
  }

  /**
   * Check if authenticated (connection test)
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.request<{ authenticated: boolean }>('/Auth/authenticated');
      return true;
    } catch {
      return false;
    }
  }

  // ============ Media ============

  /**
   * Get movies with pagination
   */
  async getMovies(
    pageNumber = 1,
    pageSize = 20,
    searchQuery?: string,
    orderBy?: string,
    ascending = true
  ): Promise<PagedResult<LingarrMovie>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ascending: ascending.toString(),
    });
    if (searchQuery) params.append('searchQuery', searchQuery);
    if (orderBy) params.append('orderBy', orderBy);

    return this.request<PagedResult<LingarrMovie>>(
      `/Media/movies?${params.toString()}`
    );
  }

  /**
   * Get shows with pagination
   */
  async getShows(
    pageNumber = 1,
    pageSize = 20,
    searchQuery?: string,
    orderBy?: string,
    ascending = true
  ): Promise<PagedResult<LingarrShow>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
      ascending: ascending.toString(),
    });
    if (searchQuery) params.append('searchQuery', searchQuery);
    if (orderBy) params.append('orderBy', orderBy);

    return this.request<PagedResult<LingarrShow>>(
      `/Media/shows?${params.toString()}`
    );
  }

  /**
   * Exclude or include media from translation
   */
  async setExcludeMedia(
    mediaType: MediaType,
    id: number
  ): Promise<void> {
    await this.request<void>('/Media/exclude', {
      method: 'POST',
      body: JSON.stringify({ mediaType, id } as ExcludeRequest),
    });
  }

  /**
   * Set translation age threshold for media
   */
  async setTranslationThreshold(
    mediaType: MediaType,
    id: number,
    hours: number
  ): Promise<void> {
    await this.request<void>('/Media/threshold', {
      method: 'POST',
      body: JSON.stringify({ mediaType, id, hours } as ThresholdRequest),
    });
  }

  // ============ Translation ============

  /**
   * Translate a subtitle file
   */
  async translateFile(request: TranslateFileRequest): Promise<void> {
    await this.request<void>('/Translate/file', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Translate a single subtitle line
   */
  async translateLine(request: TranslateLineRequest): Promise<string> {
    return this.request<string>('/Translate/line', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get available source languages with their target languages
   */
  async getLanguages(): Promise<SourceLanguage[]> {
    return this.request<SourceLanguage[]>('/Translate/languages');
  }

  /**
   * Get available AI models for translation
   */
  async getModels(): Promise<LabelValue[]> {
    return this.request<LabelValue[]>('/Translate/models');
  }

  // ============ Translation Requests ============

  /**
   * Get count of active translations
   */
  async getActiveTranslationsCount(): Promise<number> {
    return this.request<number>('/TranslationRequest/active');
  }

  /**
   * Get translation requests with pagination
   */
  async getTranslationRequests(
    pageNumber = 1,
    pageSize = 20
  ): Promise<PagedResult<TranslationRequest>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    return this.request<PagedResult<TranslationRequest>>(
      `/TranslationRequest/requests?${params.toString()}`
    );
  }

  /**
   * Cancel a translation request
   */
  async cancelTranslation(id: number): Promise<void> {
    await this.request<void>('/TranslationRequest/cancel', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  /**
   * Remove a translation request
   */
  async removeTranslation(id: number): Promise<void> {
    await this.request<void>('/TranslationRequest/remove', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  /**
   * Retry a failed translation request
   */
  async retryTranslation(id: number): Promise<void> {
    await this.request<void>('/TranslationRequest/retry', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  }

  // ============ Subtitles ============

  /**
   * Get all subtitles for a given path
   */
  async getSubtitles(path: string): Promise<Subtitle[]> {
    return this.request<Subtitle[]>('/Subtitle/all', {
      method: 'POST',
      body: JSON.stringify({ path }),
    });
  }

  // ============ Statistics ============

  /**
   * Get general statistics
   */
  async getStatistics(): Promise<LingarrStatistics> {
    return this.request<LingarrStatistics>('/Statistics');
  }

  /**
   * Get daily statistics
   */
  async getDailyStatistics(days = 30): Promise<DailyStatistics[]> {
    return this.request<DailyStatistics[]>(`/Statistics/daily/${days}`);
  }

  /**
   * Reset statistics
   */
  async resetStatistics(): Promise<void> {
    await this.request<void>('/Statistics/reset', { method: 'POST' });
  }

  // ============ Schedule / Jobs ============

  /**
   * Get all scheduled jobs
   */
  async getJobs(): Promise<RecurringJobStatus[]> {
    return this.request<RecurringJobStatus[]>('/Schedule/jobs');
  }

  /**
   * Start a job by name
   */
  async startJob(jobName: string): Promise<void> {
    await this.request<void>('/Schedule/job/start', {
      method: 'POST',
      body: JSON.stringify({ jobName }),
    });
  }

  /**
   * Run automated translation job
   */
  async runAutomatedTranslation(): Promise<void> {
    await this.request<void>('/Schedule/job/automation');
  }

  /**
   * Sync movies from Radarr
   */
  async syncMovies(): Promise<void> {
    await this.request<void>('/Schedule/job/movie');
  }

  /**
   * Sync shows from Sonarr
   */
  async syncShows(): Promise<void> {
    await this.request<void>('/Schedule/job/show');
  }

  /**
   * Remove a job from queue
   */
  async removeJob(jobId: string): Promise<void> {
    await this.request<void>(`/Schedule/job/remove/${encodeURIComponent(jobId)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Reindex movies
   */
  async reindexMovies(): Promise<void> {
    await this.request<void>('/Schedule/job/index/movies', { method: 'POST' });
  }

  /**
   * Reindex shows
   */
  async reindexShows(): Promise<void> {
    await this.request<void>('/Schedule/job/index/shows', { method: 'POST' });
  }

  // ============ Settings ============

  /**
   * Get a setting value
   */
  async getSetting(key: string): Promise<string> {
    return this.request<string>(`/Setting/${encodeURIComponent(key)}`);
  }

  /**
   * Get multiple settings
   */
  async getSettings(keys: string[]): Promise<Record<string, string>> {
    return this.request<Record<string, string>>('/Setting/multiple/get', {
      method: 'POST',
      body: JSON.stringify(keys),
    });
  }

  /**
   * Set a setting value
   */
  async setSetting(key: string, value: string): Promise<void> {
    await this.request<void>('/Setting', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  /**
   * Set multiple settings
   */
  async setSettings(settings: Record<string, string>): Promise<void> {
    await this.request<void>('/Setting/multiple/set', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }
}
