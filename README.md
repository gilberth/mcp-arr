# MCP *arr Server

[![npm version](https://img.shields.io/npm/v/@thelord/mcp-arr.svg)](https://www.npmjs.com/package/@thelord/mcp-arr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

MCP server for the [*arr media management suite](https://wiki.servarr.com/) - Sonarr, Radarr, Lidarr, Readarr, Prowlarr, [Lingarr](https://github.com/lingarr/lingarr) (subtitle translation), and [Bazarr](https://www.bazarr.media/) (subtitle management).

> **Note**: This is a fork of [mcp-arr](https://github.com/aplaceforallmystuff/mcp-arr) with added Lingarr and Bazarr integration for comprehensive subtitle management.

## Why Use This?

- **Unified media management** - Control all your *arr applications from one interface
- **Natural language queries** - Ask about your library in plain English
- **Cross-service search** - Find content across TV, movies, music, and books simultaneously
- **Download monitoring** - Check queue status and progress across all services
- **Calendar integration** - See upcoming releases for all media types
- **Configuration review** - Get AI-powered suggestions for optimizing your setup
- **Subtitle translation** - Manage Lingarr subtitle translations with AI models
- **Subtitle management** - Download and manage subtitles with Bazarr
- **Flexible configuration** - Enable only the services you use

## Features

| Category | Capabilities |
|----------|-------------|
| **Sonarr (TV)** | List series, view episodes, search shows, trigger downloads, check queue, view calendar, review setup |
| **Radarr (Movies)** | List movies, search films, trigger downloads, check queue, view releases, review setup |
| **Lidarr (Music)** | List artists, view albums, search musicians, trigger downloads, check queue, view calendar, review setup |
| **Readarr (Books)** | List authors, view books, search writers, trigger downloads, check queue, view calendar, review setup |
| **Prowlarr (Indexers)** | List indexers, search across all trackers, test health, view statistics |
| **Lingarr (Subtitles)** | Translate subtitles, view translation queue, manage requests, sync media, view statistics |
| **Bazarr (Subtitles)** | Download subtitles, manage wanted list, search providers, view history, sync with Sonarr/Radarr |
| **Cross-Service** | Status check, unified search across all configured services |
| **Configuration** | Quality profiles, download clients, naming conventions, health checks, storage info |
| **TRaSH Guides** | Reference quality profiles, custom formats, naming conventions, compare against recommendations |

## Prerequisites

- Node.js 18+
- At least one *arr application running with API access:
  - [Sonarr](https://sonarr.tv/) for TV series
  - [Radarr](https://radarr.video/) for movies
  - [Lidarr](https://lidarr.audio/) for music
  - [Readarr](https://readarr.com/) for books
  - [Prowlarr](https://prowlarr.com/) for indexer management
  - [Lingarr](https://github.com/lingarr/lingarr) for subtitle translation
  - [Bazarr](https://www.bazarr.media/) for subtitle management

## Installation

### Using npx (Recommended)

```bash
npx @thelord/mcp-arr
```

### From Source

```bash
git clone https://github.com/gilberth/mcp-arr.git
cd mcp-arr
npm install
npm run build
```

## Configuration

### Getting API Keys

Each *arr application has an API key in Settings > General > Security:

1. Open your *arr application's web interface
2. Go to **Settings** > **General**
3. Find the **API Key** under the Security section
4. Copy the API key for use in configuration

### For Claude Desktop

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "arr": {
      "command": "npx",
      "args": ["-y", "@thelord/mcp-arr"],
      "env": {
        "SONARR_URL": "http://localhost:8989",
        "SONARR_API_KEY": "your-sonarr-api-key",
        "RADARR_URL": "http://localhost:7878",
        "RADARR_API_KEY": "your-radarr-api-key",
        "LIDARR_URL": "http://localhost:8686",
        "LIDARR_API_KEY": "your-lidarr-api-key",
        "READARR_URL": "http://localhost:8787",
        "READARR_API_KEY": "your-readarr-api-key",
        "PROWLARR_URL": "http://localhost:9696",
        "PROWLARR_API_KEY": "your-prowlarr-api-key",
        "LINGARR_URL": "http://localhost:9877",
        "LINGARR_API_KEY": "your-lingarr-api-key",
        "BAZARR_URL": "http://localhost:6767",
        "BAZARR_API_KEY": "your-bazarr-api-key"
      }
    }
  }
}
```

### For Claude Code / OpenCode

Add to `~/.claude.json` or your MCP config:

```json
{
  "mcpServers": {
    "arr": {
      "command": "npx",
      "args": ["-y", "@thelord/mcp-arr"],
      "env": {
        "SONARR_URL": "http://localhost:8989",
        "SONARR_API_KEY": "your-sonarr-api-key",
        "RADARR_URL": "http://localhost:7878",
        "RADARR_API_KEY": "your-radarr-api-key",
        "LINGARR_URL": "http://localhost:9877",
        "LINGARR_API_KEY": "your-lingarr-api-key",
        "BAZARR_URL": "http://localhost:6767",
        "BAZARR_API_KEY": "your-bazarr-api-key"
      }
    }
  }
}
```

**Note**: Only configure the services you have running. The server automatically detects which services are available based on the environment variables you provide.

## Usage Examples

### Library Management
- "Show me all my TV series"
- "What movies do I have in Radarr?"
- "List all artists in my music library"
- "How many books do I have by this author?"

### Searching for Content
- "Search for sci-fi shows on Sonarr"
- "Find action movies from the 90s"
- "Search for jazz albums"
- "Look up fantasy book series"

### Download Queue
- "What's downloading right now?"
- "Check the Sonarr queue"
- "Show Radarr download progress"

### Upcoming Releases
- "What TV episodes are coming this week?"
- "Show upcoming movie releases"
- "Any new albums coming out this month?"
- "Show me upcoming book releases"

### Downloading Content
- "What episodes of this show am I missing?"
- "Download the missing episodes for that series"
- "Search for this specific movie"
- "Grab that album I'm missing"
- "Download all missing books for this author"

### Indexer Management
- "Are my indexers healthy?"
- "How are my indexers performing?"
- "Test all my Prowlarr indexers"

### Subtitle Translation (Lingarr)
- "What movies have untranslated subtitles?"
- "Show me shows that need subtitle translation"
- "Translate the French subtitles for this movie to English"
- "What's the current translation queue?"
- "Show translation statistics"
- "Cancel that translation request"
- "Sync movies from Radarr to Lingarr"

### Subtitle Management (Bazarr)
- "What episodes are missing subtitles?"
- "Show me movies that need subtitles"
- "Search for Spanish subtitles for this movie"
- "Download English subtitles for this episode"
- "Show the subtitle download history"
- "What are the available languages in Bazarr?"
- "Sync series from Sonarr to Bazarr"
- "Check the Bazarr health status"

### Configuration Review
- "Review my Sonarr setup and suggest improvements"
- "Show me my quality profiles in Radarr"
- "Are there any health issues with my Lidarr?"
- "What naming convention am I using for TV shows?"
- "Help me understand my quality profiles - why am I not getting 4K?"
- "Check my download client configuration"
- "How much free space do I have on my root folders?"

### Cross-Service
- "Check status of all my *arr services"
- "Search for 'comedy' across all services"

## Available Tools

### General Tools

| Tool | Description |
|------|-------------|
| `arr_status` | Get connection status for all configured *arr services |
| `arr_search_all` | Search across all configured services simultaneously |

### Sonarr Tools (TV)

| Tool | Description |
|------|-------------|
| `sonarr_get_series` | List all TV series in your library |
| `sonarr_search` | Search for TV series to add |
| `sonarr_get_queue` | View current download queue |
| `sonarr_get_calendar` | See upcoming episodes |
| `sonarr_get_episodes` | List episodes for a series (shows missing vs available) |
| `sonarr_search_missing` | Trigger search for all missing episodes in a series |
| `sonarr_search_episode` | Trigger search for specific episode(s) |

### Radarr Tools (Movies)

| Tool | Description |
|------|-------------|
| `radarr_get_movies` | List all movies in your library |
| `radarr_search` | Search for movies to add |
| `radarr_get_queue` | View current download queue |
| `radarr_get_calendar` | See upcoming releases |
| `radarr_search_movie` | Trigger search to download a movie in your library |

### Lidarr Tools (Music)

| Tool | Description |
|------|-------------|
| `lidarr_get_artists` | List all artists in your library |
| `lidarr_search` | Search for artists to add |
| `lidarr_get_queue` | View current download queue |
| `lidarr_get_albums` | List albums for an artist (shows missing vs available) |
| `lidarr_search_album` | Trigger search for a specific album |
| `lidarr_search_missing` | Trigger search for all missing albums for an artist |
| `lidarr_get_calendar` | See upcoming album releases |

### Readarr Tools (Books)

| Tool | Description |
|------|-------------|
| `readarr_get_authors` | List all authors in your library |
| `readarr_search` | Search for authors to add |
| `readarr_get_queue` | View current download queue |
| `readarr_get_books` | List books for an author (shows missing vs available) |
| `readarr_search_book` | Trigger search for specific book(s) |
| `readarr_search_missing` | Trigger search for all missing books for an author |
| `readarr_get_calendar` | See upcoming book releases |

### Prowlarr Tools (Indexers)

| Tool | Description |
|------|-------------|
| `prowlarr_get_indexers` | List all configured indexers |
| `prowlarr_search` | Search across all indexers |
| `prowlarr_test_indexers` | Test all indexers and return health status |
| `prowlarr_get_stats` | Get indexer statistics (queries, grabs, failures) |

### Lingarr Tools (Subtitle Translation)

| Tool | Description |
|------|-------------|
| `lingarr_get_movies` | List movies with translation status (translated, pending, untranslated) |
| `lingarr_get_shows` | List TV shows with translation status |
| `lingarr_get_statistics` | Get translation statistics (totals, by language, by status) |
| `lingarr_get_daily_statistics` | Get daily translation statistics for a date range |
| `lingarr_get_languages` | List available source and target languages |
| `lingarr_get_models` | List available AI translation models |
| `lingarr_get_translation_requests` | View translation request queue with filtering |
| `lingarr_get_active_translations` | Get currently active/in-progress translations |
| `lingarr_translate_subtitle` | Start a subtitle translation job |
| `lingarr_cancel_translation` | Cancel a pending or in-progress translation |
| `lingarr_retry_translation` | Retry a failed translation request |
| `lingarr_get_subtitles` | Get subtitle files for a specific media path |
| `lingarr_get_jobs` | List scheduled jobs and their status |
| `lingarr_run_automation` | Manually trigger the automated translation job |
| `lingarr_sync_media` | Sync movies or shows from Radarr/Sonarr |
| `lingarr_exclude_media` | Toggle exclusion of media from automatic translation |
| `lingarr_get_version` | Get Lingarr version information |

### Bazarr Tools (Subtitle Management)

| Tool | Description |
|------|-------------|
| `bazarr_get_status` | Get Bazarr system status including version and connected services |
| `bazarr_get_badges` | Get badge counts showing missing subtitles and connection status |
| `bazarr_get_health` | Get health check results showing any issues |
| `bazarr_get_languages` | List available languages (optionally filter to enabled only) |
| `bazarr_get_tasks` | List scheduled tasks with their status and next run time |
| `bazarr_run_task` | Manually trigger a scheduled task |
| `bazarr_get_series` | List TV series with subtitle status and missing counts |
| `bazarr_get_series_details` | Get detailed info about a specific series including episodes |
| `bazarr_get_episodes` | Get episodes for a series with subtitle status |
| `bazarr_get_wanted_episodes` | List episodes with missing subtitles (wanted list) |
| `bazarr_search_episode_subtitles` | Search for available subtitles for an episode |
| `bazarr_download_episode_subtitle` | Download a specific subtitle for an episode |
| `bazarr_search_missing_episode_subtitles` | Trigger search for missing episode subtitles |
| `bazarr_get_movies` | List movies with subtitle status |
| `bazarr_get_movie_details` | Get detailed info about a specific movie |
| `bazarr_get_wanted_movies` | List movies with missing subtitles (wanted list) |
| `bazarr_search_movie_subtitles` | Search for available subtitles for a movie |
| `bazarr_download_movie_subtitle` | Download a specific subtitle for a movie |
| `bazarr_search_missing_movie_subtitles` | Trigger search for missing movie subtitles |
| `bazarr_get_series_history` | Get subtitle download history for series |
| `bazarr_get_movie_history` | Get subtitle download history for movies |
| `bazarr_sync_series` | Trigger a sync of TV series from Sonarr |
| `bazarr_sync_movies` | Trigger a sync of movies from Radarr |

### Configuration Review Tools

These tools are available for Sonarr, Radarr, Lidarr, and Readarr. Replace `{service}` with the service name (e.g., `sonarr_get_quality_profiles`).

| Tool | Description |
|------|-------------|
| `{service}_get_quality_profiles` | Detailed quality profile information with allowed qualities and custom format scores |
| `{service}_get_health` | Health check warnings and issues detected by the application |
| `{service}_get_root_folders` | Storage paths, free space, and accessibility status |
| `{service}_get_download_clients` | Download client configurations and settings |
| `{service}_get_naming` | File and folder naming conventions |
| `{service}_get_tags` | Tag definitions for content organization |
| `{service}_review_setup` | **Comprehensive configuration dump for AI-assisted setup analysis** |

The `{service}_review_setup` tool returns all configuration in a single call, enabling natural language conversations about optimizing your setup. Claude can analyze your quality profiles, suggest improvements, explain why certain content isn't being grabbed, and help configure complex settings like custom formats.

> **Disclaimer**: The configuration review tools provide **read-only** access to your *arr settings. Any changes to your configuration must be made directly in the *arr application interfaces. The AI's suggestions are recommendations only - always back up your configuration before making significant changes.

### TRaSH Guides Tools

Access community-curated quality profiles, custom formats, and naming conventions from [TRaSH Guides](https://trash-guides.info/) directly through Claude. These tools work without any *arr configuration - they fetch reference data from the TRaSH Guides GitHub repository.

| Tool | Description |
|------|-------------|
| `trash_list_profiles` | List available TRaSH quality profiles for Radarr or Sonarr |
| `trash_get_profile` | Get detailed profile with custom formats, scores, and quality settings |
| `trash_list_custom_formats` | List custom formats with optional category filter (hdr, audio, resolution, etc.) |
| `trash_get_naming` | Get recommended naming conventions for Plex, Emby, Jellyfin, or standard |
| `trash_get_quality_sizes` | Get recommended min/max/preferred sizes for each quality level |
| `trash_compare_profile` | Compare your profile against TRaSH recommendations (requires *arr configured) |
| `trash_compare_naming` | Compare your naming config against TRaSH recommendations (requires *arr configured) |

**Example usage:**
- "What quality profiles does TRaSH recommend for 4K movies?"
- "Show me the remux-web-1080p profile details"
- "Compare my Radarr profile 4 against the TRaSH uhd-bluray-web profile"
- "What naming convention should I use for Plex?"
- "List HDR-related custom formats for Radarr"

Data is cached for 1 hour to minimize GitHub API calls.

## Development

```bash
# Watch mode for development
npm run watch

# Build TypeScript
npm run build

# Run locally
SONARR_URL="http://localhost:8989" SONARR_API_KEY="your-key" node dist/index.js
```

## Troubleshooting

### "No *arr services configured"
Ensure you have set at least one pair of URL and API_KEY environment variables:
```bash
SONARR_URL="http://localhost:8989"
SONARR_API_KEY="your-api-key"
```

### "API error: 401 Unauthorized"
The API key is incorrect. Verify it in your *arr application under Settings > General > Security.

### "fetch failed" or "ECONNREFUSED"
The *arr application is not running or the URL is incorrect. Verify:
- The application is running
- The URL and port are correct
- There's no firewall blocking the connection

### "Sonarr/Radarr/etc not configured"
You tried to use a tool for a service that isn't configured. Add the corresponding URL and API_KEY environment variables.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](LICENSE) for details.

## Credits

This project is a fork of [mcp-arr](https://github.com/aplaceforallmystuff/mcp-arr) by Jim Christian, with added Lingarr and Bazarr integration for comprehensive subtitle management.

## Links

- [npm Package](https://www.npmjs.com/package/@thelord/mcp-arr)
- [GitHub Repository](https://github.com/gilberth/mcp-arr)
- [Servarr Wiki](https://wiki.servarr.com/) - Documentation for all *arr applications
- [TRaSH Guides](https://trash-guides.info/) - Quality profiles, custom formats, and setup guides
- [Lingarr](https://github.com/lingarr/lingarr) - Subtitle translation service
- [Bazarr](https://www.bazarr.media/) - Subtitle management companion
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Original mcp-arr](https://github.com/aplaceforallmystuff/mcp-arr) - Original project by Jim Christian
