# Spec: Future Dates Core Feature

## Overview

**Feature:** Automatic collection and display of future date links
**Status:** Implemented (v1.6.0)
**Type:** Core Plugin Functionality
**Priority:** P0 (Critical)
**Fork:** Future Dates CJW by Chris Weis

## Problem Statement

Obsidian users often create links to future dates for planning, scheduling, and task management. However, there's no built-in way to see all future dates referenced across a vault in one consolidated view. Users must manually search or remember which notes contain future references.

## User Stories

### US-1: View All Future Dates
**As a** vault user
**I want** to see all my future date links in one place
**So that** I can quickly review upcoming events and tasks

**Acceptance Criteria:**
- All future date links are collected automatically
- Dates are displayed in chronological order
- View updates when vault content changes
- Only dates after today are shown

### US-2: Navigate to Dates and Sources
**As a** vault user
**I want** to click on dates and source files
**So that** I can quickly navigate to relevant notes

**Acceptance Criteria:**
- Clicking a date opens that daily note
- Clicking a source file opens that file
- Navigation works for both existing and non-existing files
- No page reload required

### US-3: Understand Context
**As a** vault user
**I want** to see surrounding text for each date mention
**So that** I understand why the date was referenced

**Acceptance Criteria:**
- Up to 50 characters shown before the date link
- Up to 50 characters shown after the date link
- Multiple mentions in same file are listed separately
- Context is extracted from the actual file content

## Functional Requirements

### FR-1: Date Detection

**Description:** Automatically detect all links to future dates in the vault

**Details:**
- Scan both resolved and unresolved links
- Support Daily Notes plugin date format
- Fallback to YYYY-MM-DD format
- Filter to only future dates (after current date)

**Technical Implementation:**
```typescript
// Default pattern
const dailyRe = /^\d{4}-\d{2}-\d{2}$/;

// Or from Daily Notes settings
const { format } = getDailyNoteSettings();
moment(fileName, format, true).isValid()

// Date comparison
moment(date).isAfter(moment(), "day")
```

**Edge Cases:**
- Non-existent daily note files (unresolved links)
- Custom date formats from Daily Notes
- Dates in different folder structures
- Files with .md extension handling

### FR-2: Context Extraction

**Description:** Extract surrounding text for each date mention with clean display

**Details:**
- Read file content using vault.cachedRead()
- Search for pattern `[[date]]` in content
- Extract 50 chars before and after
- Handle multiple mentions per file
- Replace `[[date]]` with clean date format (YYYY-MM-DD) for display

**Technical Implementation:**
```typescript
getSubstringsWithPattern(text: string, pattern: string): string[] {
    // Split by lines
    // Find pattern in each line
    // Extract substring with maxContextLength = 50
    // Replace [[date]] with just date using regex: /\[\[([^\]]+)\]\]/g
    // Return array of cleaned context strings
}
```

**Display Enhancement:**
- Input: `"Meeting about [[2025-12-25]] at 3pm"`
- Output: `"Meeting about 2025-12-25 at 3pm"`
- Removes wikilink brackets for cleaner, more readable display

**Edge Cases:**
- Pattern at start/end of line
- Multiple patterns in same line
- Very short lines
- Empty file content
- Multiple wikilinks in same context (all cleaned)

### FR-3: Hierarchical Display

**Description:** Display dates, files, and mentions in nested structure

**Structure:**
```
Date (chronologically sorted)
└── Source File
    └── Mention (with context)
```

**Technical Implementation:**
```typescript
type Mentions = Record<string, Array<string>>;
// sourcePath -> array of context strings

type FutureNotes = Record<string, Mentions>;
// date -> sourcePath -> mentions
```

**Display Requirements:**
- Dates sorted chronologically (earliest first)
- Source files grouped under each date
- All mentions listed under source file
- Clickable links for navigation

### FR-4: Real-time Updates

**Description:** Automatically update view when vault changes

**Details:**
- Listen to metadata cache "resolved" event
- Trigger data re-collection
- Re-render view with new data
- No manual refresh needed

**Technical Implementation:**
```typescript
cache.on("resolved", () => {
    this.collectNotes();
});
```

