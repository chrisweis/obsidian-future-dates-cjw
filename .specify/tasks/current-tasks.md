# Current Tasks - Obsidian Future Dates CJW

## Active Sprint: v1.6.0 Complete - Maintenance Mode

**Sprint Goal:** Maintain quality and monitor for issues
**Sprint Duration:** Ongoing
**Current Version:** v1.6.0
**Priority:** Stability

---

## Recently Completed Tasks (v1.6.0)

### TASK-020: UI Redesign

**Status:** 🟢 Complete
**Priority:** P0 - Critical
**Effort:** L (Full day)
**Completed:** 2025-10-19

**Description:**
Complete redesign of the Future Dates view from hierarchical to flat chronological list with month grouping.

**Deliverables:**
- [x] Flat chronological mention list
- [x] Month grouping with headers
- [x] Light gray backgrounds for month sections
- [x] Compact row-based layout
- [x] Row spacing control setting (1-5 scale)
- [x] Root folder display instead of parent
- [x] Context cleaning (markdown artifacts)
- [x] Complete CSS overhaul

---

### TASK-021: View Filters System

**Status:** 🟢 Complete
**Priority:** P0 - Critical
**Effort:** L (Full day)
**Completed:** 2025-10-19

**Description:**
Implement named filters with folder-based filtering and dynamic counts.

**Deliverables:**
- [x] Filter data structure (DateFilter interface)
- [x] Filter dropdown in view header
- [x] Filter settings UI (create/edit/delete)
- [x] Include/exclude folder logic per filter
- [x] Dynamic count display in dropdown
- [x] Active filter persistence
- [x] Filter application logic

---

### TASK-022: Folder Icon System

**Status:** 🟢 Complete
**Priority:** P1 - High
**Effort:** M (Half day)
**Completed:** 2025-10-19

**Description:**
Configurable emoji/character icon system with keyword-based detection.

**Deliverables:**
- [x] Icon mapping interface (emoji/character up to 3 chars)
- [x] Keyword-based detection
- [x] Enable/disable toggle
- [x] Icon mapping UI (add/edit/remove)
- [x] Support for any emoji or character
- [x] Default mappings (💼 work, 🏠 personal, 📖 journal)

---

### TASK-023: Bug Fixes - Display Text Detection

**Status:** 🟢 Complete
**Priority:** P0 - Critical (Bug)
**Effort:** M (Few hours)
**Completed:** 2025-10-19

**Description:**
Fixed critical bug where dates with display text were never detected.

**Root Cause:**
`indexOf` search for exact pattern `[[2025-10-19]]` failed when line contained `[[2025-10-19|Next Day]]`.

**Fix:**
Replaced with regex that matches both `[[date]]` and `[[date|display text]]`:
```typescript
const dateRegex = new RegExp(`\\[\\[${escapeRegex(date)}(?:\\|[^\\]]+)?\\]\\]`, 'g');
```

**Deliverables:**
- [x] Regex-based pattern matching
- [x] Proper detection of dates with display text
- [x] Exclusion setting now works correctly

---

### TASK-024: Bug Fixes - Navigation Keywords UI

**Status:** 🟢 Complete
**Priority:** P1 - High (Bug)
**Effort:** XS (Minutes)
**Completed:** 2025-10-19

**Description:**
Fixed UI bug where navigation keywords field didn't appear when toggle was enabled.

**Fix:**
Added `this.display()` to toggle onChange handler to refresh settings UI.

**Deliverables:**
- [x] Keywords field appears immediately on toggle
- [x] Settings UI refreshes correctly

---

### TASK-025: Improved Folder Exclusion UI

**Status:** 🟢 Complete
**Priority:** P1 - High
**Effort:** M (Few hours)
**Completed:** 2025-10-19

**Description:**
Redesigned folder exclusion to be more compact and user-friendly with search-first interface.

**Deliverables:**
- [x] Single "Excluded folders" setting
- [x] Search field at top
- [x] Results show only non-excluded folders
- [x] Click to add to exclusion list
- [x] Excluded list below with click to remove
- [x] Compact layout

---

### TASK-026: Context Cleaning

**Status:** 🟢 Complete
**Priority:** P2 - Medium
**Effort:** S (Hour)
**Completed:** 2025-10-19

**Description:**
Clean up markdown formatting artifacts in context display.

**Deliverables:**
- [x] Remove table separators (`|`, `||`)
- [x] Remove bullet markers (`-`, `*`, `+`)
- [x] Remove task checkboxes (`[ ]`, `[x]`)
- [x] Remove leading/trailing separators
- [x] Collapse extra whitespace

---

## Recently Completed Tasks (v1.5.0)

### TASK-015: Comprehensive Settings System

**Status:** 🟢 Complete
**Priority:** P0 - Critical
**Effort:** XL (Full day)
**Completed:** 2025-10-19

**Description:**
Implement full settings system with exclusions and display options.

**Deliverables:**
- [x] Settings interface and defaults
- [x] Settings persistence
- [x] Settings tab UI
- [x] Exclude dates with display text
- [x] Exclude navigation keywords (configurable)
- [x] Custom regex pattern exclusions
- [x] Folder exclusions with interactive browser
- [x] Context length slider
- [x] Show past dates toggle

---

## Active Monitoring

### Monitor: User Feedback

**Status:** 🟡 Ongoing
**Priority:** P1 - High

**Actions:**
- Monitor GitHub issues for bug reports
- Watch for feature requests
- Track user questions

---

### Monitor: Obsidian Compatibility

**Status:** 🟡 Ongoing
**Priority:** P1 - High

**Actions:**
- Test with new Obsidian releases
- Watch for API deprecations
- Monitor breaking changes

---

## Backlog - Future Enhancements

### Potential: Advanced Filter Logic (AND/OR operators)

**Status:** 🔵 Planned
**Priority:** P3 - Low
**Effort:** XL (Multiple days)

**Description:**
Enhance filters to support complex logic like:
- (Folder A OR Folder B) AND NOT Folder C
- Nested filter conditions

**Notes:**
- Would require filter builder UI
- Complex to implement and explain
- May not be needed for most users

---

### Potential: Mobile Support

**Status:** 🔵 Planned
**Priority:** P3 - Low
**Effort:** XXL (Weeks)

**Description:**
Support Obsidian mobile (iOS/Android).

**Requirements:**
- Remove `isDesktopOnly: true` from manifest
- Responsive UI for small screens
- Touch-optimized interactions
- Mobile performance optimization

---

### Potential: Calendar View Mode

**Status:** 🔵 Planned
**Priority:** P3 - Low
**Effort:** XL (Multiple days)

**Description:**
Alternative view mode showing dates in calendar format.

**Requirements:**
- Calendar UI component
- Date navigation
- View mode toggle
- Maintain filter compatibility

---

## Version History

- **v1.6.0** (2025-10-19): UI Redesign & Advanced Filtering
- **v1.5.0** (2025-10-19): Settings & Exclusions
- **v1.4.0** (2025-10-18): Fork Release with Clean Display & Automation
- **v1.3.4** (Original): Last version from upstream

---

**Last Updated:** 2025-10-19
**Sprint Status:** v1.6.0 Complete - Maintenance Mode
