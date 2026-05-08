# Beltone Hackathon - MDVRP Solver (project README)
Source: /Users/yahya/Documents/Beltone Hackathon/README.md

# Beltone Hackathon - MDVRP Solver

Team: Vibe Coders
Multi-Depot Vehicle Routing Problem solver for Beltone AI Hackathon.

## Current Performance

Submission File: `VibeCoders_solver_1.py`

- Fulfillment: 78-88% (39-44 out of 50 orders)
- Cost: ~$7,000
- Distance: 240-290 km
- Reliability: 100% validation success, 92-100% execution

## Quick Start

```bash
pip install robin-logistics-env
python test_solver.py        # Test solver
python run_dashboard.py      # Interactive Streamlit dashboard
```

The dashboard shows road network and order visualization, route testing/validation, and real-time performance metrics.

## Project Structure

```
.
├── VibeCoders_solver_1.py     # Main submission solver (78-88% fulfillment)
├── test_solver.py             # Validation script
├── run_dashboard.py           # Interactive visualization
├── solver.py                  # Original skeleton/template
├── README.md / API_REFERENCE.md / claude.md
├── requirements.txt
├── studies/                   # Research papers
└── Hackathon Document.docx
```

## Algorithm Overview

Strategy: Multi-order greedy assignment with capacity-aware routing.

Key features:
1. BFS Pathfinding - Shortest path on road network
2. Multi-order Packing - 3-5 orders per vehicle based on type
3. Two-pass Assignment - Primary + mop-up passes
4. Three-level Fallback - Full list -> Half -> Single order
5. Capacity & Inventory Validation - Strict constraint checking
6. Nearest Neighbor Optimization - Delivery sequence optimization

## Submission

- Portal: https://beltone-ai-hackathon.com/
- Team: Vibe Coders
- File: `VibeCoders_solver_1.py`

Scoring formula: `Score = Cost + (Benchmark x (100 - Fulfillment%))`. Strategy: Maximize fulfillment first, then minimize cost.

## Research Insights

Incorporates academic TSP research:
- Heuristic over Optimal: Fast approximations beat expensive exact solutions
- Fallback Logic: Try multiple configurations to maximize success rate
- Capacity Safety: Conservative margins prevent route failures
- Nearest Neighbor: O(n^2) routing optimization

Key learning: Simple "try-and-fail" approaches empirically outperform complex pre-filtering strategies in this constrained environment.

## Contact

- Package: https://github.com/RobinDataScience/Logistics-Env
- Contact: mario.salama@beltoneholding.com
- Version: 3.3.0
