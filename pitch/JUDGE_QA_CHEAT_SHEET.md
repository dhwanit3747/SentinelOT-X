# SentinelOT X - Hackathon Judge Q&A Cheat Sheet

15 anticipated tough questions from hackathon judges (OT experts, AI researchers, CISOs) along with bulletproof answers.

---

### Q1: How does SentinelOT X detect PLC logic changes without interrupting real-time determinism?
**Answer**: SentinelOT X uses passive network payload inspection (e.g. S7comm, EtherNet/IP CIP, Modbus-TCP) combined with scheduled out-of-band memory read requests to extract compiled program blocks without affecting the cyclic scan time (1-10ms) of the controller.

---

### Q2: What if an attacker tampers with the baseline hash stored in SentinelOT X?
**Answer**: Baseline cryptographic signatures are signed with SHA-256 and stored in an immutable, append-only MongoDB cluster with hardware security module (HSM) key protection and peer cross-validation across distributed site nodes.

---

### Q3: How does your AI Copilot avoid hallucinations when dealing with critical industrial safety logic?
**Answer**: Our Explainable AI (XAI) engine does not rely solely on LLMs. It combines a deterministic Abstract Syntax Tree (AST) ladder logic parser with rule-based safety physics validation. The LLM is constrained to translate validated AST diff deltas into natural language.

---

### Q4: Can SentinelOT X execute automatic rollbacks, or does it require human-in-the-loop?
**Answer**: SentinelOT X enforces a configurable Zero-Trust Human-in-the-Loop approval policy. The CISO or Lead Automation Engineer must authenticate via JWT RBAC before a rollback payload is dispatched to the PLC.

---

### Q5: How do you handle vendor-specific proprietary PLC languages (e.g., Siemens TIA Portal vs. Rockwell Studio 5000)?
**Answer**: SentinelOT X normalizes vendor-specific binaries and XML export formats (L5X, SCL, AWL, ST) into an Intermediate Representation (IR) AST schema, enabling unified diffing across Siemens, Rockwell, Schneider, and ABB controllers.

---

### Q6: What industrial security standards does SentinelOT X align with?
**Answer**: SentinelOT X natively maps events to **IEC 62443** (SR 3.1, SR 7.6), **NIST SP 800-82** (PR.DS-6, DE.AE-2), and the **MITRE ATT&CK for ICS Framework** (T0843, T0855, T0836).

---

### Q7: How do you calculate the Financial Loss & Downtime Risk metrics?
**Answer**: Financial risk is computed using an enterprise formula:  
`Financial Exposure ($) = (Downtime Duration in Hours × Hourly Operational Rate) + (Contaminated Batch Quantity × Unit Loss Cost) + Incident Remediation Overhead`.

---

### Q8: What happens if the network connection between the PLC site and SentinelOT X is severed?
**Answer**: Edge SentinelOT X gateway nodes run lightweight local Docker containers that cache baseline signatures and log local telemetry independently, resynchronizing with the central platform upon reconnect.

---

### Q9: How is UEBA (User & Entity Behavior Analytics) applied to OT environments?
**Answer**: OT UEBA tracks parameters such as login IP address, engineering workstation ID, time-of-day access, command download frequency, and unapproved tag writes to compute an anomaly score (0-100).

---

### Q10: How long does it take to detect a logic drift event?
**Answer**: SentinelOT X detects logic modifications within **200 milliseconds** of payload transmission over OT protocols.

---

### Q11: Can SentinelOT X differentiate between a legitimate maintenance update and a malicious injection?
**Answer**: Yes. Legitimate updates reference authorized Change Management Work Orders (ServiceNow / Jira OT integrations). Unmatched downloads generate immediate high-severity alerts.

---

### Q12: How does the Digital Twin Process Visualizer work?
**Answer**: The Digital Twin correlates live sensor telemetry (pressure, temperature, valve position) with PLC output register states to simulate physical process degradation during an attack replay.

---

### Q13: What is the overhead of running SentinelOT X in a production plant?
**Answer**: The platform requires minimal bandwidth (<1% network overhead) by utilizing passive packet mirroring (SPAN/TAP ports) and differential state polling.

---

### Q14: How does SentinelOT X support air-gapped industrial networks?
**Answer**: SentinelOT X can be deployed fully on-premises via air-gapped Docker Compose or Kubernetes containers without external internet dependencies.

---

### Q15: Why is SentinelOT X a category winner for this hackathon?
**Answer**: SentinelOT X bridges the gap between deep OT PLC ladder code integrity, explainable AI safety physics, financial risk quantification, and one-click remediation in a unified enterprise UI.
