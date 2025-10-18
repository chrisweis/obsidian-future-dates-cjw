# GitHub Setup Guide for Future Dates CJW Fork

This guide will help you set up your forked repository on GitHub and maintain it properly.

## Step 1: Create GitHub Repository

### Option A: Fork on GitHub (Recommended)

1. Go to the original repository: https://github.com/slonoed/obsidian-future-dates
2. Click the **"Fork"** button in the top-right
3. Choose your account
4. **Important**: Rename the fork to `obsidian-future-dates-cjw`
5. Update the description: "Future Dates plugin fork with enhancements"

### Option B: Create New Repository

If you prefer a fresh start without the fork connection:

1. Go to https://github.com/new
2. **Repository name**: `obsidian-future-dates-cjw`
3. **Description**: "Obsidian plugin to track future dates (Fork with enhancements)"
4. **Public** (required for Obsidian Community Plugins)
5. **DO NOT** initialize with README (you already have one)
6. Click "Create repository"

## Step 2: Update Your Local Repository

### Set Remote URL

```bash
# Check current remote
git remote -v

# If it's still pointing to the original, update it
git remote set-url origin https://github.com/chrisweis/obsidian-future-dates-cjw.git

# Verify
git remote -v
```

### Update Files with Your GitHub Username

Replace `chrisweis` in these files with your actual username:

**Files to update:**
- `manifest.json` (line 8 and 10)
- `package.json` (line 16)
- `README.md` (lines 32, 119, 120, 121)
- `FORK.md` (multiple locations)

Quick find-and-replace:
```bash
# On Unix/Mac/Git Bash
find . -type f -name "*.json" -o -name "*.md" | xargs sed -i 's/chrisweis/your-actual-username/g'

# Or manually edit each file
```

## Step 3: Initial Commit and Push

### Commit Your Fork Changes

```bash
# Check status
git status

# Add all fork-related changes
git add manifest.json package.json versions.json README.md FORK.md GITHUB_SETUP.md

# Commit
git commit -m "Fork: Rebrand as Future Dates CJW v1.4.0

- Updated manifest.json with new ID and name
- Updated package.json with fork details
- Enhanced date display (clean format without brackets)
- Removed debug console.log
- Added comprehensive spec-kit documentation
- Created README and FORK documentation

Fork of: https://github.com/slonoed/obsidian-future-dates
Original author: Dmitry Manannikov"

# Push to GitHub
git push -u origin main
```

## Step 4: Create First Release

### 1. Tag the Release

```bash
# Create annotated tag
git tag -a v1.4.0 -m "v1.4.0 - Initial fork release

Changes from original v1.3.4:
- Clean date display (no brackets)
- Removed debug logging
- Added spec-kit documentation
- Improved code quality"

# Push tag
git push origin v1.4.0
```

### 2. Create GitHub Release

1. Go to your repository on GitHub
2. Click **"Releases"** (right sidebar)
3. Click **"Create a new release"**
4. Select tag: `v1.4.0`
5. Release title: `v1.4.0 - Initial Fork Release`
6. Description:

```markdown
# Future Dates CJW v1.4.0

Initial release of the forked version with enhancements.

## What's New

✨ **Enhancements:**
- Clean date display: Shows `2025-12-25` instead of `[[2025-12-25]]` in context
- Removed debug console.log statements
- Added comprehensive spec-kit documentation in `.specify/` directory
- Better code quality and maintainability

## Installation

Download `main.js`, `manifest.json`, and `styles.css` from the assets below, then follow the [installation instructions](https://github.com/chrisweis/obsidian-future-dates-cjw#installation).

## Credits

Fork of [Future Dates](https://github.com/slonoed/obsidian-future-dates) by Dmitry Manannikov.

## Changelog

See [FORK.md](https://github.com/chrisweis/obsidian-future-dates-cjw/blob/main/FORK.md) for detailed changes.
```

