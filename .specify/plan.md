# Implementation Plan: Future Dates Plugin

## Project Overview

**Project:** Obsidian Future Dates Plugin
**Current Version:** v1.3.4
**Status:** Production (Maintenance Mode)
**Repository:** https://github.com/slonoed/obsidian-future-dates

## Development Status

This plugin has been fully implemented and released. This plan documents the completed implementation phases and provides guidance for future maintenance and enhancements.

## Phase 1: Foundation ✅ COMPLETED

**Goal:** Establish project structure and development environment

**Duration:** 1 day

### Tasks
- [x] Initialize npm project with TypeScript
- [x] Configure esbuild for bundling
- [x] Set up ESLint with TypeScript rules
- [x] Create manifest.json with plugin metadata
- [x] Implement version management scripts
- [x] Create basic plugin class structure

**Deliverables:**
- Working dev/build pipeline
- Plugin skeleton that loads in Obsidian
- Version bump automation

**Dependencies:**
- Obsidian plugin API types
- TypeScript compiler
- esbuild bundler

**Validation:**
- `npm run dev` starts watch mode
- `npm run build` produces main.js
- Plugin loads in Obsidian without errors

---

## Phase 2: Model Implementation ✅ COMPLETED

**Goal:** Build core data collection and processing logic

**Duration:** 2-3 days

### Milestone 2.1: Link Collection

**Tasks:**
- [x] Access Obsidian metadata cache
- [x] Implement getMergedLinks() to combine resolved/unresolved links
- [x] Register event listener for cache "resolved" event
- [x] Set up EventTarget inheritance for change notifications

**Validation:**
- Can access all links in vault
- Resolved and unresolved links are merged correctly

### Milestone 2.2: Date Processing

**Tasks:**
- [x] Implement extractDate() with regex validation
- [x] Integrate Daily Notes plugin settings
- [x] Use moment.js for date parsing and validation
- [x] Filter dates to only future (after today)
- [x] Handle .md file extension removal

**Validation:**
- YYYY-MM-DD format detected
- Custom Daily Notes formats detected
- Past and present dates excluded
- Future dates correctly identified

### Milestone 2.3: Context Extraction

**Tasks:**
- [x] Implement getSubstringsWithPattern()
- [x] Read file content with vault.cachedRead()
- [x] Extract 50 chars before/after date mention
- [x] Handle multiple mentions per file
- [x] Process line-by-line for efficiency

**Validation:**
- Context extracted for each mention
- Multiple mentions handled correctly
- Line boundaries respected

### Milestone 2.4: Data Structure

**Tasks:**
- [x] Define FutureNotes and Mentions types
- [x] Build hierarchical data structure (date → file → mentions)
- [x] Implement async collectNotes() method
- [x] Emit "change" event when data updates

**Deliverables:**
- Complete Model class
- Typed data structures
- Event-driven updates

---

## Phase 3: View Implementation ✅ COMPLETED

**Goal:** Create UI for displaying future dates

**Duration:** 2 days

### Milestone 3.1: View Foundation

**Tasks:**
- [x] Extend ItemView class
- [x] Define view type and metadata
- [x] Set icon ("file-clock") and display text
- [x] Listen to model "change" events

**Validation:**
- View appears in Obsidian sidebar
- View metadata shows correctly

### Milestone 3.2: Rendering Logic

**Tasks:**
- [x] Implement hierarchical rendering:
  - [x] createDatesList() - Top level
  - [x] createDateItem() - Individual dates
  - [x] createFilesList() - Source files under date
  - [x] createFileItem() - Individual files
  - [x] createMentionsList() - Context items
- [x] Sort dates chronologically
- [x] Build DOM structure with ul/li elements

**Validation:**
- Three-level hierarchy displays correctly
- Dates in chronological order
- All mentions visible

### Milestone 3.3: Navigation

**Tasks:**
- [x] Implement createLink() with click handlers
- [x] Use workspace.openLinkText() for navigation
- [x] Prevent default anchor behavior
- [x] Pass correct paths and hrefs

