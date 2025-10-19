# Future Dates CJW - Obsidian Plugin

> **Note:** This is a fork of the [original Future Dates plugin](https://github.com/slonoed/obsidian-future-dates) by Dmitry Manannikov, with significant enhancements. See [FORK.md](FORK.md) for complete changelog.

![Future dates plugin screenshot that demonstrates how it works](./extra/screenshot.png "Future dates plugin screenshot")

## Overview

Future Dates CJW creates a sleek sidebar view that automatically collects and displays all links to future dates across your vault. With advanced filtering, customizable folder icons, and a redesigned interface, it's the perfect tool for tracking upcoming events, deadlines, and tasks.

## Features

### 🎨 Modern UI (v1.6.0)
- **Flat chronological list** with month grouping for easy scanning
- **Compact row layout** with adjustable spacing (1-5 scale)
- **Month section backgrounds** for visual separation
- **Clickable hyperlinks** in context display
- **Root folder display** for better navigation
- **Clean context** with markdown artifacts removed

### 🔍 Advanced Filtering (v1.6.0)
- **Named filters** to organize views by folder
- **Include/exclude folder rules** for precise control
- **Dynamic counts** showing number of dates per filter (e.g., "Work (45)")
- **Filter persistence** across sessions
- **Quick filter switching** from dropdown

### 📁 Customizable Folder Icons (v1.6.0)
- **Emoji support** - use any emoji or character (up to 3 chars)
- **Keyword-based detection** - automatic icon assignment
- **Toggle on/off** to show/hide icons
- **Pre-configured mappings** (💼 work, 🏠 personal, 📖 journal)

### ⚙️ Comprehensive Settings (v1.5.0)
- **Exclude dates with display text** - filter out navigation links
- **Navigation keyword exclusion** - configurable keyword list
- **Custom regex patterns** - advanced exclusion rules
- **Folder exclusions** - hide specific folders
- **Context length control** - adjust how much text to show
- **Show past dates toggle** - optionally include historical dates

### ✨ Core Features
- Automatically collects all future date references from your vault
- Displays dates in chronological order with context
- Real-time updates when you modify notes
- Click to navigate to dates or source files
- Clean date display (shows `2025-12-25` instead of `[[2025-12-25]]`)
- Supports both resolved and unresolved links

## Installation

### From Obsidian Community Plugins (Coming Soon)
Search for "Future Dates CJW" in Settings → Community Plugins

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/chrisweis/obsidian-future-dates-cjw/releases)
2. Create folder: `<vault>/.obsidian/plugins/future-dates-cjw/`
3. Copy the three files into that folder
4. Reload Obsidian
5. Enable the plugin in Settings → Community Plugins

## How It Works

The plugin scans both resolved and unresolved links in your vault, detecting all references to future dates using your Daily Notes format settings.

### Supported Date Formats
- Default: `[[YYYY-MM-DD]]` (e.g., `[[2025-12-25]]`)
- Custom formats from Daily Notes settings
- Works with dates that have display text (e.g., `[[2025-12-25|Christmas]]`)

### Display Structure (v1.6.0)
The modern flat list groups dates by month:

```
October 2025 [month header with light background]
  2025-10-25  Meeting about Q4 deadline          💼 Work
  2025-10-28  Dentist appointment at 2pm         🏠 Personal

November 2025 [month header with light background]
  2025-11-15  Product launch scheduled           💼 Work
  2025-11-20  Submit quarterly report            💼 Work
```

### View Filters
Create custom filters to focus on specific areas:
- **All Dates (127)** - Shows everything
- **Work (45)** - Only dates from work folders
- **Personal (23)** - Only dates from personal folders
- **Projects (18)** - Custom filter with include/exclude rules

## Usage

1. **Add date links** to your notes: `[[2025-12-25]]` or `[[2025-12-25|Christmas]]`
2. **View automatically updates** in the right sidebar
3. **Click dates** to open/create the daily note
4. **Click folders** to jump to the source note
5. **Switch filters** to focus on specific categories
6. **Adjust settings** to customize display and exclusions

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Development mode (auto-rebuild on changes)
npm run dev

# Production build
npm run build
```

### Automatic Deployment to Obsidian

For local development, you can automatically deploy to your Obsidian vault:

```bash
# 1. Copy the example config
cp deploy.config.example.json deploy.config.json

# 2. Edit deploy.config.json with your vault path
# Example: "vaultPath": "C:/Users/YourName/Documents/MyVault/.obsidian/plugins/future-dates-cjw"

# 3. Build and deploy in one command
npm run deploy

# Or deploy without rebuilding (if you just changed config)
npm run deploy:only
```

**Benefits:**
- Automatically copies `main.js`, `manifest.json`, and `styles.css` to your vault
- No manual file copying needed
- Faster development iteration
- Works with any vault location

### Project Structure

```
.
├── main.ts              # Plugin entry point
├── model.ts             # Data collection and processing
├── view.ts              # UI rendering (month grouping, filters)
├── settings.ts          # Settings UI and configuration
├── styles.css           # Custom styling
├── .specify/            # Spec-kit documentation
│   ├── memory/
│   │   └── constitution.md
│   ├── specs/
│   │   └── future-dates-core.md
│   ├── tasks/
│   │   └── current-tasks.md
│   └── plan.md
├── FORK.md              # Fork changelog
└── README.md
```

## Roadmap

**Current Version:** v1.6.0 (Stable)

**Completed:**
- ✅ Settings panel for customization (v1.5.0)
- ✅ Filtering and folder management (v1.6.0)
- ✅ UI redesign with month grouping (v1.6.0)
- ✅ Folder icons and customization (v1.6.0)

**Future Enhancements:**
- Advanced filter logic with AND/OR operators
- Mobile support for iOS/Android
- Calendar view mode
- Export functionality

See `.specify/tasks/current-tasks.md` for detailed task tracking.

## Credits

**Original Plugin:** [Future Dates](https://github.com/slonoed/obsidian-future-dates) by Dmitry Manannikov

**Fork Maintainer:** Chris Weis

## Contributing

Contributions welcome! Please see [FORK.md](FORK.md) and `.specify/` directory for development guidelines.

## License

The Unlicense (Public Domain) - See [LICENSE](LICENSE)

## Links

- **This Fork**: https://github.com/chrisweis/obsidian-future-dates-cjw
- **Original Plugin**: https://github.com/slonoed/obsidian-future-dates
- **Issues**: https://github.com/chrisweis/obsidian-future-dates-cjw/issues