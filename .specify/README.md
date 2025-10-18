# Spec-Kit Documentation

This directory contains the spec-kit documentation for the Obsidian Future Dates plugin, following the [GitHub Spec-Kit](https://github.com/github/spec-kit) structure for spec-driven development.

## Directory Structure

```
.specify/
├── memory/
│   └── constitution.md      # Project principles and standards
├── specs/
│   └── future-dates-core.md # Feature specifications
├── tasks/
│   └── current-tasks.md     # Actionable task list
├── templates/               # Templates for new specs (future)
├── scripts/                 # Automation scripts (future)
├── plan.md                  # Implementation plan and roadmap
└── README.md               # This file
```

## Files Overview

### constitution.md
**Location:** `.specify/memory/constitution.md`

The project's governing document that establishes:
- Core principles (Simplicity, Integration, Performance, UX)
- Technical standards and architecture decisions
- Development workflow and release criteria
- Scope boundaries (what's in/out)
- Success metrics

**Purpose:** Guide all development decisions and maintain project consistency.

**When to reference:** Before implementing features, during code reviews, when making architectural decisions.

---

### future-dates-core.md
**Location:** `.specify/specs/future-dates-core.md`

Complete technical specification for the core plugin functionality:
- User stories and problem statement
- Functional requirements (FR-1 through FR-5)
- Non-functional requirements (performance, compatibility, reliability)
- Data models and architecture
- UI design and interaction patterns
- Testing strategy

**Purpose:** Single source of truth for what the plugin should do and how.

**When to reference:** During implementation, testing, or when questions arise about intended behavior.

---

### plan.md
**Location:** `.specify/plan.md`

Development plan covering:
- Completed phases (Foundation → Release)
- Current maintenance activities
- Future phases (Quality Improvements → Mobile Support)
- Timeline and resource requirements
- Risk management
- Success metrics

**Purpose:** Roadmap for past, present, and future development.

**When to reference:** Planning sprints, estimating work, understanding project history.

---

### current-tasks.md
**Location:** `.specify/tasks/current-tasks.md`

Actionable task list with:
- Active sprint tasks (High/Medium/Low priority)
- Future feature tasks (v2.0, v3.0)
- Detailed acceptance criteria
- Effort estimates and dependencies
- Status tracking

**Purpose:** Track specific work items and guide implementation.

**When to reference:** Daily development, sprint planning, picking up new work.

---

## Using This Structure

### For Development

1. **Starting a new feature:**
   - Check `constitution.md` - Does it align with principles?
   - Review `plan.md` - Is it on the roadmap?
   - Create spec in `specs/` if major feature
   - Add tasks to `tasks/current-tasks.md`

2. **Implementing a task:**
   - Read task details in `current-tasks.md`
   - Reference related spec for requirements
   - Follow standards in `constitution.md`
   - Update task status when complete

3. **Making architectural decisions:**
   - Consult `constitution.md` for principles
   - Check `specs/` for existing patterns
   - Document decision if significant

### For Maintenance

1. **Bug fixes:**
   - Add task to `current-tasks.md` with priority
   - Reference affected spec
   - Follow constitution quality standards

2. **Dependency updates:**
   - Follow process in `plan.md`
   - Update `current-tasks.md` when scheduled

3. **Documentation updates:**
   - Keep specs in sync with implementation
   - Update plan.md when roadmap changes
   - Maintain constitution as principles evolve

### For Contributors

1. **First time:**
   - Read `constitution.md` to understand project values
   - Review `plan.md` for context
   - Check `current-tasks.md` for available work

2. **Before submitting PR:**
   - Verify alignment with constitution
   - Reference task/spec number in PR
   - Ensure acceptance criteria met

## Spec-Kit Workflow

The intended workflow follows these phases:

1. **Constitution** - Establish principles ✅ Done
2. **Specify** - Define requirements ✅ Done
3. **Plan** - Create implementation plan ✅ Done
4. **Tasks** - Break down into actionable items ✅ Done
5. **Implement** - Execute tasks (Ongoing)

## Document Maintenance

### Update Frequency

| Document | Update Trigger |
|----------|---------------|
| constitution.md | Rarely (major philosophy changes) |
| specs/*.md | When requirements change or new features added |
| plan.md | Quarterly or when roadmap changes |
| tasks/*.md | Daily/weekly as work progresses |

### Version Control

- All spec documents are version controlled in git
- Major changes should be discussed before committing
- Use descriptive commit messages for spec changes

### Document Ownership

| Document | Owner | Approvers |
|----------|-------|-----------|
| constitution.md | Project Lead | Core team consensus |
| specs/*.md | Feature Lead | Code reviewers |
| plan.md | Project Lead | Core team |
| tasks/*.md | Any developer | Self-managed |

## AI Assistant Integration

This structure is optimized for use with AI coding assistants like Claude Code, GitHub Copilot, and others:

- AI can reference constitution for code style and principles
- AI can read specs to understand requirements
- AI can check tasks for implementation details
- AI can update task status as work progresses

### AI Commands (if using spec-kit CLI)

If you have the `specify` CLI installed:
- `/speckit.constitution` - Review/update constitution
- `/speckit.specify` - Create new specification
- `/speckit.plan` - Review/update plan
- `/speckit.tasks` - Manage task list
- `/speckit.implement` - Start implementation with context

## Additional Resources

- **GitHub Spec-Kit:** https://github.com/github/spec-kit
- **Spec-Driven Development:** https://developer.microsoft.com/blog/spec-driven-development-spec-kit
- **Project Repository:** https://github.com/slonoed/obsidian-future-dates

## Future Additions

Potential additions to this structure:

- **templates/**: Template files for creating new specs
- **scripts/**: Automation scripts for common tasks
- **decisions/**: Architecture decision records (ADRs)
- **testing/**: Test plans and strategies
- **api/**: API documentation if applicable

---

**Last Updated:** 2025-10-18
**Spec-Kit Version:** 1.0
**Maintained By:** Project maintainers