**Performance:**
- Debounce rapid changes (handled by Obsidian)
- Async file reading
- Event-based updates (not polling)

### FR-5: Sidebar Integration

**Description:** Display view in right sidebar panel

**Details:**
- Custom view type: "obsidian-future-dates-view"
- Initialize on workspace layout ready
- Icon: "file-clock"
- Display name: "Future dates"

**Technical Implementation:**
```typescript
this.registerView(
    FutureDatesView.TYPE,
    (leaf) => new FutureDatesView(leaf, model, workspace)
);
```

**Behavior:**
- Auto-open on plugin load (if not already open)
- Single instance only
- Persists across restarts

### FR-6: Settings & Exclusions (v1.5.0)

**Description:** Configurable settings to exclude specific date mentions and customize display

**User Story:**
> As a user with daily note templates containing navigation links (e.g., "[[2025-10-17|◀ Previous Day]]"), I want to exclude these dates from the Future Dates view so that only meaningful date references appear.

**Settings Categories:**

#### Exclusion Settings

1. **Exclude Dates with Display Text**
   - **Default:** Enabled
   - **Description:** Excludes dates that have custom display text (contains `|` pipe character)
   - **Example:** `[[2025-10-19|Next Day ▶]]` → Excluded
   - **Example:** `[[2025-10-19]]` → Included

2. **Exclude Navigation Keywords**
   - **Default:** Enabled
   - **Description:** Excludes lines containing specified navigation keywords
   - **Default Keywords:**
     - "Previous Day"
     - "Next Day"
     - "Week"
     - "Month"
     - "Quarter"
     - "Year"
   - **Configurable:** Yes, comma-separated list in settings
   - **Behavior:** Case-insensitive matching

3. **Custom Exclusion Patterns**
   - **Default:** Disabled
   - **Description:** Exclude lines matching custom regex patterns (advanced)
   - **Input:** Text area with one regex pattern per line
   - **Example:** `^\\[\\[.*\\|.*Day.*\\]\\]` to exclude all date links with "Day" in display text
   - **Error Handling:** Invalid regex patterns are skipped with console warning

#### Display Settings

1. **Context Length**
   - **Type:** Slider
   - **Range:** 10-200 characters
   - **Step:** 10
   - **Default:** 50
   - **Description:** Number of characters to show before and after each date mention

2. **Show Past Dates**
   - **Type:** Toggle
   - **Default:** Disabled
   - **Description:** Include dates in the past (not just future dates)

**Technical Implementation:**

```typescript
export interface FutureDatesSettings {
    // Exclusion options
    excludeDatesWithDisplayText: boolean;
    excludeNavigationKeywords: boolean;
    navigationKeywords: string[];
    excludeCustomPatterns: boolean;
    customPatterns: string[];

    // Display options
    contextLength: number;
    showPastDates: boolean;
}

export const DEFAULT_SETTINGS: FutureDatesSettings = {
    excludeDatesWithDisplayText: true,
    excludeNavigationKeywords: true,
    navigationKeywords: ["Previous Day", "Next Day", "Week", "Month", "Quarter", "Year"],
    excludeCustomPatterns: false,
    customPatterns: [],
    contextLength: 50,
    showPastDates: false
};
```

**Settings Persistence:**
- Settings saved via Obsidian's `loadData()` / `saveData()` API
- Settings merged with defaults on load
- Changes trigger immediate view refresh via `model.collectNotes()`

**UI Design:**
- Settings accessible via Settings → Community Plugins → Future Dates CJW
- Organized into sections: "Date Exclusion" and "Display Options"
- Conditional display: some inputs only shown when parent toggle is enabled
- About section with version info and links

**Exclusion Logic:**

The `shouldExcludeLine()` method in model.ts checks each line:

1. **Display Text Check:**
   ```typescript
   const dateWithDisplayText = new RegExp(`\\[\\[${escapeRegex(date)}\\|[^\\]]+\\]\\]`);
   if (dateWithDisplayText.test(line)) return true;
   ```

