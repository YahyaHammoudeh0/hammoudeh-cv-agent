# OS Lab Final: CPU Scheduling Algorithms Comparison (project report)
Source: /Users/yahya/Documents/OS Lab Final/REPORT_FOR_SLIDES.md

# CPU Scheduling Algorithms Comparison

OS Lab 12 Final Project, December 8, 2025.
Team: Mohammad Yahya Hammoudeh, Mohamed Khalil Brik, Ahmed Elaswar.

## Objective

Compare four CPU scheduling algorithms using identical process sequences. Evaluate based on three optimization criteria: Turnaround Time, Waiting Time, Response Time. Represent comparisons as plots with at least 20 data points on x-axis.

## Algorithms Implemented

| Algorithm | Type | Description |
|-----------|------|-------------|
| FCFS | Non-preemptive | Processes execute in arrival order |
| Round Robin | Preemptive | Time quantum = 4, fair CPU distribution |
| SJF (Preemptive) | Preemptive | Shortest Remaining Time First (SRTF) |
| MLFQ | Preemptive | 3 queues with function pointers for scheduling |

MLFQ Configuration: Q0 Round Robin (quantum=4), Q1 Round Robin (quantum=8), Q2 FCFS.

## Team Member Roles

- Mohammad Yahya Hammoudeh: Algorithm Implementation (FCFS, Round Robin)
- Mohamed Khalil Brik: Algorithm Implementation (SJF, MLFQ)
- Ahmed Elaswar: Data Generation, Experiment Design, Testing & Documentation

## Process Attributes

`pid`, `arrival_time`, `burst_time`, `remaining_time`, `start_time`, `completion_time`, `current_queue`. `remaining_time` enables preemptive algorithms; `start_time` needed for Response Time; `current_queue` tracks process movement in MLFQ.

## Workload Generation

Arrival Times: Inter-arrival times follow exponential distribution with rate lambda (Poisson process). Burst Times: Exponential distribution (many short jobs, few long ones — realistic workload). Industry standard for workload modeling, memoryless property simplifies analysis.

## Curve Smoothing

Each data point represents the median of 51 simulation runs. Odd number ensures unique median. Different random seeds per run. Same seeds across all algorithms for fair comparison. Median chosen for robustness against outliers, no artificial smoothing applied.

## Experiment Design

| Experiment | X-Axis Variable | Fixed Parameters | Data Points |
|------------|-----------------|------------------|-------------|
| 1. System Load | Number of Processes (5-100) | lambda=5, burst=10 | 20 |
| 2. Arrival Rate | lambda (1-20) | 50 processes, burst=10 | 20 |
| 3. Job Size | Mean Burst Time (2-40) | 50 processes, lambda=5 | 20 |

Each experiment: 20 data points x 51 runs x 4 algorithms.

## Results Summary

| Metric | Winner | Reason |
|--------|--------|--------|
| Turnaround Time | SJF (Preemptive) | Prioritizes short jobs, clears queue faster |
| Waiting Time | SJF (Preemptive) | Short jobs finish quickly, less queue wait |
| Response Time | MLFQ | High-priority queue gives immediate CPU access |

## Conclusions

- SJF is theoretically optimal for Turnaround/Waiting Time, but impractical (requires knowing burst times in advance).
- MLFQ is the practical winner — best Response Time for interactive systems, adapts to process behavior without prior knowledge.
- FCFS suffers from convoy effect (long jobs delay all following short jobs).
- Round Robin ensures fairness — good Response Time but higher Turnaround.

Recommendations: Interactive systems -> MLFQ. Batch processing -> SJF (if burst times known). Simple/embedded systems -> FCFS. Time-sharing -> Round Robin.

## Source Code Structure

```
OS Lab Final/
├── process.py          # Process class definition
├── generator.py        # Exponential distribution generators
├── simulator.py        # Core simulation engine
├── experiment.py       # 51-run median logic
├── main.py             # Main entry point
├── schedulers/
│   ├── fcfs.py         # First Come First Served
│   ├── round_robin.py  # Round Robin (quantum=4)
│   ├── sjf.py          # SJF Preemptive (SRTF)
│   └── mlfq.py         # MLFQ with function pointers
└── results/
    ├── results.xlsx    # Excel (3 sheets)
    └── plots/          # 9 PNG graphs
```

Key implementation notes: median-of-51-runs smoothing per professor's requirement. MLFQ uses function pointers for each queue's scheduler (`rr_queue_scheduler` for Q0/Q1, `fcfs_queue_scheduler` for Q2).