**Validation:**
- Clicking date opens daily note
- Clicking file opens source file
- Non-existent files handled correctly

### Milestone 3.4: Dynamic Updates

**Tasks:**
- [x] Implement onModelChange() handler
- [x] Clear and rebuild DOM on changes
- [x] Ensure no memory leaks from event listeners

**Deliverables:**
- Fully functional view component
- Working navigation
- Automatic updates

---

## Phase 4: Integration ✅ COMPLETED

**Goal:** Connect all components in main plugin class

**Duration:** 1 day

### Tasks
- [x] Implement onload() lifecycle method
- [x] Initialize Model instance
- [x] Register view type with Obsidian
- [x] Wait for workspace layout ready
- [x] Implement initLeaf() for sidebar placement
- [x] Check for existing view instances
- [x] Implement onunload() cleanup
- [x] Call model.finish() on cleanup

**Validation:**
- Plugin loads without errors
- View appears in right sidebar
- Load/unload cycles work correctly
- No resource leaks

**Deliverables:**
- Complete plugin integration
- Stable lifecycle management

---

## Phase 5: Polish & Release ✅ COMPLETED

**Goal:** Production-ready plugin with documentation

**Duration:** 2-3 days

### Milestone 5.1: Code Quality

**Tasks:**
- [x] ESLint compliance check
- [x] TypeScript strict mode validation
- [x] Remove unnecessary console.logs (*one remains at model.ts:66*)
- [x] Add code comments where needed
- [x] Final refactoring pass

### Milestone 5.2: Documentation

**Tasks:**
- [x] Write README.md
- [x] Create screenshot
- [x] Add LICENSE (The Unlicense)
- [x] Document Daily Notes dependency

### Milestone 5.3: Build Configuration

**Tasks:**
- [x] Configure production build settings
- [x] Set up minification
- [x] Configure source maps
- [x] Test final build

### Milestone 5.4: Release

**Tasks:**
- [x] Create GitHub repository
- [x] Tag v1.0.0 release
- [x] Subsequent releases up to v1.3.4
- [x] Submit to Obsidian Community Plugins

**Deliverables:**
- Production release v1.3.4
- Complete documentation
- Published plugin

---

## Phase 5.5: Fork Enhancements ✅ COMPLETED

**Goal:** Improve fork with UX and developer experience enhancements

**Duration:** 1 day (2025-10-18)

### Milestone 5.5.1: Clean Date Display

**Tasks:**
- [x] Modified `getSubstringsWithPattern()` to remove wikilink brackets
- [x] Added regex replacement: `/\[\[([^\]]+)\]\]/g` → `$1`
- [x] Tested with various date formats
- [x] Updated spec documentation

**Deliverables:**
- Cleaner display: `2025-12-25` instead of `[[2025-12-25]]`
- Improved readability in context mentions
- Better UX for end users

**Validation:**
- Tested in live Obsidian vault
- Regex confirmed working correctly
- All wikilinks in context cleaned

### Milestone 5.5.2: Development Automation

**Tasks:**
- [x] Created `deploy.mjs` deployment script
- [x] Added `deploy.config.json` configuration system
- [x] Created `deploy.config.example.json` template
- [x] Added npm scripts: `deploy` and `deploy:only`
- [x] Updated `.gitignore` to exclude personal config
- [x] Documented in README.md

**Deliverables:**
- Automated deployment to Obsidian vault
- One-command build and deploy workflow
- Cross-platform compatible script
- Better developer experience

**Validation:**
- Successfully deploys to vault
- Creates directory if needed
- Clear success/failure feedback
- Works on Windows (tested)

### Milestone 5.5.3: Fork Documentation

**Tasks:**
- [x] Rebranded as "Future Dates CJW"
- [x] Updated manifest.json with new ID and metadata
- [x] Created FORK.md with rationale and changelog
- [x] Created GITHUB_SETUP.md with setup instructions
- [x] Updated README.md for fork
- [x] Updated all GitHub URLs to chrisweis
- [x] Bumped version to 1.4.0

