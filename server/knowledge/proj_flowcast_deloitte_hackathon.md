# FlowCast / Deloitte x AUC Hackathon (project README)
Source: /Users/yahya/Documents/flowcast/hackathon-repo/README.md

# Deloitte x AUC Hackathon

The hackathon repository (Yahya competed and won the Deloitte Innovation Hub Hackathon at AUC in February 2026 with this project — internal naming used "flowcast"). Clients come to consultants with problems, not solutions; success requires Technical Skills, Business Thinking, Team Work, and Communication.

## Use Cases (Clients)

### Fresh Flow Markets: Inventory Management

Restaurant and grocery owners face a relentless balancing act between over-stocking (waste, expired inventory) and under-stocking (stockouts, lost revenue). The root cause: poor demand forecasting. FreshFlow needs intelligent systems, not gut instinct.

Potential business questions:
- How do we accurately predict daily, weekly, and monthly demand?
- What prep quantities should kitchens prepare to minimize waste?
- How can we prioritize inventory based on expiration dates?
- What promotions or bundles can move near-expired items profitably?
- How do external factors (weather, holidays, weekends) impact sales?

### Flavor Flow Craft: Menu Engineering

FlavorCraft sits on a goldmine of historical sales data, yet menu decisions are based on hunches. They don't know which dishes are losing money or which tweaks could turn underperformers into bestsellers.

Potential business questions:
- Which menu items are stars, plowhorses, puzzles, or dogs?
- How should we adjust pricing to maximize profitability?
- What wording or descriptions increase item sales?
- Which items should be promoted, re-engineered, or eliminated?
- What hidden patterns exist in customer purchasing behavior?

### Quick Serve Kitchens: Shift Planning

Schedules disrupted by call-offs and viral demand spikes. QuickServe needs a Shift Wizard that monitors schedules, coverage, PTO, surprise events, and constantly recommends the next best move.

Potential business questions:
- How do we predict demand spikes from social media, weather, or events?
- What is the optimal staffing level for each shift?
- How do we quickly adjust when call-offs happen?
- How can we balance labor costs with service quality?
- How do we incorporate employee preferences while meeting business needs?

## Datasets

Provided via GitHub Releases on `https://github.com/ynakhla/DIH-X-AUC-Hackathon/releases/tag/v1.0-data`:
- inventory-management.zip (667 MB) - Use Case 1: Fresh Flow Markets
- menu-engineering-part1.zip (1.4 GB) - Use Case 2 (BOTH parts required)
- menu-engineering-part2.zip (1.2 GB)
- shift-planning.zip (292 MB) - Use Case 3: Quick Serve Kitchens

Data notes:
- All timestamps are UNIX integers (use `FROM_UNIXTIME()` in MySQL)
- All monetary values are in DKK (Danish Krone)

## Evaluation Criteria

- Documentation Quality (clarity and completeness of README, code comments, docstrings)
- Code Architecture & Modularity (separation of concerns, logical folder hierarchy)
- Team Collaboration (GitHub commit history; even split scored highest)
- AI/ML Integration (implementation, documentation, effectiveness)
- Business Value & Innovation (practical applicability, real-world impact)
