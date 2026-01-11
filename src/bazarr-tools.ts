/**
 * Bazarr MCP Tool Definitions
 * 
 * Defines all the MCP tools available for Bazarr subtitle management.
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const bazarrTools: Tool[] = [
  // Status & System
  {
    name: "bazarr_get_status",
    description: "Get Bazarr system status including version info, connected services (Sonarr/Radarr), and system details",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_get_badges",
    description: "Get Bazarr badge counts showing missing subtitles for episodes and movies, and connection status",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_get_health",
    description: "Get Bazarr health check results showing any issues or warnings",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_get_languages",
    description: "Get list of available languages in Bazarr, optionally filtered to only enabled languages",
    inputSchema: {
      type: "object",
      properties: {
        enabledOnly: {
          type: "boolean",
          description: "If true, only return enabled languages (default: true)",
        },
      },
      required: [],
    },
  },
  {
    name: "bazarr_get_tasks",
    description: "Get list of scheduled tasks in Bazarr with their status and next run time",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_run_task",
    description: "Manually trigger a scheduled task in Bazarr",
    inputSchema: {
      type: "object",
      properties: {
        taskId: {
          type: "string",
          description: "The task ID to run (e.g., 'update_series', 'wanted_search_missing_subtitles_series')",
        },
      },
      required: ["taskId"],
    },
  },

  // Series (TV Shows)
  {
    name: "bazarr_get_series",
    description: "Get list of TV series in Bazarr with their subtitle status and missing counts",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_get_series_details",
    description: "Get detailed information about a specific TV series including episodes",
    inputSchema: {
      type: "object",
      properties: {
        seriesId: {
          type: "number",
          description: "The Sonarr series ID",
        },
      },
      required: ["seriesId"],
    },
  },
  {
    name: "bazarr_get_episodes",
    description: "Get episodes for a TV series with their subtitle status",
    inputSchema: {
      type: "object",
      properties: {
        seriesId: {
          type: "number",
          description: "The Sonarr series ID",
        },
      },
      required: ["seriesId"],
    },
  },
  {
    name: "bazarr_get_wanted_episodes",
    description: "Get list of episodes with missing subtitles (wanted list)",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 50)",
        },
      },
      required: [],
    },
  },
  {
    name: "bazarr_search_episode_subtitles",
    description: "Search for available subtitles for a specific episode",
    inputSchema: {
      type: "object",
      properties: {
        episodeId: {
          type: "number",
          description: "The Sonarr episode ID",
        },
        language: {
          type: "string",
          description: "Language code (e.g., 'en', 'es', 'pt')",
        },
      },
      required: ["episodeId", "language"],
    },
  },
  {
    name: "bazarr_download_episode_subtitle",
    description: "Download a specific subtitle for an episode",
    inputSchema: {
      type: "object",
      properties: {
        episodeId: {
          type: "number",
          description: "The Sonarr episode ID",
        },
        provider: {
          type: "string",
          description: "The subtitle provider name",
        },
        subtitle: {
          type: "string",
          description: "The subtitle identifier from search results",
        },
        language: {
          type: "string",
          description: "Language code (e.g., 'en', 'es')",
        },
        forced: {
          type: "boolean",
          description: "Download as forced subtitle (default: false)",
        },
        hi: {
          type: "boolean",
          description: "Download hearing impaired version (default: false)",
        },
      },
      required: ["episodeId", "provider", "subtitle", "language"],
    },
  },
  {
    name: "bazarr_search_missing_episode_subtitles",
    description: "Trigger a search for missing subtitles for episodes. Can search all or a specific series.",
    inputSchema: {
      type: "object",
      properties: {
        seriesId: {
          type: "number",
          description: "Optional: Sonarr series ID to limit search to specific series",
        },
      },
      required: [],
    },
  },

  // Movies
  {
    name: "bazarr_get_movies",
    description: "Get list of movies in Bazarr with their subtitle status",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_get_movie_details",
    description: "Get detailed information about a specific movie",
    inputSchema: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "The Radarr movie ID",
        },
      },
      required: ["movieId"],
    },
  },
  {
    name: "bazarr_get_wanted_movies",
    description: "Get list of movies with missing subtitles (wanted list)",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 50)",
        },
      },
      required: [],
    },
  },
  {
    name: "bazarr_search_movie_subtitles",
    description: "Search for available subtitles for a specific movie",
    inputSchema: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "The Radarr movie ID",
        },
        language: {
          type: "string",
          description: "Language code (e.g., 'en', 'es', 'pt')",
        },
      },
      required: ["movieId", "language"],
    },
  },
  {
    name: "bazarr_download_movie_subtitle",
    description: "Download a specific subtitle for a movie",
    inputSchema: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "The Radarr movie ID",
        },
        provider: {
          type: "string",
          description: "The subtitle provider name",
        },
        subtitle: {
          type: "string",
          description: "The subtitle identifier from search results",
        },
        language: {
          type: "string",
          description: "Language code (e.g., 'en', 'es')",
        },
        forced: {
          type: "boolean",
          description: "Download as forced subtitle (default: false)",
        },
        hi: {
          type: "boolean",
          description: "Download hearing impaired version (default: false)",
        },
      },
      required: ["movieId", "provider", "subtitle", "language"],
    },
  },
  {
    name: "bazarr_search_missing_movie_subtitles",
    description: "Trigger a search for missing subtitles for movies. Can search all or a specific movie.",
    inputSchema: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "Optional: Radarr movie ID to limit search to specific movie",
        },
      },
      required: [],
    },
  },

  // History
  {
    name: "bazarr_get_series_history",
    description: "Get subtitle download history for TV series",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 50)",
        },
      },
      required: [],
    },
  },
  {
    name: "bazarr_get_movie_history",
    description: "Get subtitle download history for movies",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number (default: 1)",
        },
        pageSize: {
          type: "number",
          description: "Number of results per page (default: 50)",
        },
      },
      required: [],
    },
  },

  // Sync
  {
    name: "bazarr_sync_series",
    description: "Trigger a sync of TV series from Sonarr",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "bazarr_sync_movies",
    description: "Trigger a sync of movies from Radarr",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];