2. **Navigation Keyword Check:**
   ```typescript
   const lowerLine = line.toLowerCase();
   for (const keyword of navigationKeywords) {
       if (lowerLine.includes(keyword.toLowerCase())) return true;
   }
   ```

3. **Custom Pattern Check:**
   ```typescript
   for (const patternStr of customPatterns) {
       const regex = new RegExp(patternStr);
       if (regex.test(line)) return true;
   }
   ```

**Edge Cases:**
- Invalid regex patterns → Skip pattern with console warning
- Empty keyword list → No exclusion
- Very long keyword lists → Performance consideration
- Overlapping exclusion rules → Any match excludes the line

## Non-Functional Requirements

### NFR-1: Performance

**Requirements:**
- Update time < 1s for vaults with <1000 notes
- Update time < 3s for vaults with 1000-5000 notes
- Update time < 10s for vaults with >5000 notes
- Memory usage < 50MB
- No UI blocking during updates

**Measurement:**
```typescript
const start = performance.now();
await this.collectNotes();
const duration = performance.now() - start;
console.log(`Update took ${duration}ms`);
```

### NFR-2: Compatibility

**Requirements:**
- Obsidian desktop v0.15.0 or higher
- Windows, macOS, and Linux support
- No mobile support (isDesktopOnly: true)
- Compatible with Obsidian's plugin API changes

**Testing:**
- Test on each major Obsidian release
- Verify with minimum supported version
- Check for API deprecation warnings

### NFR-3: Reliability

**Requirements:**
- No crashes or data corruption
- Graceful handling of file read errors
- Handles missing or deleted files
- Works with empty vaults

**Error Handling:**
- Try/catch for file operations
- Null checks before file access
- Skip files that can't be read
- Log errors to console

### NFR-4: User Experience

**Requirements:**
- Intuitive hierarchical display
- Responsive click interactions
- Clear visual hierarchy
- Consistent with Obsidian UI patterns

**Design:**
- Standard ul/li HTML structure
- Obsidian's default link styling
- Nested list indentation
- Click handlers prevent default anchor behavior

## Data Model

### Core Types

```typescript
// source file -> texts where day (target) is mentioned
export type Mentions = Record<string, Array<string>>;

// day file (target) -> source file -> mentions
export type FutureNotes = Record<string, Mentions>;
```

### Example Data

```json
{
  "2025-11-01": {
    "Projects/Work.md": [
      "Meeting with team about [[2025-11-01]] deadline for Q4",
      "Submit quarterly report by [[2025-11-01]] EOD"
    ],
    "Personal/Todo.md": [
      "Dentist appointment on [[2025-11-01]] at 2pm"
    ]
  },
  "2025-11-15": {
    "Projects/Roadmap.md": [
      "Product launch scheduled for [[2025-11-15]]"
    ]
  }
}
```

## User Interface

### View Layout

```
┌─────────────────────────────────────┐
│ 📁 Future dates            file-clock│
├─────────────────────────────────────┤
│ • 2025-11-01                         │
│   • Projects/Work.md                 │
│     Meeting with team about [...     │
│     Submit quarterly report by [...  │
│   • Personal/Todo.md                 │
│     Dentist appointment on [...]     │
│                                      │
│ • 2025-11-15                         │
│   • Projects/Roadmap.md              │
│     Product launch scheduled for[... │
└─────────────────────────────────────┘
```

### Interaction Patterns

| User Action | System Response |
|------------|-----------------|
| Click date link | Opens daily note (creates if needed) |
| Click source file | Opens source file in main editor |
| Vault file changes | View auto-updates |
| Close view | View can be reopened from command palette |

### Empty States

```
┌─────────────────────────────────────┐
│ 📁 Future dates            file-clock│
├─────────────────────────────────────┤
│                                      │
│ (empty - no future dates)            │
│                                      │
└─────────────────────────────────────┘
```

## Technical Architecture

### Component Diagram

```
ObsidianFutureDatesPlugin (main.ts)
├── Model (model.ts)
│   ├── collectNotes()
│   ├── extractDate()
│   ├── getMergedLinks()
│   └── getSubstringsWithPattern()
└── View (view.ts)
    ├── renderContent()
    ├── createDatesList()
    ├── createDateItem()
    ├── createFilesList()
    ├── createFileItem()
    ├── createMentionsList()
    └── createLink()
```

