# CV Bot (project README)
Source: /Users/yahya/Documents/CV Bot/README.md

# CV Bot

Automated job search and application assistant. Upload your resume, get AI-suggested job titles, search LinkedIn, and generate tailored cover letters and CVs. Now with Easy Apply automation - scrape application questions, auto-generate answers, and submit with one click.

## Features

- Resume Parsing: Upload PDF or LaTeX resumes
- AI Job Suggestions: Get relevant job title suggestions based on your skills
- LinkedIn Search: Automated job search with pagination
- Smart Filtering: Filter jobs by match score and Easy Apply availability
- Cover Letter Generation: AI-generated cover letters for each job
- CV Tailoring: Automatically tailor your CV for specific jobs (preserves your template style)
- PDF Export: Download tailored CVs as PDF or LaTeX

### Easy Apply Automation

- Question Scraping: Automatically extract all Easy Apply form questions
- Smart Answer Generation: Answers generated from your resume, profile, and learned responses
- Review & Edit: Preview all answers before submitting - edit any that need correction
- One-Click Submit: Submit applications directly from the UI with visible browser
- Learning System: Remembers your corrections for future applications
- Work Authorization: Configure your visa status per country (50+ countries supported)

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/cv-bot.git
cd cv-bot
./run.sh

# Or via Docker
docker-compose up --build  # http://localhost:8501

# Manual
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
streamlit run ui/app.py
```

## Requirements

- Python 3.10+
- Chrome/Chromium browser
- LaTeX (texlive) for PDF generation
- OpenRouter API key (for AI features)

## Project Structure

```
cv-bot/
├── ui/app.py                    # Streamlit web interface
├── pipeline/
│   ├── dynamic_search.py        # Main search pipeline
│   ├── job_suggester.py         # AI job title suggestions
│   ├── answer_generator.py      # Easy Apply answer generation
│   └── resume_inference.py      # Extract data from resume
├── platforms/
│   ├── linkedin_fast.py         # LinkedIn job scraper
│   └── linkedin_easy_apply.py   # Easy Apply form automation
├── resume/
│   ├── latex_parser.py / pdf_parser.py
│   ├── resume_tailor.py         # Tailor CV for jobs
│   └── latex_generator.py       # Generate LaTeX + PDF
├── database/models.py           # SQLAlchemy models (jobs, applications, profiles)
├── Dockerfile / docker-compose.yml
└── run.sh
```

## Database

CV Bot uses SQLite to track:
- Jobs: All discovered jobs with bouncer analysis
- Applications: Submitted applications with status tracking
- User Profile: Your contact info and work authorization per country
- Learned Answers: Question-answer pairs learned from your corrections

## License

MIT