7. **Attach files** (drag and drop):
   - `main.js`
   - `manifest.json`
   - `styles.css`

8. Click **"Publish release"**

## Step 5: Repository Settings

### Update Repository Details

1. Go to Settings (your repo)
2. **About** section (right sidebar on main page):
   - Description: "Obsidian plugin to track future dates in your vault (Fork with enhancements)"
   - Website: Leave blank or add your personal site
   - Topics: `obsidian`, `obsidian-plugin`, `future-dates`, `planning`, `fork`
   - ✅ Check "Releases"
   - ✅ Check "Packages"

### Enable GitHub Pages (Optional)

If you want documentation hosting:
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` / `docs` (if you create a docs folder)

### Add Fork Attribution

1. On your repo main page, you should see "forked from slonoed/obsidian-future-dates"
2. If not (because you created new repo), add to README header

## Step 6: Ongoing Maintenance

### When Making Changes

```bash
# Create feature branch
git checkout -b feature/description

# Make changes and commit
git add .
git commit -m "feat: description of change"

# Push and create PR
git push -u origin feature/description

# Merge via GitHub PR

# Pull latest to main
git checkout main
git pull
```

### Creating New Releases

```bash
# Update version in manifest.json and package.json
npm version patch  # or minor, or major

# Build
npm run build

# Commit version bump
git add manifest.json package.json versions.json
git commit -m "chore: bump version to 1.4.1"

# Tag
git tag -a v1.4.1 -m "v1.4.1 release notes"

# Push
git push && git push --tags

# Create GitHub release (see Step 4.2)
```

### Syncing with Original (Optional)

If you want to pull updates from the original repository:

```bash
# Add original as upstream (one time)
git remote add upstream https://github.com/slonoed/obsidian-future-dates.git

# Fetch upstream changes
git fetch upstream

# View differences
git log HEAD..upstream/main --oneline

# Merge if desired (careful - may have conflicts)
git merge upstream/main

# Or cherry-pick specific commits
git cherry-pick <commit-hash>
```

## Step 7: Community Plugin Submission (Optional)

If you want to list in Obsidian Community Plugins:

1. **Requirements:**
   - Repository must be public
   - Must have releases with `main.js`, `manifest.json`, `styles.css`
   - Must follow Obsidian plugin guidelines

2. **Submit PR to Obsidian:**
   - Fork https://github.com/obsidianmd/obsidian-releases
   - Add your plugin to `community-plugins.json`
   - Create PR with plugin details

3. **Wait for review** (may take several weeks)

See https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin for details.

## Checklist

Before considering setup complete:

- [ ] Repository created on GitHub
- [ ] All `chrisweis` replaced with actual username
- [ ] Remote URL updated to your fork
- [ ] Initial commit pushed
- [ ] v1.4.0 tag created and pushed
- [ ] GitHub release created with assets
- [ ] Repository description and topics set
- [ ] README properly displays on GitHub
- [ ] FORK.md and GITHUB_SETUP.md committed

## Troubleshooting

### Can't push to GitHub

**Problem:** Permission denied or authentication failed

**Solution:**
```bash
# Use SSH instead of HTTPS
git remote set-url origin git@github.com:chrisweis/obsidian-future-dates-cjw.git

# Or use GitHub CLI
gh auth login
```

### Build files not in release

**Problem:** Forgot to attach `main.js` to release

**Solution:**
1. Edit the release on GitHub
2. Drag and drop the files
3. Update release

### Version conflicts

**Problem:** `versions.json` has wrong format

**Solution:**
Ensure it only has your fork versions:
```json
{
  "1.4.0": "0.15.0"
}
```

## Support

- **GitHub Issues**: https://github.com/chrisweis/obsidian-future-dates-cjw/issues
- **Obsidian Discord**: #plugin-dev channel
- **Original Plugin**: https://github.com/slonoed/obsidian-future-dates

---

**Next Steps:** After setup, see `.specify/tasks/current-tasks.md` for development roadmap!
