# Linux Process Manager — Rust (Fall 2025, CSCE 3401 Operating Systems)

A production-grade Linux process manager I built in Rust as the capstone for CSCE 3401 Operating Systems at AUC. The repo ships with 121 tests at 100% coverage on the core logic, which is the kind of thing I care about for systems software where a regression can corrupt state on a user's machine.

It's three surfaces over one core. There is a Ratatui-based TUI for interactive use in a terminal, a React web UI for remote access without SSH, and an Actix-web REST API that both clients (and any third party) talk to. The async runtime is Tokio. Persistence is SQLite for historical metrics and process events, with optional Prometheus and InfluxDB exporters for users who already have a metrics stack.

The features that pushed it past a school assignment: per-process GPU memory monitoring across NVIDIA, AMD, and Intel; container and cgroup awareness, so Docker, Kubernetes, and LXC processes are grouped and labeled correctly with their resource limits; per-process network connection tracking; statistical anomaly detection over the historical data to flag misbehaving processes; regex search; and batch operations across multiple processes (kill, signal, etc.). Standard process management is all there too — sort, filter, tree view, signal selection (TERM/KILL/HUP), real-time refresh.

This was a team project. I led the architecture and the systems-level integration (GPU, containers, anomaly detection); my teammates were Adam Aberbach, Mohamed Khalil Brik, and Ahmed Elaswar.
