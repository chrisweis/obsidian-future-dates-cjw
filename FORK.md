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

### v1.4.0 (2025-10-18) - Fork Release
- **Forked from original v1.3.4**
- ✨ **Clean date display**: Shows `2025-12-25` instead of `[[2025-12-25]]` in context
- 🧹 **Removed debug logging**: Cleaned up console.log statements
- 📚 **Spec-kit documentation**: Complete specifications, plans, and tasks in `.specify/`
- 🚀 **Automated deployment**: One-command deployment to Obsidian vault
- 🎯 **Improved code quality**: Better regex, cleaner implementation
- 📝 **Fork documentation**: FORK.md, GITHUB_SETUP.md, updated README

For original version history, see the [original repository](https://github.com/slonoed/obsidian-future-dates).
