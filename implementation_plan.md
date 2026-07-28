# Implementation Plan - SentinelOT X: Enterprise PLC Logic Drift & Unauthorized Change Detection

SentinelOT X is a production-ready, enterprise-grade OT/ICS cybersecurity platform designed to detect unauthorized PLC (Programmable Logic Controller) logic changes, analyze operational impact with Explainable AI, compute risk scores, visualize industrial attack surfaces & digital twins, perform attack replays, and execute one-click rollbacks.

## System Architecture

```
                                  +------------------------------------+
                                  |     SentinelOT X UI (Next.js 14)   |
                                  | Dark Enterprise OT Cybersecurity UI|
                                  +-----------------+------------------+
                                                    |
                                       REST APIs / OpenAPI (JWT Auth)
                                                    v
                                  +------------------------------------+
                                  |     FastAPI Python Core Engine     |
                                  +--------+------------------+--------+
                                           |                  |
                    +----------------------+                  +----------------------+
                    v                                                                v
   +----------------------------------+                            +----------------------------------+
   |        OT Security Engines       |                            |         AI & Analytics           |
   | • Logic Diff & Baseline Hash     |                            | • Explainable AI Copilot         |
   | • SHA-256 Drift Detector         |                            | • Risk Engine & UEBA             |
   | • 3D/2N Digital Twin Engine      |                            | • Financial/Downtime Estimator   |
   | • Attack Replay Simulator        |                            | • Executive PDF Reporter         |
   | • IEC 62443 / NIST Compliance    |                            |                                  |
   +----------------------------------+                            +----------------------------------+
                                           |
                                           v
                                  +------------------------------------+
                                  |  MongoDB / Motor Persistent Engine |
                                  |   (With Fallback Seed In-Memory)   |
                                  +------------------------------------+
```

---

## Technical Stack & Design System

### 1. Frontend (Next.js 14 + React + TypeScript)
- **Styling**: Tailwind CSS with custom OT Cyberpunk Dark Palette (`#0B0F17` Obsidian Slate, `#00F0FF` Electric Cyan, `#FF0055` Alarm Crimson, `#39FF14` Safety Green, `#FFB800` Amber Warning).
- **Icons & UI**: Lucide React, Framer Motion (smooth micro-animations, pulse alerts, scanner sweep effects), custom glassmorphism components.
- **Charts & Graphs**: Recharts (Risk timelines, drift distributions, downtime financial impact graphs).
- **Topology & Attack Surface**: Custom interactive node-edge process flow graph for OT asset connectivity & vulnerability mapping.
- **Digital Twin & Process Simulation**: Custom interactive Canvas / 3D Canvas rendering industrial pipelines, pump pressures, valve positions, temperature gauges, and live sensor telemetry under attack.
- **Code & Logic Diff**: Side-by-side PLC Ladder Logic / Structured Text (ST / SCL) diff viewer with syntax highlighting and line-level unauthorized modification callouts.

### 2. Backend (FastAPI + Python + Pydantic v2)
- **FastAPI**: Async endpoints with OpenAPI / Swagger UI specs.
- **Authentication**: JWT tokens, RBAC roles (`Executive`, `SOC Analyst`, `OT Engineer`, `Auditor`).
- **Logic Diff & Hash Engine**: SHA-256 baseline validation, AST/Token-based diff analysis for Siemens S7, Allen-Bradley ControlLogix, and Schneider Modicon PLCs.
- **Explainable AI (XAI)**: Rule-guided LLM/Natural Language impact simulator explaining raw logic drifts into human-understandable operational risks (e.g., *"Timer delay modified from 5.0s to 0.1s causing thermal runaway hazard in Primary Chlorine Injector"*).
- **Risk Engine & UEBA**: Real-time risk scoring formula combining asset criticality, vulnerability index, protocol anomaly scores, and user behavior heuristics.
- **Compliance Alignment**: Automatic mapping of logic drift events to IEC 62443, NIST SP 800-82, and MITRE ATT&CK for ICS matrices.

---

## Key Modules & Features

### 1. Executive Dashboard
- Financial Loss & Downtime Risk Estimator ($ / hr loss metrics).
- High-level Posture Score, Active Incidents Counter, Fleet Drift Ratio.
- Executive Decision Assistant (One-click guidance summary for CISO/VP Operations).

### 2. SOC Dashboard (Security Operations Center)
- Real-time Alert Triage feed with severity filtering (Critical, High, Medium, Low).
- MITRE ATT&CK for ICS Matrix mapping (e.g., T0843 - Program Download, T0855 - Unauthorized Command Exec).
- Threat Intelligence feed integration (Known ICS CVEs, rogue IP connections, unauthorized engineering workstation logins).

### 3. OT Engineer Dashboard & PLC Inventory
- Multi-site industrial inventory (Chemical Plant Alpha, Water Treatment Site 02, Power Substation Gamma).
- Baseline hash enforcement (SHA-256 signature verification).
- Firmware, IP, Modbus/Profinet/EtherNet/IP protocol status indicators.

