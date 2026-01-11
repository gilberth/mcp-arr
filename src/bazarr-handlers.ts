/**
 * Bazarr MCP Tool Handlers
 * 
 * Handles execution of Bazarr MCP tools.
 */

import { BazarrClient } from "./bazarr-client.js";

export async function handleBazarrTool(
  client: BazarrClient,
  toolName: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    // Status & System
    case "bazarr_get_status": {
      const status = await client.getStatus();
      return JSON.stringify({
        bazarr_version: status.bazarr_version,
        sonarr_version: status.sonarr_version || "Not connected",
        radarr_version: status.radarr_version || "Not connected",
        operating_system: status.operating_system,
        python_version: status.python_version,
        timezone: status.timezone,
        uptime_since: new Date(status.start_time * 1000).toISOString(),
      }, null, 2);
    }

    case "bazarr_get_badges": {
      const badges = await client.getBadges();
      return JSON.stringify({
        missing_episode_subtitles: badges.episodes,
        missing_movie_subtitles: badges.movies,
        provider_issues: badges.providers,
        health_issues: badges.status,
        sonarr_connection: badges.sonarr_signalr || "Disconnected",
        radarr_connection: badges.radarr_signalr || "Disconnected",
        announcements: badges.announcements,
      }, null, 2);
    }

    case "bazarr_get_health": {
      const health = await client.getHealth();
      if (health.length === 0) {
        return JSON.stringify({ status: "healthy", issues: [] }, null, 2);
      }
      return JSON.stringify({ status: "issues_found", issues: health }, null, 2);
    }

    case "bazarr_get_languages": {
      const enabledOnly = args.enabledOnly !== false;
      const languages = enabledOnly 
        ? await client.getEnabledLanguages()
        : await client.getLanguages();
      
      return JSON.stringify({
        count: languages.length,
        languages: languages.map(lang => ({
          name: lang.name,
          code2: lang.code2,
          code3: lang.code3,
          enabled: lang.enabled,
        })),
      }, null, 2);
    }

    case "bazarr_get_tasks": {
      const tasks = await client.getTasks();
      return JSON.stringify({
        tasks: tasks.map(task => ({
          id: task.job_id,
          name: task.name,
          interval: task.interval,
          next_run: task.next_run_in,
          running: task.job_running,
        })),
      }, null, 2);
    }

    case "bazarr_run_task": {
      const taskId = args.taskId as string;
      await client.runTask(taskId);
      return JSON.stringify({ success: true, message: `Task '${taskId}' has been triggered` }, null, 2);
    }

    // Series (TV Shows)
    case "bazarr_get_series": {
      const series = await client.getSeries();
      return JSON.stringify({
        count: series.length,
        series: series.map(s => ({
          id: s.sonarrSeriesId,
          title: s.title,
          year: s.year,
          type: s.seriesType,
          monitored: s.monitored,
          ended: s.ended,
          episode_count: s.episodeFileCount,
          missing_subtitles: s.episodeMissingCount,
          path: s.path,
        })),
      }, null, 2);
    }

    case "bazarr_get_series_details": {
      const seriesId = args.seriesId as number;
      const series = await client.getSeriesById(seriesId);
      const episodes = await client.getEpisodes(seriesId);
      
      const missingEpisodes = episodes.filter(e => e.missing_subtitles.length > 0);
      
      return JSON.stringify({
        id: series.sonarrSeriesId,
        title: series.title,
        year: series.year,
        type: series.seriesType,
        overview: series.overview,
        monitored: series.monitored,
        ended: series.ended,
        path: series.path,
        imdb: series.imdbId,
        tvdb: series.tvdbId,
        episode_count: series.episodeFileCount,
        missing_subtitle_count: series.episodeMissingCount,
        episodes_with_missing_subtitles: missingEpisodes.map(e => ({
          season: e.season,
          episode: e.episode,
          title: e.title,
          missing_languages: e.missing_subtitles.map(s => s.name),
        })),
      }, null, 2);
    }

    case "bazarr_get_episodes": {
      const seriesId = args.seriesId as number;
      const episodes = await client.getEpisodes(seriesId);
      
      return JSON.stringify({
        count: episodes.length,
        episodes: episodes.map(e => ({
          id: e.sonarrEpisodeId,
          season: e.season,
          episode: e.episode,
          title: e.title,
          monitored: e.monitored,
          subtitles: e.subtitles.map(s => ({
            language: s.name,
            forced: s.forced,
            hi: s.hi,
          })),
          missing_subtitles: e.missing_subtitles.map(s => ({
            language: s.name,
            forced: s.forced,
            hi: s.hi,
          })),
          audio_languages: e.audio_language.map(a => a.name),
        })),
      }, null, 2);
    }

    case "bazarr_get_wanted_episodes": {
      const page = (args.page as number) || 1;
      const pageSize = (args.pageSize as number) || 50;
      const result = await client.getWantedEpisodes(page, pageSize);
      
      return JSON.stringify({
        total: result.total,
        page,
        pageSize,
        episodes: result.data.map(e => ({
          series_id: e.sonarrSeriesId,
          episode_id: e.sonarrEpisodeId,
          series_title: e.seriesTitle,
          episode_number: e.episode_number,
          episode_title: e.episodeTitle,
          type: e.seriesType,
          missing_languages: e.missing_subtitles.map(s => s.name),
        })),
      }, null, 2);
    }

    case "bazarr_search_episode_subtitles": {
      const episodeId = args.episodeId as number;
      const language = args.language as string;
      const results = await client.searchEpisodeSubtitles(episodeId, language);
      
      return JSON.stringify({
        count: results.length,
        results: results.map(r => ({
          provider: r.provider,
          language: r.language.name,
          release: r.release_info,
          score: r.score,
          uploader: r.uploader,
          hearing_impaired: r.hearing_impaired,
          forced: r.forced,
          subtitle_id: r.subtitle,
        })),
      }, null, 2);
    }

    case "bazarr_download_episode_subtitle": {
      const episodeId = args.episodeId as number;
      const provider = args.provider as string;
      const subtitle = args.subtitle as string;
      const language = args.language as string;
      const forced = (args.forced as boolean) || false;
      const hi = (args.hi as boolean) || false;
      
      await client.downloadEpisodeSubtitle(episodeId, provider, subtitle, language, forced, hi);
      return JSON.stringify({ 
        success: true, 
        message: `Subtitle download initiated for episode ${episodeId}`,
        language,
        provider,
      }, null, 2);
    }

    case "bazarr_search_missing_episode_subtitles": {
      const seriesId = args.seriesId as number | undefined;
      await client.searchMissingEpisodeSubtitles(seriesId);
      
      const message = seriesId 
        ? `Search triggered for missing subtitles in series ${seriesId}`
        : "Search triggered for all missing episode subtitles";
      
      return JSON.stringify({ success: true, message }, null, 2);
    }

    // Movies
    case "bazarr_get_movies": {
      const movies = await client.getMovies();
      return JSON.stringify({
        count: movies.length,
        movies: movies.map(m => ({
          id: m.radarrId,
          title: m.title,
          year: m.year,
          monitored: m.monitored,
          has_subtitles: m.subtitles.length > 0,
          subtitle_languages: m.subtitles.map(s => s.name),
          missing_languages: m.missing_subtitles.map(s => s.name),
          path: m.path,
        })),
      }, null, 2);
    }

    case "bazarr_get_movie_details": {
      const movieId = args.movieId as number;
      const movie = await client.getMovieById(movieId);
      
      return JSON.stringify({
        id: movie.radarrId,
        title: movie.title,
        year: movie.year,
        overview: movie.overview,
        monitored: movie.monitored,
        path: movie.path,
        imdb: movie.imdbId,
        tmdb: movie.tmdbId,
        audio_languages: movie.audio_language,
        subtitles: movie.subtitles.map(s => ({
          language: s.name,
          path: s.path,
          forced: s.forced,
          hi: s.hi,
          size: s.file_size,
        })),
        missing_subtitles: movie.missing_subtitles.map(s => ({
          language: s.name,
          forced: s.forced,
          hi: s.hi,
        })),
      }, null, 2);
    }

    case "bazarr_get_wanted_movies": {
      const page = (args.page as number) || 1;
      const pageSize = (args.pageSize as number) || 50;
      const result = await client.getWantedMovies(page, pageSize);
      
      return JSON.stringify({
        total: result.total,
        page,
        pageSize,
        movies: result.data.map(m => ({
          id: m.radarrId,
          title: m.title,
          missing_languages: m.missing_subtitles.map(s => s.name),
        })),
      }, null, 2);
    }

    case "bazarr_search_movie_subtitles": {
      const movieId = args.movieId as number;
      const language = args.language as string;
      const results = await client.searchMovieSubtitles(movieId, language);
      
      return JSON.stringify({
        count: results.length,
        results: results.map(r => ({
          provider: r.provider,
          language: r.language.name,
          release: r.release_info,
          score: r.score,
          uploader: r.uploader,
          hearing_impaired: r.hearing_impaired,
          forced: r.forced,
          subtitle_id: r.subtitle,
        })),
      }, null, 2);
    }

    case "bazarr_download_movie_subtitle": {
      const movieId = args.movieId as number;
      const provider = args.provider as string;
      const subtitle = args.subtitle as string;
      const language = args.language as string;
      const forced = (args.forced as boolean) || false;
      const hi = (args.hi as boolean) || false;
      
      await client.downloadMovieSubtitle(movieId, provider, subtitle, language, forced, hi);
      return JSON.stringify({ 
        success: true, 
        message: `Subtitle download initiated for movie ${movieId}`,
        language,
        provider,
      }, null, 2);
    }

    case "bazarr_search_missing_movie_subtitles": {
      const movieId = args.movieId as number | undefined;
      await client.searchMissingMovieSubtitles(movieId);
      
      const message = movieId 
        ? `Search triggered for missing subtitles in movie ${movieId}`
        : "Search triggered for all missing movie subtitles";
      
      return JSON.stringify({ success: true, message }, null, 2);
    }

    // History
    case "bazarr_get_series_history": {
      const page = (args.page as number) || 1;
      const pageSize = (args.pageSize as number) || 50;
      const result = await client.getSeriesHistory(page, pageSize);
      
      return JSON.stringify({
        total: result.total,
        page,
        pageSize,
        history: result.data.map(h => ({
          series: h.seriesTitle,
          episode: h.episode_number,
          episode_title: h.episodeTitle,
          language: h.language?.name,
          provider: h.provider,
          action: h.action,
          description: h.description,
          timestamp: h.timestamp,
          score: h.score,
        })),
      }, null, 2);
    }

    case "bazarr_get_movie_history": {
      const page = (args.page as number) || 1;
      const pageSize = (args.pageSize as number) || 50;
      const result = await client.getMovieHistory(page, pageSize);
      
      return JSON.stringify({
        total: result.total,
        page,
        pageSize,
        history: result.data.map(h => ({
          movie: h.title,
          language: h.language?.name,
          provider: h.provider,
          action: h.action,
          description: h.description,
          timestamp: h.timestamp,
          score: h.score,
        })),
      }, null, 2);
    }

    // Sync
    case "bazarr_sync_series": {
      await client.syncSeries();
      return JSON.stringify({ success: true, message: "Series sync with Sonarr triggered" }, null, 2);
    }

    case "bazarr_sync_movies": {
      await client.syncMovies();
      return JSON.stringify({ success: true, message: "Movies sync with Radarr triggered" }, null, 2);
    }

    default:
      throw new Error(`Unknown Bazarr tool: ${toolName}`);
  }
}
