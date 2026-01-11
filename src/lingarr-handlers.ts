/**
 * Lingarr MCP Tool Handlers
 * 
 * This module contains all the handlers for Lingarr tools.
 * Separated from index.ts to reduce merge conflicts when mcp-arr updates.
 */

import { LingarrClient, MediaType as LingarrMediaType } from "./lingarr-client.js";

/**
 * Handler result type matching MCP SDK expectations
 */
export interface HandlerResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
  [key: string]: unknown; // Allow additional properties for SDK compatibility
}

/**
 * Handle Lingarr tool calls
 * @param toolName The name of the tool being called
 * @param args The arguments passed to the tool
 * @param client The LingarrClient instance
 * @returns The handler result or null if not a Lingarr tool
 */
export async function handleLingarrTool(
  toolName: string,
  args: Record<string, unknown>,
  client: LingarrClient | undefined
): Promise<HandlerResult | null> {
  // Return null if not a Lingarr tool - let other handlers process it
  if (!toolName.startsWith('lingarr_')) {
    return null;
  }

  if (!client) {
    throw new Error("Lingarr not configured");
  }

  switch (toolName) {
    case "lingarr_get_movies": {
      const { searchQuery, pageNumber, pageSize } = args as {
        searchQuery?: string;
        pageNumber?: number;
        pageSize?: number;
      };
      const movies = await client.getMovies(pageNumber, pageSize, searchQuery);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            totalCount: movies.totalCount,
            pageNumber: movies.pageNumber,
            pageSize: movies.pageSize,
            movies: movies.items.map(m => ({
              id: m.id,
              radarrId: m.radarrId,
              title: m.title,
              path: m.path,
              excludeFromTranslation: m.excludeFromTranslation,
              dateAdded: m.dateAdded,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_shows": {
      const { searchQuery, pageNumber, pageSize } = args as {
        searchQuery?: string;
        pageNumber?: number;
        pageSize?: number;
      };
      const shows = await client.getShows(pageNumber, pageSize, searchQuery);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            totalCount: shows.totalCount,
            pageNumber: shows.pageNumber,
            pageSize: shows.pageSize,
            shows: shows.items.map(s => ({
              id: s.id,
              sonarrId: s.sonarrId,
              title: s.title,
              path: s.path,
              excludeFromTranslation: s.excludeFromTranslation,
              seasonCount: s.seasons?.length || 0,
              dateAdded: s.dateAdded,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_statistics": {
      const stats = await client.getStatistics();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            totalLinesTranslated: stats.totalLinesTranslated,
            totalFilesTranslated: stats.totalFilesTranslated,
            totalCharactersTranslated: stats.totalCharactersTranslated,
            totalMovies: stats.totalMovies,
            totalEpisodes: stats.totalEpisodes,
            totalSubtitles: stats.totalSubtitles,
            translationsByMediaType: stats.translationsByMediaType,
            translationsByService: stats.translationsByService,
            subtitlesByLanguage: stats.subtitlesByLanguage,
            translationsByModel: stats.translationsByModel,
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_daily_statistics": {
      const days = (args as { days?: number })?.days || 30;
      const dailyStats = await client.getDailyStatistics(days);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            days,
            count: dailyStats.length,
            statistics: dailyStats.map(d => ({
              date: d.date,
              translationCount: d.translationCount,
            })),
            totalTranslations: dailyStats.reduce((sum, d) => sum + d.translationCount, 0),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_languages": {
      const languages = await client.getLanguages();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            count: languages.length,
            languages: languages.map(l => ({
              name: l.name,
              code: l.code,
              targetLanguages: l.targets,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_models": {
      const models = await client.getModels();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            count: models.length,
            models: models.map(m => ({
              label: m.label,
              value: m.value,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_translation_requests": {
      const { pageNumber, pageSize } = args as {
        pageNumber?: number;
        pageSize?: number;
      };
      const requests = await client.getTranslationRequests(pageNumber, pageSize);
      const statusNames = ['Pending', 'InProgress', 'Completed', 'Failed', 'Cancelled', 'Interrupted'];
      const mediaTypeNames = ['Movie', 'Show', 'Season', 'Episode'];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            totalCount: requests.totalCount,
            pageNumber: requests.pageNumber,
            pageSize: requests.pageSize,
            requests: requests.items.map(r => ({
              id: r.id,
              title: r.title,
              sourceLanguage: r.sourceLanguage,
              targetLanguage: r.targetLanguage,
              status: statusNames[r.status] || r.status,
              mediaType: mediaTypeNames[r.mediaType] || r.mediaType,
              completedAt: r.completedAt,
              createdAt: r.createdAt,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_active_translations": {
      const count = await client.getActiveTranslationsCount();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            activeTranslations: count,
          }, null, 2),
        }],
      };
    }

    case "lingarr_translate_subtitle": {
      const request = args as {
        mediaId: number;
        subtitlePath: string;
        sourceLanguage: string;
        targetLanguage: string;
        mediaType: number;
        subtitleFormat: string;
      };
      await client.translateFile({
        mediaId: request.mediaId,
        subtitlePath: request.subtitlePath,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        mediaType: request.mediaType as LingarrMediaType,
        subtitleFormat: request.subtitleFormat,
      });
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Translation job queued for ${request.subtitlePath}`,
            sourceLanguage: request.sourceLanguage,
            targetLanguage: request.targetLanguage,
          }, null, 2),
        }],
      };
    }

    case "lingarr_cancel_translation": {
      const { id } = args as { id: number };
      await client.cancelTranslation(id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Translation request ${id} cancelled`,
          }, null, 2),
        }],
      };
    }

    case "lingarr_retry_translation": {
      const { id } = args as { id: number };
      await client.retryTranslation(id);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Translation request ${id} queued for retry`,
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_subtitles": {
      const { path } = args as { path: string };
      const subtitles = await client.getSubtitles(path);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            path,
            count: subtitles.length,
            subtitles: subtitles.map(s => ({
              fileName: s.fileName,
              language: s.language,
              format: s.format,
              path: s.path,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_jobs": {
      const jobs = await client.getJobs();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            count: jobs.length,
            jobs: jobs.map(j => ({
              id: j.id,
              cron: j.cron,
              currentState: j.currentState,
              isCurrentlyRunning: j.isCurrentlyRunning,
              lastExecution: j.lastExecution,
              nextExecution: j.nextExecution,
              lastJobState: j.lastJobState,
            })),
          }, null, 2),
        }],
      };
    }

    case "lingarr_run_automation": {
      await client.runAutomatedTranslation();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: "Automated translation job triggered",
          }, null, 2),
        }],
      };
    }

    case "lingarr_sync_media": {
      const { type } = args as { type: 'movies' | 'shows' };
      if (type === 'movies') {
        await client.syncMovies();
      } else {
        await client.syncShows();
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Sync job triggered for ${type}`,
          }, null, 2),
        }],
      };
    }

    case "lingarr_exclude_media": {
      const { mediaType, id } = args as { mediaType: number; id: number };
      await client.setExcludeMedia(mediaType as LingarrMediaType, id);
      const mediaTypeNames = ['Movie', 'Show', 'Season', 'Episode'];
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Toggled exclusion for ${mediaTypeNames[mediaType] || 'media'} ID ${id}`,
          }, null, 2),
        }],
      };
    }

    case "lingarr_get_version": {
      const version = await client.getVersion();
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            currentVersion: version.currentVersion,
            latestVersion: version.latestVersion,
            updateAvailable: version.newVersion,
          }, null, 2),
        }],
      };
    }

    default:
      // This shouldn't happen since we check the prefix at the start
      return null;
  }
}

/**
 * Get Lingarr status for arr_status handler
 * @param client The LingarrClient instance
 * @returns Status object for Lingarr
 */
export async function getLingarrStatus(client: LingarrClient): Promise<{
  configured: boolean;
  connected: boolean;
  version?: string;
  appName?: string;
  updateAvailable?: boolean;
  error?: string;
}> {
  try {
    const version = await client.getVersion();
    return {
      configured: true,
      connected: true,
      version: version.currentVersion,
      appName: 'Lingarr',
      updateAvailable: version.newVersion,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