### 4. Logic Diff & Drift Viewer
- Side-by-side text/AST diff of PLC code (Original Baseline vs. Current Runtime State).
- Line-by-line highlight of modified rungs, altered setpoints, bypassed safety interlocks, and injected malicious timer routines.
- Root Cause Analysis & Forensic Timeline.

### 5. Digital Twin Process Visualizer & Attack Replay
- Interactive 3D/2D Industrial Process diagram (Pumps, Valves, Pressure Tanks, Heat Exchangers).
- Visual indicator of compromised components when logic drift is detected.
- **Attack Replay Mode**: Step-by-step playback slider showing how an unauthorized logic change triggers operational degradation over time.

### 6. One-Click Rollback Engine
- Secure baseline restoration tool with confirmation checks, cryptographic validation, and post-rollback hash verification simulation.

### 7. Executive PDF & Compliance Reporting
- One-click report generation detailing incident timelines, root causes, compliance impact (IEC 62443 / NIST), and audit trails.

---

## Proposed Project File Structure

```
c:\Users\Admin\OneDrive\Desktop\SentinelOT X\
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.mjs
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Landing / Overview page
│   │   │   ├── executive/page.tsx          # Executive Dashboard
│   │   │   ├── soc/page.tsx                # SOC Triage & Threat Intel
│   │   │   ├── engineer/page.tsx           # Engineer Dashboard & PLC Fleet
│   │   │   ├── plcs/[id]/page.tsx          # Detailed PLC View
│   │   │   ├── logic-diff/page.tsx         # Side-by-Side PLC Logic Diff
│   │   │   ├── digital-twin/page.tsx       # Digital Twin & Attack Replay
│   │   │   ├── compliance/page.tsx         # IEC 62443 / NIST / MITRE ICS
│   │   │   ├── audit/page.tsx              # Audit Log & UEBA
│   │   │   └── reports/page.tsx            # Executive Report Generator
│   │   ├── components/
│   │   │   ├── layout/                     # Sidebar, Header, Global Nav
│   │   │   ├── dashboards/                 # Chart widgets, Metrics, KPI Cards
│   │   │   ├── plc/                        # Logic Diff, SHA-256 Hash Badge, Code Viewer
│   │   │   ├── digital-twin/               # Interactive Canvas Process Diagram & Replay Control
│   │   │   ├── ai/                         # Copilot Chat, Explainable AI Modal, Impact Simulator
│   │   │   └── ui/                         # shadcn-style badges, buttons, cards, modals, sliders
│   │   ├── lib/                            # API client, Mock DB / Data seed, Utilities
│   │   └── types/                          # TypeScript types for PLCs, Drifts, Alerts, Audits
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── app/
│   │   ├── main.py                         # FastAPI app entry point with OpenAPI docs
│   │   ├── core/                           # Security, Auth JWT, Config
│   │   ├── models/                         # Pydantic schemas (PLC, Drift, Alert, Audit)
│   │   ├── routers/                        # Endpoints for Auth, PLCs, Drift, Diff, AI, Reports
│   │   └── services/                       # Logic Diff engine, Risk calculator, Seed generator
├── docker-compose.yml
├── README.md                               # Project documentation & quickstart
└── pitch/                                  # Hackathon Deliverables
    ├── DEMO_SCRIPT.md                      # Step-by-step 3-minute hackathon pitch script
    ├── JUDGE_QA_CHEAT_SHEET.md             # 15 anticipated tough questions & responses
    ├── PITCH_DECK_OUTLINE.md               # 10-slide winning presentation structure
    └── DEPLOYMENT_GUIDE.md                 # Production Docker & Cloud deployment guide
```

---

## User Review Required

> [!IMPORTANT]
> **Complete End-to-End Implementation**: The frontend will be fully interactive with rich animations, live diff comparison, real-time simulated telemetry stream, attack replay controls, digital twin visualization, and AI copilot context drawer. The backend will provide complete REST endpoints with full mock seed fallback capability so the application can be run seamlessly both standalone and with Docker.

> [!TIP]
> **Hackathon Pitch Materials**: In addition to functional source code, we will include a comprehensive `pitch/` directory containing a script for judges, Q&A defense answers, slide deck outline, and deployment instructions.

---

## Verification Plan

### Automated Verification
1. **Frontend Build Verification**: Run `npm run build` or `next build` inside `frontend/` to confirm zero TypeScript compile errors.
2. **Backend API Verification**: Run FastAPI server with `uvicorn` / `python -m pytest` or inspect `/docs` OpenAPI schema to ensure all routes respond cleanly.

### Manual Verification
1. **Executive Dashboard**: Test financial loss slider, downtime risk calculations, and posture score.
2. **Logic Diff Viewer**: Select baseline vs. current PLC logic versions, verify line-by-line diff highlighting, hash validation, and AI explainability breakdown.
3. **Digital Twin & Attack Replay**: Play/Pause attack scenario playback, observe live telemetry gauge shifts (pressure spike, thermal runaway), and trigger One-Click Rollback.
4. **Compliance & PDF Reports**: Test IEC 62443 / NIST control mappings and report output preview.
