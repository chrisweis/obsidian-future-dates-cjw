# Fork Information

## Future Dates CJW

This is a fork of the original [Future Dates plugin](https://github.com/slonoed/obsidian-future-dates) by Dmitry Manannikov, maintained by Chris Weis with additional enhancements and improvements.

## Why This Fork?

This fork was created to:
1. Add enhancements and quality-of-life improvements
2. Maintain active development with new features
3. Keep the plugin up-to-date with latest Obsidian versions
4. Implement community-requested features

## Changes from Original

### Version 1.4.0 (2025-10-18)
**Enhancements:**
- ✨ **Clean date display**: Dates now show as `2025-12-25` instead of `[[2025-12-25]]` in context
- 🧹 **Code cleanup**: Removed debug console.log statements
- 📚 **Added spec-kit documentation**: Comprehensive specifications, plans, and tasks
- 🎯 **Better regex**: All wikilinks in context are cleaned for readability

**Technical:**
- Improved `getSubstringsWithPattern()` method with regex replacement
- Better code quality and maintainability
- Comprehensive documentation in `.specify/` directory

### Planned Improvements
See `.specify/tasks/current-tasks.md` for full roadmap:
- Error handling for file operations
- Settings panel for customization
- Filtering and search capabilities
- Mobile support (v3.0)
- Calendar view mode

## Installation

### For End Users

1. **Download the latest release** from the [Releases page](https://github.com/chrisweis/obsidian-future-dates-cjw/releases)

2. **Extract files to your vault**:
   ```
   <Your Vault>/.obsidian/plugins/future-dates-cjw/
   ```

3. **Enable the plugin** in Obsidian Settings → Community Plugins

### Manual Installation

Copy these files to your plugin folder:
- `main.js`
- `manifest.json`
- `styles.css`

### Building from Source

```bash
# Clone the repository
git clone https://github.com/chrisweis/obsidian-future-dates-cjw
cd obsidian-future-dates-cjw

# Install dependencies
npm install

# Build the plugin
npm run build

# Or run in development mode with auto-rebuild
npm run dev
```

## Compatibility with Original

**Can I run both plugins?**
No, you should choose one:
- This fork has ID: `future-dates-cjw`
- Original has ID: `future-dates`

While they have different IDs and *could* technically coexist, they provide the same functionality, so running both is redundant.

**Can I switch from the original?**
Yes! Simply:
1. Disable the original "Future Dates" plugin
2. Install "Future Dates CJW"
3. Both work the same way with your existing notes

## Contributing

Contributions are welcome! Please:
1. Fork this repository
2. Create a feature branch
3. Follow the spec-kit guidelines in `.specify/`
4. Submit a pull request

## Credits

**Original Author:** Dmitry Manannikov ([slonoed](https://github.com/slonoed))
- Original repository: https://github.com/slonoed/obsidian-future-dates
- Thank you for creating this excellent plugin!

**Fork Maintainer:** Chris Weis
- This fork: https://github.com/chrisweis/obsidian-future-dates-cjw

## License

This fork maintains the original license: **The Unlicense** (public domain)

See [LICENSE](LICENSE) for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/chrisweis/obsidian-future-dates-cjw/issues)
- **Discussions**: [GitHub Discussions](https://github.com/chrisweis/obsidian-future-dates-cjw/discussions)
- **Original Plugin**: [slonoed/obsidian-future-dates](https://github.com/slonoed/obsidian-future-dates)

## Changelog

### v1.7.0 (2025-10-19) - Filter Enhancements & Navigation Improvements
- 🎯 **Filter-based frontmatter exclusion**: Each filter can independently exclude pages with frontmatter flags
- 📂 **Configurable daily notes path**: Set custom folder path for date files (e.g., "📝 Journal\Days")
- 🔗 **Long URL support**: Automatically extends context to include complete markdown links
- 🧹 **Empty parentheses cleanup**: Removes artifact `()` left after date removal
- 🐛 **Fixed date extraction from paths**: Dates in subfolders now properly recognized
- ⚙️ **Always-visible frontmatter property**: Setting moved to main exclusion section for easier access

### v1.6.0 (2025-10-19) - UI Redesign & Advanced Filtering
- ✨ **Complete UI redesign**: Flat chronological list with month grouping, compact rows
- 🎯 **View filters**: Create named filters to show dates from specific folders
- 📊 **Dynamic filter counts**: Each filter shows number of dates (e.g., "Work (45)")
- 🎨 **Configurable folder icons**: Use emojis or characters (up to 3 chars) with keyword detection
- 🔧 **Row spacing control**: Slider to adjust compactness (1-5 scale)
- 🧹 **Context cleaning**: Removes markdown artifacts (table separators, bullets, task markers)
- 🔍 **Improved folder exclusion**: Search-based UI for easier folder management
- 🐛 **Fixed display text detection**: Dates with display text (e.g., `[[2025-10-19|Next Day]]`) now properly detected
- 🐛 **Fixed navigation keywords UI**: Settings field now appears when toggle is enabled
- 📁 **Root folder display**: Shows root folder instead of parent folder
- ⚙️ **Configurable navigation keywords**: Edit keywords list when exclusion is enabled

### v1.5.0 (2025-10-19) - Settings & Exclusions
- ⚙️ **Comprehensive settings UI**: Full control over date exclusions and display
- 🚫 **Exclude dates with display text**: Filter out navigation links (e.g., `[[2025-10-19|Next Day]]`)
- 🧭 **Exclude navigation keywords**: Configurable keyword-based exclusion
- 🎨 **Custom regex patterns**: Advanced exclusion with custom regular expressions
- 📁 **Folder exclusions**: Interactive folder browser with search
- 📊 **Context length control**: Adjustable character count around date mentions
- 📅 **Show past dates option**: Toggle to include/exclude past dates
- 🔧 **Settings persistence**: All preferences saved and restored

### v1.4.0 (2025-10-18) - Fork Release
- **Forked from original v1.3.4**
- ✨ **Clean date display**: Shows `2025-12-25` instead of `[[2025-12-25]]` in context
- 🧹 **Removed debug logging**: Cleaned up console.log statements
- 📚 **Spec-kit documentation**: Complete specifications, plans, and tasks in `.specify/`
- 🚀 **Automated deployment**: One-command deployment to Obsidian vault
- 🎯 **Improved code quality**: Better regex, cleaner implementation
- 📝 **Fork documentation**: FORK.md, GITHUB_SETUP.md, updated README

For original version history, see the [original repository](https://github.com/slonoed/obsidian-future-dates).
