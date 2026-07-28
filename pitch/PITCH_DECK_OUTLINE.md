# SentinelOT X - Pitch Deck Slide Outline

10-slide presentation deck structure tailored for hackathon judges and executive audiences.

---

### Slide 1: Title & Hero Banner
- **Title**: SentinelOT X - Enterprise PLC Logic Drift & Unauthorized Change Detection
- **Subtitle**: Protecting Critical Infrastructure from Silent Cyber-Physical Tampering
- **Visual**: Dark industrial UI preview with glowing electric cyan & alarm crimson accents.

---

### Slide 2: The Problem - The Blindspot in OT Cybersecurity
- **Bullet Points**:
  - Industrial PLCs control physical valves, turbines, and reactors.
  - IT firewalls and traditional EDR cannot detect logic ladder changes inside PLC memory blocks.
  - Over $900k average downtime cost per unauthorized logic excursion.
- **Visual**: Diagram showing IT SIEM missing low-level S7comm/Modbus logic injection.

---

### Slide 3: The Solution - SentinelOT X Architecture
- **Key Pillars**:
  1. Cryptographic Baseline Hashing (SHA-256)
  2. Side-by-Side AST Logic Diff Engine
  3. Explainable AI (XAI) Safety Physics Translator
  4. Digital Twin Attack Replay & One-Click Rollback

---

### Slide 4: Real-Time Executive & Financial Risk Dashboard
- **Key Highlights**:
  - Live Posture Score (68.4 / 100).
  - Downtime & Financial Loss Estimator ($145k/hr operational loss calculation).
  - CISO Automated Decision Assistant.

---

### Slide 5: Deep Technical Innovation - Logic Diff & AST Engine
- **Key Highlights**:
  - Line-by-line comparison of Siemens S7, Allen-Bradley, and Schneider code.
  - Real-time hazard scoring per modified rung.
  - Automatic detection of E-Stop bypasses and overridden pressure trip points.

---

### Slide 6: Digital Twin & Attack Replay Simulation
- **Key Highlights**:
  - Interactive 2D/3D process simulation of reactor tanks and pumps.
  - Step-by-step playback slider showing overpressure progression from T+0s to T+90s.

---

### Slide 7: Explainable AI (XAI) Copilot & Safety Physics
- **Key Highlights**:
  - Translates raw hex bytes and ladder logic into natural language safety warnings.
  - Recommends actionable mitigation steps with 99.4% confidence rating.

---

### Slide 8: Compliance Automation & Standards Mapping
- **Standards Supported**:
  - **IEC 62443**: SR 3.1 (Communication Integrity), SR 7.6 (Software Integrity).
  - **NIST SP 800-82**: PR.DS-6, DE.AE-2.
  - **MITRE ATT&CK for ICS**: T0843 (Program Download), T0855 (Unauthorized Command).

---

### Slide 9: Tech Stack & System Performance
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts, SVG/Canvas Digital Twin.
- **Backend**: FastAPI (Python 3.11), Pydantic v2, Motor MongoDB, JWT Auth.
- **Metrics**: <200ms detection latency, <1% network payload overhead.

---

### Slide 10: Conclusion & Call to Action
- **Summary**: SentinelOT X ensures physical safety, operational uptime, and cryptographic control over critical infrastructure.
- **Call to Action**: "Experience the live demo at localhost:3000!"
