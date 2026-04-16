<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/09865f31-c4af-42bf-b457-63bcff5c79c9

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Repository Workflow

- Pull Requests use template: [.github/pull_request_template.md](.github/pull_request_template.md)
- Issues use templates in: [.github/ISSUE_TEMPLATE](.github/ISSUE_TEMPLATE)
- CI checks run from: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Release draft automation: [.github/workflows/release-drafter.yml](.github/workflows/release-drafter.yml)
- Label automation: [.github/workflows/labels-sync.yml](.github/workflows/labels-sync.yml)

## Project Policies

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Dependabot config: [.github/dependabot.yml](.github/dependabot.yml)
