# Educational Platform / Moodle Server (project README)
Source: /Users/yahya/Documents/Moodle-Server/README.md

# Educational Platform

A complete, self-hosted educational platform with zero configuration. Perfect for schools, universities, or personal learning.

## Features

| Service | Description |
|---------|-------------|
| Moodle | Learning Management System with plugins (STACK, H5P, gamification) |
| JupyterHub | Multi-user Python/R/Julia notebooks |
| Code Server | VS Code in your browser |
| Ollama | Local AI assistant integrated with Moodle |
| Maxima | Computer algebra system for STACK math questions |
| RStudio | R IDE for statistics |
| SageMath | Advanced mathematical software |
| Grafana | Monitoring dashboards |

## Quick Start

```bash
# Linux/macOS
./wizard.sh
# Windows
wizard.bat
```

Two installation modes:
- Personal: No passwords, instant access. For self-learners, students, developers.
- School: Full auth, domain, SSL, SSO. For universities, schools, institutions.

## Personal Mode URLs

- Dashboard: http://localhost:8080
- Moodle: http://localhost:8081
- JupyterHub: http://localhost:8000
- Code Server: http://localhost:8844
- RStudio: http://localhost:8787
- SageMath: http://localhost:8888

No passwords required - all services auto-login.

## School Mode

Custom domain with automatic Let's Encrypt SSL, OAuth2 SSO (Google, Microsoft, GitHub), Moodle user management, secure credential storage, production-ready configuration. Credentials saved to `edu-platform/CREDENTIALS.txt`.

## System Requirements

| Profile | RAM | Users | Services |
|---------|-----|-------|----------|
| Minimal | 4GB | 20 | Moodle only |
| Standard | 8GB | 50 | + Jupyter, Code Server, AI |
| Enhanced | 16GB | 100 | + RStudio, SageMath, Monitoring |
| Full | 32GB | 500+ | Everything |

## Moodle Plugins

- STACK - Math questions with computer algebra (Maxima backend)
- H5P - Interactive content (videos, quizzes, presentations)
- Level Up! - Gamification with XP and levels
- Attendance - Track student presence
- Custom Certificate - Generate course certificates
- Tiles/Board - Modern course formats

Install plugins after Moodle starts: `./edu-platform/scripts/setup-moodle-plugins.sh`.

Sample STACK courses: `STACK-demo.mbz` (full demo, hundreds of STACK questions), `STACK-syntax-quiz.mbz`, `HELM-questions.mbz`. Import via Site Administration > Courses > Restore.

## AI Integration (Ollama)

```bash
docker exec ollama ollama pull llama3.2
```

Configure in Moodle: Site Administration > AI > add Ollama provider `http://ollama:11434`. AI features: generate quiz questions, summarize course content, writing assistance.

## Architecture

Caddy reverse proxy with SSL fronts Moodle, JupyterHub, Code Server. Backed by PostgreSQL, Redis, Ollama, and Maxima (math engine for STACK). JupyterHub spawns notebooks via Docker.

## Manual Setup

```bash
cd edu-platform
cp templates/.env.personal .env  # or .env.school
docker compose -f docker-compose.yml -f docker-compose.personal.yml up -d
```

## License

MIT - Use freely for education.
