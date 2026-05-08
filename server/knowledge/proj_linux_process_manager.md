# Linux Process Manager (LPM) (project README)
Source: /Users/yahya/Documents/linux-process-manager/README.md

# Linux Process Manager (LPM)

A comprehensive, production-ready process manager for Linux systems with advanced monitoring, alerting, and control capabilities. Built in Rust for maximum performance and safety.

Course: CSCE 3401 - Operating Systems, Fall 2025

## Team Members
- Adam Aberbach (ID: 900225980)
- Mohammad Yahya Hammoudeh (ID: 900225938)
- Mohamed Khalil Brik (ID: 900225905)
- Ahmed Elaswar (ID: 900211265)

## Features

Core (Priority 1) — 100% complete:
- Display all running processes with PID, name, user, CPU%, memory usage
- Kill processes with signal selection (TERM, KILL, HUP, etc.)
- Sort by any column (CPU, memory, PID, name)
- Filter by user, name pattern, or resource threshold
- Tree view showing parent-child relationships
- Real-time updates with configurable refresh rate

Advanced (Priority 2) — 100% complete:
- Per-process network connection monitoring
- Container/cgroup awareness (Docker, Kubernetes, LXC)
- Historical data storage with SQLite backend
- System-wide resource graphs (CPU, memory sparklines)
- Process search with regex support
- Batch operations on multiple processes

Innovative (Priority 3) — 100% complete:
- GPU monitoring with per-process attribution (NVIDIA/AMD/Intel)
- Web UI for remote access without SSH
- REST API for programmatic access
- Prometheus/InfluxDB metrics export
- Anomaly detection using statistical analysis
- Kubernetes pod-level aggregation

Overall status: 100% complete — all 18 planned features implemented.

## Quick Start

Docker (recommended):
```bash
docker build -t linux-process-manager .
docker run -d -p 8080:8080 --pid=host --name procmgr linux-process-manager
xdg-open http://localhost:8080
docker run -it --rm --pid=host linux-process-manager ./process-manager  # interactive TUI
```

Build from source:
```bash
cargo build --release
./target/release/process-manager           # Interactive TUI
./target/release/process-manager --tree    # Tree view
./target/release/process-manager --refresh 1
./target/release/process-manager --api --api-port 8080  # REST + Web UI
./target/release/process-manager --export prometheus --export-file metrics.prom
./target/release/process-manager --export influxdb > metrics.influx
```

## Keyboard Controls

Navigation: ↑/↓ navigate, q quit, r/F5 refresh, h/F1 help.
Sorting: p PID, n name, u user, c CPU, m memory, s start time.
Actions: k kill, / search (regex), t tree, g graphs, o user-only.
Kill dialog: t SIGTERM(15), 9 SIGKILL(9), 1 SIGHUP, 2 SIGINT, s SIGSTOP, c SIGCONT.

## Architecture

Core components:
- `src/process.rs` - /proc filesystem interface, sysinfo crate, enumeration/control
- `src/ui.rs` - ratatui-based real-time terminal UI
- `src/tree.rs` - hierarchical parent-child visualization
- `src/api.rs` - REST API server
- `src/gpu.rs`, `src/network.rs`, `src/history.rs`, `src/metrics.rs`, `src/anomaly.rs` etc.

Tech stack: Rust, ratatui (TUI), sysinfo (cross-platform info), crossterm (terminal), users (Unix user/group).

## Web UI

React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Lucide React. Real-time process monitoring with configurable auto-refresh (1-30 seconds), sortable columns (PID, Name, User, CPU%, Memory), full-text search, system overview cards, process actions with signal selection, status badges, connection indicator, professional light-mode design. Production build served by the Rust API server at http://localhost:8080.

## Performance

- Low CPU overhead (~1-2% on typical systems)
- Minimal memory footprint (~5-10MB)
- No disk I/O except for /proc reads
- Efficient /proc parsing, minimal allocations in hot paths

## Comparison vs htop / top / ps

LPM uniquely adds: Resource Graphs, Container Awareness, GPU Monitoring, Historical Data, REST API, Web UI, Metrics Export, Anomaly Detection — none of which htop/top/ps offer.

## Testing

`cargo test` runs all 121 tests. `bash test.sh` for quick validation. `cargo +nightly bench --no-run` to compile benchmarks.