### Data Flow

```
1. Obsidian Metadata Cache "resolved" event
   ↓
2. Model.collectNotes()
   ├─ getMergedLinks()
   ├─ extractDate() for each link
   ├─ filter future dates
   ├─ vault.cachedRead() for content
   └─ getSubstringsWithPattern()
   ↓
3. Model emits "change" event
   ↓
4. View.onModelChange()
   ↓
5. View.renderContent()
   ↓
6. User sees updated list
```

### Event Flow

```
Plugin Load
└─> registerView()
└─> onLayoutReady()
    └─> initLeaf()
        └─> Create view in right sidebar

Metadata Cache Resolved
└─> Model.collectNotes()
    └─> Process all links
    └─> Emit "change"
        └─> View.renderContent()
            └─> Update DOM

User Clicks Link
└─> Event handler (preventDefault)
└─> workspace.openLinkText()
    └─> Obsidian opens file
```

## Testing Strategy

### Manual Test Cases

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| TC-1: Basic Display | 1. Create note with `[[2025-12-25]]`<br>2. Check view | Date appears in view with source file |
| TC-2: Context | 1. Add text around date link<br>2. Check view | Context text visible |
| TC-3: Navigation | 1. Click date link<br>2. Click source link | Both open correctly |
| TC-4: Updates | 1. Add new future date<br>2. Wait | New date appears automatically |
| TC-5: Custom Format | 1. Configure Daily Notes format<br>2. Create link in that format | Detected and displayed |
| TC-6: Past Dates | 1. Create link to yesterday<br>2. Check view | Not shown in view |
| TC-7: Multiple Mentions | 1. Add date link 3 times in one file<br>2. Check view | All 3 mentions shown |
| TC-8: Unresolved Links | 1. Link to future date (file doesn't exist)<br>2. Check view | Shown in view |

### Edge Case Testing

- Empty vault
- Very large vault (10,000+ notes)
- File with no mentions
- File that can't be read
- Corrupted daily notes settings
- Dates at year boundaries
- Leap year dates
- Today's date (should not appear)

### Performance Testing

```bash
# Create test vault with N notes
# Each note has 1-5 future date links
# Measure update time
# Expected: < 1s for 1000 notes
```

## Dependencies

### Runtime
- `obsidian`: Latest (provided by Obsidian)
- `obsidian-daily-notes-interface`: ^0.9.4
- `moment`: Bundled with Obsidian

### Development
- `typescript`: 4.7.4
- `esbuild`: 0.17.3
- `@typescript-eslint/eslint-plugin`: 5.29.0
- `@types/node`: ^16.11.6

## Migration and Rollout

### Installation
1. User downloads from Community Plugins
2. Enable plugin
3. View automatically opens in right sidebar

### No Data Migration
- Plugin doesn't store data
- All information derived from vault at runtime
- No settings to migrate

### Rollback
- Disable plugin in Obsidian settings
- No cleanup needed
- No data loss risk

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance issues on large vaults | High | Medium | Optimize with incremental updates (future) |
| Daily Notes plugin API changes | High | Low | Fallback to default format, version locking |
| Obsidian API breaking changes | High | Low | Test with beta versions, maintain compatibility layer |
| Unicode encoding issues | Medium | Low | Use UTF-8 consistently |
| File read permissions | Medium | Low | Try/catch with error logging |

## Future Enhancements

*(Out of scope for v1.x - documented for awareness)*

1. Filtering by date range
2. Search within mentions
3. Scroll to exact mention location
4. Mobile support
5. Task integration
6. Settings panel
7. Export functionality
8. Calendar view

## Success Criteria

- [ ] All functional requirements met
- [ ] Performance targets achieved
- [ ] All manual test cases pass
- [ ] Zero critical bugs in production
- [ ] Positive user feedback
- [ ] Compatible with latest Obsidian version

## Approval

**Specification Status:** Implemented
**Implementation Version:** v1.6.0
**Last Updated:** 2025-10-19
**Spec Version:** 1.0
