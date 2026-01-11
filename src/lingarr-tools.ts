/**
 * Lingarr MCP Tool Definitions
 * 
 * This module contains all the tool definitions for Lingarr subtitle translation service.
 * Separated from index.ts to reduce merge conflicts when mcp-arr updates.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Get all Lingarr tool definitions
 * @returns Array of MCP Tool definitions for Lingarr
 */
export function getLingarrTools(): Tool[] {
  return [
    {
      name: "lingarr_get_movies",
      description: "Get movies in Lingarr with their subtitle translation status. Supports pagination and search.",
      inputSchema: {
        type: "object" as const,
        properties: {
          searchQuery: {
            type: "string",
            description: "Optional search term to filter movies",
          },
          pageNumber: {
            type: "number",
            description: "Page number (default: 1)",
          },
          pageSize: {
            type: "number",
            description: "Items per page (default: 20)",
          },
        },
        required: [],
      },
    },
    {
      name: "lingarr_get_shows",
      description: "Get TV shows in Lingarr with their subtitle translation status. Supports pagination and search.",
      inputSchema: {
        type: "object" as const,
        properties: {
          searchQuery: {
            type: "string",
            description: "Optional search term to filter shows",
          },
          pageNumber: {
            type: "number",
            description: "Page number (default: 1)",
          },
          pageSize: {
            type: "number",
            description: "Items per page (default: 20)",
          },
        },
        required: [],
      },
    },
    {
      name: "lingarr_get_statistics",
      description: "Get Lingarr translation statistics including total lines translated, files processed, and breakdowns by language and service.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_get_daily_statistics",
      description: "Get daily translation statistics for the specified number of days.",
      inputSchema: {
        type: "object" as const,
        properties: {
          days: {
            type: "number",
            description: "Number of days to retrieve (default: 30)",
          },
        },
        required: [],
      },
    },
    {
      name: "lingarr_get_languages",
      description: "Get available source languages and their supported target languages for translation.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_get_models",
      description: "Get available AI models for subtitle translation.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_get_translation_requests",
      description: "Get translation requests with their status (pending, in progress, completed, failed).",
      inputSchema: {
        type: "object" as const,
        properties: {
          pageNumber: {
            type: "number",
            description: "Page number (default: 1)",
          },
          pageSize: {
            type: "number",
            description: "Items per page (default: 20)",
          },
        },
        required: [],
      },
    },
    {
      name: "lingarr_get_active_translations",
      description: "Get the count of currently active (in progress) translations.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_translate_subtitle",
      description: "Start a subtitle translation job for a movie or episode.",
      inputSchema: {
        type: "object" as const,
        properties: {
          mediaId: {
            type: "number",
            description: "The Lingarr media ID",
          },
          subtitlePath: {
            type: "string",
            description: "Path to the subtitle file to translate",
          },
          sourceLanguage: {
            type: "string",
            description: "Source language code (e.g., 'en', 'es')",
          },
          targetLanguage: {
            type: "string",
            description: "Target language code (e.g., 'es', 'fr')",
          },
          mediaType: {
            type: "number",
            description: "Media type: 0=Movie, 3=Episode",
          },
          subtitleFormat: {
            type: "string",
            description: "Subtitle format (e.g., 'srt', 'ass')",
          },
        },
        required: ["mediaId", "subtitlePath", "sourceLanguage", "targetLanguage", "mediaType", "subtitleFormat"],
      },
    },
    {
      name: "lingarr_cancel_translation",
      description: "Cancel a pending or in-progress translation request.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "Translation request ID to cancel",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "lingarr_retry_translation",
      description: "Retry a failed translation request.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: {
            type: "number",
            description: "Translation request ID to retry",
          },
        },
        required: ["id"],
      },
    },
    {
      name: "lingarr_get_subtitles",
      description: "Get all subtitle files for a given media path.",
      inputSchema: {
        type: "object" as const,
        properties: {
          path: {
            type: "string",
            description: "Path to the media file or directory",
          },
        },
        required: ["path"],
      },
    },
    {
      name: "lingarr_get_jobs",
      description: "Get all scheduled jobs and their status in Lingarr.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_run_automation",
      description: "Trigger the automated translation job to process pending subtitles.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    {
      name: "lingarr_sync_media",
      description: "Sync movies or shows from Radarr/Sonarr to Lingarr.",
      inputSchema: {
        type: "object" as const,
        properties: {
          type: {
            type: "string",
            enum: ["movies", "shows"],
            description: "Type of media to sync",
          },
        },
        required: ["type"],
      },
    },
    {
      name: "lingarr_exclude_media",
      description: "Exclude or include a movie/show/season/episode from automatic translation.",
      inputSchema: {
        type: "object" as const,
        properties: {
          mediaType: {
            type: "number",
            description: "Media type: 0=Movie, 1=Show, 2=Season, 3=Episode",
          },
          id: {
            type: "number",
            description: "Media ID in Lingarr",
          },
        },
        required: ["mediaType", "id"],
      },
    },
    {
      name: "lingarr_get_version",
      description: "Get Lingarr version information and check for updates.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
  ];
}

/**
 * Check if a tool name is a Lingarr tool
 * @param toolName The tool name to check
 * @returns true if the tool is a Lingarr tool
 */
export function isLingarrTool(toolName: string): boolean {
  return toolName.startsWith('lingarr_');
}
