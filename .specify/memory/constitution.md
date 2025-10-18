# Project Constitution

## Project Identity

- **Name:** Future Dates CJW
- **ID:** future-dates-cjw
- **Type:** Obsidian Plugin (Fork)
- **Version:** 1.4.0
- **Author:** Chris Weis (fork of original by Dmitry Manannikov)
- **Original:** https://github.com/slonoed/obsidian-future-dates
- **License:** The Unlicense
- **Platform:** Obsidian Desktop Only (v0.15.0+)
- **Repository:** https://github.com/chrisweis/obsidian-future-dates-cjw

## Core Principles

### 1. Simplicity First
The plugin maintains a focused, single-purpose feature set without bloat. Every feature must directly serve the goal of tracking future dates. Complexity is actively resisted.

### 2. Integration Over Invention
Leverage Obsidian's existing capabilities rather than reinventing:
- Use Daily Notes plugin for date format detection
- Rely on Obsidian's metadata cache system
- Work seamlessly with native linking
- Respect Obsidian's UI conventions

### 3. Performance and Efficiency
- Monitor metadata cache changes (don't poll)
- Process asynchronously to avoid UI blocking
- Minimize resource consumption
- Target <1s updates for vaults with <1000 notes

### 4. User Experience Excellence
- Display dates in chronological order
- Provide contextual information for each mention
- Enable one-click navigation
- Update automatically without user intervention

## Technical Standards

### Code Quality
- TypeScript strict mode compliance
- ESLint enforcement (no warnings)
- Clear separation of concerns (MVC pattern)
- Meaningful variable and function names
- JSDoc comments for public APIs

### Architecture
- **Pattern:** Model-View-Controller
- **Events:** Event-driven data flow (Observer pattern)
- **Dependencies:** Minimal external dependencies
- **Structure:** Three-file architecture (main.ts, model.ts, view.ts)

### Testing Philosophy
- Desktop-only focus (no mobile testing required)
- Manual testing in development vault
- Version compatibility testing with min Obsidian version
- Edge case validation (see spec for list)

### Performance Requirements
| Vault Size | Max Update Time |
|------------|----------------|
| < 1,000 notes | < 1 second |
| 1,000-5,000 notes | < 3 seconds |
| > 5,000 notes | < 10 seconds |

## Constraints and Limitations

### Platform Constraints
- Desktop only (isDesktopOnly: true in manifest)
- Minimum Obsidian version: 0.15.0
- No mobile support

### Functional Boundaries
- Only detects `[[YYYY-MM-DD]]` format links
- Requires Daily Notes plugin for custom formats
- Shows only future dates (excludes today and past)
- Context limited to 50 characters each side
- Fixed right sidebar position

## Development Workflow

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Automated version bump via `npm version`
- Manifest and versions.json updated in lockstep
- Git tags for each release

### Build Process
```bash
npm run dev    # Development with watch
npm run build  # Production with type checking
npm run version # Bump version numbers
```

### Release Criteria
- [ ] All TypeScript type checks pass
- [ ] ESLint shows zero warnings
- [ ] Plugin loads without errors
- [ ] All core features tested manually
- [ ] Version numbers updated
- [ ] Git tag created

## Out of Scope

To preserve simplicity, these are explicitly excluded from current scope:

- Mobile support
- Advanced filtering/search
- Custom date formats beyond Daily Notes
- Task plugin integration
- Notifications or reminders
- Calendar views
- Export functionality
- Settings panel (future consideration)

## Success Metrics

### Reliability
- Plugin loads without errors on all supported Obsidian versions
- Zero data loss or corruption
- Graceful handling of edge cases

### Performance
- Updates complete within target times (see table above)
- No UI blocking during processing
- Memory footprint < 50MB

### Usability
- All future date links discovered and displayed
- Navigation works in one click
- Automatic updates without user action
- Intuitive hierarchical display

## Evolution Guidelines

### When Adding Features
1. Does it serve the core purpose of tracking future dates?
2. Can we leverage existing Obsidian capabilities?
3. Will it impact performance or simplicity?
4. Is there strong user demand?
5. Does it fit the architecture?

### When Fixing Bugs
1. Critical (crashes/data loss) → Immediate
2. High (feature broken) → Within 1 week
3. Medium (partial breakage) → Within 1 month
4. Low (minor inconvenience) → When convenient

### Technical Debt Management
- Address debt before adding new features
- Refactor when modifying adjacent code
- Maintain <10% debt ratio
- Document all known issues in TASKS.md

## Dependencies Policy

### Runtime Dependencies
- Obsidian API (peer dependency - always use latest)
- obsidian-daily-notes-interface (^0.9.4 - review quarterly)
- Moment.js (via Obsidian - no direct dependency)

### Development Dependencies
- Lock versions in package-lock.json
- Update quarterly unless security issue
- Test thoroughly after updates
- TypeScript, esbuild, ESLint configuration stability preferred

### Dependency Review Schedule
- **Security patches:** Immediate
- **Minor updates:** Quarterly
- **Major updates:** As needed with thorough testing
- **Obsidian compatibility:** Within 2 weeks of major Obsidian release

## Communication and Collaboration

### Code Reviews
- Required for all changes (if team grows)
- Check against constitution principles
- Verify performance impact
- Ensure backwards compatibility

### Issue Management
- Bug reports require reproduction steps
- Feature requests need justification against principles
- Label by priority (critical/high/medium/low)
- Close won't-fix items with clear rationale

### Documentation
- README for users
- Constitution for developers
- Inline comments for complex logic
- SPEC.md for requirements
- PLAN.md for roadmap
- TASKS.md for actionable items

## Final Note

This constitution is a living document. Changes require thoughtful consideration and should be rare. The goal is stability and consistency, not rigidity. When in doubt, favor simplicity and alignment with Obsidian's philosophy.

**Last Updated:** 2025-10-18
**Constitution Version:** 1.0
