# Contributing to RootSight V3

First off, thank you for considering contributing to RootSight V3! It's people like you that make RootSight a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. (Link to your CoC here or provide a brief summary).

## How Can I Contribute?

### Reporting Bugs

- **Check if the bug has already been reported.**
- **Use a clear and descriptive title** for the issue.
- **Describe the exact steps to reproduce the problem.**
- **Provide specific examples to demonstrate the steps.**

### Suggesting Enhancements

- **Check if the enhancement has already been suggested.**
- **Use a clear and descriptive title.**
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Explain why this enhancement would be useful** to most RootSight users.

### Pull Requests

- **Keep it small.** Smaller PRs are easier to review and more likely to be merged.
- **Include tests.** Every feature should have corresponding tests.
- **Update documentation.** If you change functionality, update the README or relevant docs.
- **Follow the coding style.** Use the existing code as a guide.

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- `uv` (for Python dependency management)

### Backend Setup
```bash
uv sync
uv run uvicorn src.main:app --reload
```

### Frontend Setup
```bash
npm install
npm run dev
```

## Questions?

Feel free to open an issue or reach out to the maintainers!