**Deliverables:**
- Complete fork identity and branding
- Comprehensive documentation
- GitHub repository ready
- All spec-kit docs updated

---

## Current Phase: Maintenance

**Status:** Ongoing
**Responsible:** Chris Weis (Fork Maintainer)

### Maintenance Activities

#### Bug Fixes
**Priority Levels:**
1. **P0 - Critical:** Crashes, data loss → Fix immediately
2. **P1 - High:** Feature broken → Fix within 1 week
3. **P2 - Medium:** Partial breakage → Fix within 1 month
4. **P3 - Low:** Minor issues → Fix when convenient

**Process:**
1. Issue reported and verified
2. Fix developed and tested
3. Version bumped (patch for bugs)
4. Release and deployment

#### Compatibility Updates
**Trigger:** New Obsidian major release

**Process:**
1. Test plugin with new version
2. Fix any breaking changes
3. Update minAppVersion if needed
4. Release compatibility update

**Timeline:** Within 2 weeks of Obsidian release

#### Dependency Updates
**Schedule:** Quarterly review

**Items to Review:**
- obsidian-daily-notes-interface
- Development dependencies
- TypeScript version
- Build tools

---

## Future Phases (Proposed)

### Phase 6: Quality Improvements

**Status:** Proposed
**Priority:** Medium
**Effort:** 1-2 weeks

**Goals:**
- Remove remaining console.log
- Add comprehensive error handling
- Improve empty state UX
- Add inline documentation

**Tasks:**
- [ ] TASK-001: Remove debug console.log (model.ts:66)
- [ ] TASK-002: Add try/catch for file reads
- [ ] TASK-003: Add JSDoc comments to all public methods
- [ ] TASK-005: Implement empty state messages

**Success Criteria:**
- Zero console output in production
- All errors handled gracefully
- All public APIs documented
- Better UX for empty states

---

### Phase 7: Settings & Configuration

**Status:** Future Consideration
**Priority:** Low
**Effort:** 1 week

**Goals:**
- Add plugin settings tab
- Make context length configurable
- Add display preferences

**Tasks:**
- [ ] TASK-006: Implement settings tab
- [ ] Make context length configurable (default: 50)
- [ ] Add "show past dates" option
- [ ] Add date sorting preference
- [ ] Add auto-open on startup setting

**Dependencies:**
- Phase 6 should be completed first

**Success Criteria:**
- Settings persist across restarts
- All settings functional
- UI follows Obsidian conventions

---

### Phase 8: Performance Optimization

**Status:** Future Consideration
**Priority:** Low (unless performance issues reported)
**Effort:** 2-3 weeks

**Goals:**
- Implement incremental updates
- Reduce full vault re-scans
- Optimize for large vaults (>5000 notes)

**Tasks:**
- [ ] TASK-007: Implement incremental update logic
- [ ] Track which files changed
- [ ] Merge partial updates with existing data
- [ ] Remove entries for deleted files
- [ ] Performance benchmarking

**Technical Challenges:**
- Obsidian cache doesn't specify which file changed
- Need to maintain state for comparison
- Complex merge logic

**Success Criteria:**
- >50% faster updates on large vaults
- No functional regressions
- Measurable performance improvement

---

### Phase 9: Enhanced Features (v2.0)

**Status:** Future Major Version
**Priority:** Low
**Effort:** 4-6 weeks

**Goals:**
- Add filtering capabilities
- Implement search functionality
- Scroll-to-mention feature
- Alternative view modes

**Proposed Features:**
1. **Filtering (TASK-009)**
   - Date range filter
   - Source folder filter
   - Search within mentions

2. **Navigation Enhancement (TASK-010)**
   - Scroll to exact mention when clicking file
   - Highlight the mention line
   - Smooth scrolling UX

3. **View Modes (TASK-012)**
   - List view (current)
   - Calendar view
   - Timeline view

**Dependencies:**
- Phase 7 (Settings) recommended first
- Requires settings infrastructure

**Breaking Changes:**
- May require data structure changes
- Settings panel needed
- Possible performance implications

---

### Phase 10: Mobile Support (v3.0)

**Status:** Future Major Version
**Priority:** Low
**Effort:** 2-3 months

**Goals:**
- Full Obsidian mobile support
- Responsive UI for small screens
- Touch-optimized interactions

**Tasks:**
- [ ] TASK-011: Update manifest (remove isDesktopOnly)
- [ ] Responsive UI design
- [ ] Touch gesture support
- [ ] Mobile performance optimization
- [ ] iOS testing
- [ ] Android testing

**Technical Challenges:**
- UI must adapt to various screen sizes
- Performance constraints on mobile
- Platform-specific testing
- Different file access patterns

**Success Criteria:**
- Plugin works on iOS
- Plugin works on Android
- Performance acceptable on mobile
- Touch interactions natural

---

## Testing Strategy

### Current Testing (v1.x)

**Approach:** Manual testing in development vault

**Test Cases:**
- Basic functionality (display, navigation)
- Edge cases (empty vault, large vault, custom formats)
- Compatibility (Obsidian versions)
- Performance (update times)

**Test Vault Setup:**
- Development vault with ~100 notes
- Mix of future and past date links
- Various date formats
- Daily Notes configured

### Future Testing (v2.0+)

**Proposed:** Automated testing framework

**Tasks:**
- [ ] TASK-008: Set up Jest/Vitest
- [ ] Mock Obsidian API
- [ ] Unit tests for Model methods
- [ ] Unit tests for View rendering
- [ ] Integration tests for plugin lifecycle
- [ ] Achieve >70% code coverage

---

## Risk Management

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Obsidian API changes | High | Test with beta versions, maintain compatibility layer |
| Daily Notes API changes | High | Implement fallback to default format |
| Performance on large vaults | Medium | Optimize algorithms, consider incremental updates |
| Unicode/encoding issues | Low | Consistent UTF-8 usage |

### Project Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Maintainer availability | Medium | Document thoroughly, modular architecture |
| User feature requests | Low | Clear constitution about scope |
| Competing plugins | Low | Focus on quality and simplicity |

---

## Success Metrics

### Development Metrics
- Build time: < 5 seconds ✅
- Bundle size: < 100 KB ✅
- TypeScript errors: 0 ✅

### Runtime Metrics
- Plugin load time: < 500ms ✅
- Update latency: < 1s for typical vault ✅
- Memory usage: < 50MB ✅

### User Metrics
- Installation success rate: Target >95%
- Crash rate: Target <0.1%
- User satisfaction: Monitor feedback

---

## Resource Requirements

### Current Maintenance
- Developer time: 2-4 hours/month
- Testing environment: Development vault
- Tools: VS Code, Obsidian, Git

### Future Development (Phase 6-10)
- Developer time: Varies by phase (see effort estimates)
- Testing devices: Desktop (Win/Mac/Linux), Mobile (iOS/Android) for Phase 10
- CI/CD: GitHub Actions (optional)

---

## Timeline

### Completed Phases
| Phase | Duration | Completion Date |
|-------|----------|----------------|
| Phase 1: Foundation | 1 day | Historical |
| Phase 2: Model | 3 days | Historical |
| Phase 3: View | 2 days | Historical |
| Phase 4: Integration | 1 day | Historical |
| Phase 5: Release | 3 days | Historical |

**Total Initial Development:** ~10 days

### Proposed Timeline
- Phase 6 (Quality): When scheduled (1-2 weeks)
- Phase 7 (Settings): TBD (1 week)
- Phase 8 (Performance): TBD (2-3 weeks)
- Phase 9 (Features v2.0): TBD (4-6 weeks)
- Phase 10 (Mobile v3.0): TBD (2-3 months)

---

## Approval & Sign-off

**Plan Status:** Approved
**Current Version:** v1.3.4 (Production)
**Plan Version:** 1.0
**Last Updated:** 2025-10-18

**Next Review:** When Phase 6 is scheduled
