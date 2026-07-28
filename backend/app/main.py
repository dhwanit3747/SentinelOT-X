import json
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# ─── Seed Data ─────────────────────────────────────────────────────────────────

MOCK_PLCS = [
    { "id": "PLC-01-CHEM-TX",  "name": "Siemens S7-1500 (Reactor Cooling Loop)", "site": "Plant Alpha - Houston TX",             "location": "Chemical Processing Bay 4",      "vendor": "Siemens",             "model": "S7-1518F-4 PN/DP", "firmware_version": "v2.9.4",  "ip_address": "192.168.10.45",  "protocol": "S7comm",       "criticality": "CRITICAL", "baseline_hash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e", "current_hash": "a9101b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd20099ab912e", "drift_detected": True,  "last_baseline_sync": "2026-07-25 08:30:00", "status": "DRIFT_ALERT",  "process_zone": "Primary Coolant & Pressure Relief" },
    { "id": "PLC-02-WATER-WA", "name": "Allen-Bradley ControlLogix 5580",         "site": "Water Treatment Site 02 - Seattle WA", "location": "Chlorine Injection Hub",          "vendor": "Rockwell Automation", "model": "1756-L83E",        "firmware_version": "v33.011", "ip_address": "10.240.4.12",    "protocol": "EtherNet/IP",  "criticality": "HIGH",     "baseline_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "current_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "drift_detected": False, "last_baseline_sync": "2026-07-26 06:00:00", "status": "OPERATIONAL", "process_zone": "Chlorination Subsystem" },
    { "id": "PLC-03-GRID-OH",  "name": "Schneider Modicon M580",                   "site": "Substation Gamma - Columbus OH",        "location": "Substation Feeder Breaker",       "vendor": "Schneider Electric",  "model": "BMEP584040",       "firmware_version": "v3.20",   "ip_address": "172.16.88.101",  "protocol": "Modbus-TCP",   "criticality": "CRITICAL", "baseline_hash": "88a0b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e", "current_hash": "b991b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200996f9011a", "drift_detected": True,  "last_baseline_sync": "2026-07-24 14:15:00", "status": "DRIFT_ALERT",  "process_zone": "Grid Synchronization" },
    { "id": "PLC-04-ENERGY-LA","name": "ABB AC800M Controller",                    "site": "Solar Storage Array - Baton Rouge LA", "location": "Inverter Control Skid 12",        "vendor": "ABB",                 "model": "PM891",            "firmware_version": "v6.1.0",  "ip_address": "192.168.120.30", "protocol": "PROFINET",     "criticality": "MEDIUM",   "baseline_hash": "c4ca4238a0b923820dcc509a6f75849b",                                   "current_hash": "c4ca4238a0b923820dcc509a6f75849b",                                   "drift_detected": False, "last_baseline_sync": "2026-07-26 09:10:00", "status": "OPERATIONAL", "process_zone": "DC-AC Inverter Bus" },
]

# mutable runtime state so rollback actually changes things
PLC_RUNTIME_STATES = {p["id"]: dict(p) for p in MOCK_PLCS}

MOCK_DIFF_PLC01 = {
    "plc_id": "PLC-01-CHEM-TX",
    "plc_name": "Siemens S7-1500 (Reactor Cooling Loop)",
    "baseline_hash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e",
    "current_hash":  "a9101b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd20099ab912e",
    "baseline_timestamp": "2026-07-25 08:30:00 UTC",
    "current_timestamp":  "2026-07-26 10:14:22 UTC",
    "total_rungs": 4, "modified_rungs_count": 2, "added_rungs_count": 1, "deleted_rungs_count": 0,
    "rungs_diff": [
        { "line_number": 4,  "rung_id": "RUNG 0001", "status": "MODIFIED", "baseline_code": 'AN  "I0.1" // Emergency Stop Pressed (NC)',        "current_code": '// AN  "I0.1" // Emergency Stop Bypass Injected', "explanation": "CRITICAL HAZARD: Emergency Stop physical interlock commented out, disabling manual safety trip.", "hazard_score": 9.8 },
        { "line_number": 9,  "rung_id": "RUNG 0002", "status": "MODIFIED", "baseline_code": 'L   5.000000e+000 // Target Setpoint: 5.0 Bar',     "current_code": 'L   1.200000e+001 // TARGET OVERRIDDEN: Increased to 12.0 Bar!', "explanation": "OPERATIONAL THREAT: Coolant pressure trip point elevated 140% above maximum safety rating.",  "hazard_score": 9.5 },
        { "line_number": 15, "rung_id": "RUNG 0003", "status": "MODIFIED", "baseline_code": 'SD  "T1"   // On-Delay Timer 5.0 Seconds Threshold', "current_code": 'SD  "T1"   // TIMER TAMPERED: Reduced from 5.0s to 0.1s',      "explanation": "HIGH ANOMALY: Safety timer delay reduced by 98%, triggering rapid valve oscillation.",         "hazard_score": 8.2 },
        { "line_number": 20, "rung_id": "RUNG 0004", "status": "ADDED",    "baseline_code": '',                                                      "current_code": 'A   "M100.4"\n=   "Q10.0"  // Rogue Pulse Relay',               "explanation": "MALICIOUS INJECTION: Rogue logic rung writing to unmapped output register Q10.0.",           "hazard_score": 9.0 },
    ],
    "overall_safety_hazard": "CRITICAL - HIGH CATASTROPHIC EXCURSION RISK",
    "root_cause_summary": "Unauthorized Engineering Workstation (192.168.10.99) performed an unauthenticated PLC logic download via S7comm protocol bypassing Change Management approval."
}

MOCK_RISK = {
    "plc_id": "PLC-01-CHEM-TX",
    "overall_risk_score": 94.5, "risk_level": "CRITICAL",
    "confidentiality_impact": 45.0, "integrity_impact": 98.0, "availability_impact": 92.0,
    "safety_hazard_index": 9.6, "financial_impact_per_hour": 145000.0, "estimated_downtime_hours": 6.5,
    "explainability_factors": [
        "Emergency Stop Interlock Bypassed in Rung 1",
        "Coolant Relief Valve pressure setpoint elevated from 5.0 Bar to 12.0 Bar (Exceeds Vessel Burst Threshold)",
        "Unapproved engineering workstation connection during non-shift window (03:14 AM)",
        "IEC 62443 Control SR 3.1 & SR 7.6 Violations Triggered"
    ]
}

MOCK_UEBA = [
    { "id": "UEBA-9901", "timestamp": "2026-07-26 10:14:22 UTC", "user_id": "usr_guest99", "user_name": "Unknown Engineer (External IP)", "role": "Contractor / External", "ip_address": "192.168.10.99", "action": "PLC_LOGIC_DOWNLOAD",    "plc_affected": "Siemens S7-1500 (Plant Alpha)",     "anomaly_score": 97.2, "is_suspicious": True,  "details": "Downloaded modified S7 project bypassing change ticket authorization outside maintenance window." },
    { "id": "UEBA-9892", "timestamp": "2026-07-26 09:45:10 UTC", "user_id": "usr_smith",   "user_name": "John Smith",                    "role": "OT Systems Admin",      "ip_address": "10.240.2.15",  "action": "BASELINE_AUDIT_REQUEST", "plc_affected": "Allen-Bradley ControlLogix",        "anomaly_score": 12.1, "is_suspicious": False, "details": "Routine periodic baseline cryptographic hash verification." },
    { "id": "UEBA-9710", "timestamp": "2026-07-25 22:15:00 UTC", "user_id": "usr_vendor",  "user_name": "External Consultant (VPN)",      "role": "Third-Party Vendor",    "ip_address": "172.16.88.204","action": "REGISTER_WRITE",         "plc_affected": "Schneider Modicon M580",             "anomaly_score": 84.5, "is_suspicious": True,  "details": "Direct Modbus write to holding register 40001 (Trip delay)." },
]

MOCK_COMPLIANCE = [
    { "standard": "IEC 62443",            "control_id": "SR 3.1",   "control_title": "Communication Integrity",           "status": "VIOLATED", "details": "Unauthenticated PLC logic transmission detected on S7comm interface." },
    { "standard": "IEC 62443",            "control_id": "SR 7.6",   "control_title": "Software & Configuration Integrity", "status": "VIOLATED", "details": "SHA-256 runtime baseline mismatch on PLC-01-CHEM-TX." },
    { "standard": "NIST SP 800-82",       "control_id": "PR.DS-6",  "control_title": "Integrity Checking Mechanisms",      "status": "VIOLATED", "details": "Unauthorized modification of process setpoints without cryptographic verification." },
    { "standard": "NIST SP 800-82",       "control_id": "DE.AE-2",  "control_title": "Anomaly Detection Baseline",         "status": "PASS",     "details": "SentinelOT X flagged 94.5% risk delta within 200ms." },
    { "standard": "MITRE ATT&CK for ICS", "control_id": "T0843",    "control_title": "Program Download",                   "status": "VIOLATED", "details": "Adversary transferred modified PLC executable block to target controller." },
    { "standard": "MITRE ATT&CK for ICS", "control_id": "T0855",    "control_title": "Unauthorized Command Message",        "status": "VIOLATED", "details": "Direct manipulation of actuator setpoints via modified ladder rungs." },
]

MOCK_ALERTS = [
    { "id": "ALT-9901", "timestamp": "2026-07-26 10:14:22 UTC", "severity": "CRITICAL", "plc": "Siemens S7-1500 (Plant Alpha)",     "tactic": "MITRE T0843 / T0855", "source_ip": "192.168.10.99",  "protocol": "S7comm",       "message": "SHA-256 Baseline Mismatch. Emergency Stop Interlock disabled in Rung 0001." },
    { "id": "ALT-9884", "timestamp": "2026-07-26 09:30:10 UTC", "severity": "CRITICAL", "plc": "Schneider M580 (Substation Gamma)", "tactic": "MITRE T0836",         "source_ip": "172.16.88.204", "protocol": "Modbus-TCP",   "message": "Feeder Breaker trip delay parameter increased by 400ms without authorization." },
    { "id": "ALT-9750", "timestamp": "2026-07-25 22:15:00 UTC", "severity": "MEDIUM",   "plc": "Allen-Bradley ControlLogix",       "tactic": "UEBA Anomaly",         "source_ip": "10.240.2.15",   "protocol": "EtherNet/IP",  "message": "Engineering login outside standard shift window (03:14 AM) flagged." },
]

MOCK_REPORT = {
    "report_id": "RPT-2026-0726-SENTINEL",
    "generated_at": "2026-07-26 10:45:00 UTC",
    "total_plcs_monitored": 4,
    "total_drifts_detected": 2,
    "total_unauthorized_changes": 4,
    "overall_posture_score": 68.4,
    "projected_financial_risk_usd": 942500.0,
    "key_findings": [
        "2 out of 4 PLCs exhibited critical SHA-256 logic hash mismatches.",
        "Emergency Stop interlock disabled in Plant Alpha Chemical Bay 4.",
        "Unauthorized S7comm downloads originated from IP 192.168.10.99.",
        "Estimated $942,500 financial exposure mitigated by SentinelOT X XAI detection."
    ],
    "compliance_score_pct": 62.5
}

DIGITAL_TWIN_PLC01 = {
    "plc_id": "PLC-01-CHEM-TX",
    "process_name": "Chemical Reactor Thermal & Pressure Balance Twin",
    "status": "ATTACK_DEGRADED",
    "system_health_pct": 28.5,
    "current_pressure_psi": 174.2,
    "target_pressure_psi": 72.5,
    "current_temp_c": 185.4,
    "target_temp_c": 65.0,
    "pump_flow_rate_lpm": 12.4,
    "valve_open_pct": 100.0,
    "active_anomaly": "UNAUTHORIZED LOGIC DRIFT - OVERPRESSURE RISK",
    "replay_frames": [
        { "step_number": 1, "timestamp_offset_sec": 0,  "title": "Normal Baseline Execution",         "description": "PLC running golden SHA-256 baseline. Pressure stable at 72.5 PSI, Temp 65°C.",         "affected_component": "System Wide",         "pressure_psi": 72.5,  "temperature_celsius": 65.0,  "valve_position_pct": 45.0,  "alarm_status": "NORMAL" },
        { "step_number": 2, "timestamp_offset_sec": 15, "title": "Unauthorized Logic Download",        "description": "Rogue workstation writes tampered setpoint (12 Bar / 174 PSI) via unauthenticated S7comm.", "affected_component": "Siemens S7-1500 DB10", "pressure_psi": 98.4,  "temperature_celsius": 82.1,  "valve_position_pct": 60.0,  "alarm_status": "NORMAL" },
        { "step_number": 3, "timestamp_offset_sec": 45, "title": "E-Stop Bypass & Pressure Spike",    "description": "Emergency Stop interlock disabled in Rung 1. Coolant valve locked 100% wide open.",     "affected_component": "Coolant Valve Q0.1",   "pressure_psi": 135.0, "temperature_celsius": 140.8, "valve_position_pct": 100.0, "alarm_status": "WARNING" },
        { "step_number": 4, "timestamp_offset_sec": 90, "title": "Thermal Runaway & Critical Excursion","description": "Vessel pressure reaches 174.2 PSI — 140% above burst limit. Safety relief fails.",      "affected_component": "Reactor Tank 4",       "pressure_psi": 174.2, "temperature_celsius": 185.4, "valve_position_pct": 100.0, "alarm_status": "CRITICAL_TRIP" },
    ]
}

# ─── AI Response Logic ─────────────────────────────────────────────────────────

def ai_response(query: str) -> dict:
    q = query.lower().strip()
    if q in ["hi", "hello", "hey", "greetings", "help", "who are you", "hi there"]:
        return {
            "answer": "Hello! I am the SentinelOT X Explainable AI (XAI) Copilot. I analyze PLC ladder logic changes, calculate operational safety impact, explain physics hazards, and recommend baseline rollbacks. How can I assist you with your OT asset fleet today?",
            "recommended_action": "Try asking: 'Explain E-Stop bypass hazard', 'What is the financial impact?', or 'Recommend One-Click Rollback procedure'.",
            "confidence_score": 100.0,
            "mitre_tactics": [],
            "suggested_rollback": False
        }
    elif any(k in q for k in ["emergency", "stop", "bypass", "i0.1", "interlock"]):
        return { "answer": "Analysis of Siemens S7-1500 Rung 0001 confirms the Emergency Stop physical interlock was commented out (`// AN 'I0.1'`). This disables all manual operator safety trips, leaving the cooling pump running uncontrollably under overpressure conditions. The plant vessel has a burst pressure of 8.5 Bar — current setpoint has been elevated to 12.0 Bar.", "recommended_action": "Execute immediate One-Click Rollback to golden baseline SHA-256 (hash ending ...9069e) and isolate Engineering Workstation IP 192.168.10.99 immediately.", "confidence_score": 99.4, "mitre_tactics": ["T0843 - Program Download", "T0855 - Unauthorized Command Message"], "suggested_rollback": True }
    elif any(k in q for k in ["pressure", "setpoint", "bar", "valve", "coolant"]):
        return { "answer": "Rung 0002 coolant relief setpoint was overridden from 5.0 Bar to 12.0 Bar (+140%). The reactor vessel burst safety envelope is 8.5 Bar. At 12.0 Bar, violent vessel rupture and catastrophic chemical release becomes statistically inevitable within 90 seconds of sustained pressure.", "recommended_action": "Trigger emergency coolant bypass override and execute cryptographic baseline reload to restore 5.0 Bar relief setpoint.", "confidence_score": 98.8, "mitre_tactics": ["T0836 - Modify Parameter", "T0807 - Command Injection"], "suggested_rollback": True }
    elif any(k in q for k in ["rollback", "restore", "fix", "revert"]):
        return { "answer": "SentinelOT X One-Click Rollback will flash the verified golden SHA-256 baseline (compiled 2026-07-25 08:30:00 UTC) back into Siemens PLC memory block DB10 via authenticated S7comm write. Post-rollback hash verification confirms baseline integrity within 200ms.", "recommended_action": "Confirm administrator credentials, navigate to Engineer Fleet View or Logic Diff page, then click 'ONE-CLICK ROLLBACK'.", "confidence_score": 100.0, "mitre_tactics": [], "suggested_rollback": True }
    elif any(k in q for k in ["financial", "cost", "dollar", "loss", "downtime"]):
        return { "answer": "Based on current operational metrics: Plant Alpha chemical batch rate is $145,000/hr. With 6.5 hours projected downtime from vessel over-pressure event: Total direct exposure = $942,500 USD. Additional contaminated batch disposal, emergency maintenance crew, and regulatory fines could add a further $200,000-$500,000.", "recommended_action": "Authorize immediate Baseline Rollback to prevent financial exposure. Generate Executive PDF Report for C-Suite briefing.", "confidence_score": 97.2, "mitre_tactics": [], "suggested_rollback": True }
    elif any(k in q for k in ["mitre", "attack", "ics", "tactic", "technique"]):
        return { "answer": "SentinelOT X has automatically mapped detected behaviors to 3 confirmed MITRE ATT&CK for ICS techniques:\n• T0843 Program Download: Rogue workstation pushed modified logic block\n• T0855 Unauthorized Command Message: Altered setpoints sent to physical actuators\n• T0836 Modify Parameter: Direct pressure setpoint parameter tamper", "recommended_action": "Review SOC Triage dashboard for full MITRE technique mapping and alert triage.", "confidence_score": 99.1, "mitre_tactics": ["T0843 - Program Download", "T0855 - Unauthorized Command Message", "T0836 - Modify Parameter"], "suggested_rollback": True }
    elif any(k in q for k in ["compliance", "iec", "nist", "62443"]):
        return { "answer": "Current drift event violates:\n• IEC 62443 SR 3.1 (Communication Integrity) — unauthenticated S7comm transmission\n• IEC 62443 SR 7.6 (Software & Configuration Integrity) — SHA-256 baseline mismatch\n• NIST SP 800-82 PR.DS-6 (Integrity Checking) — unauthorized setpoint modification\n\nCompliance score has dropped from 100% to 62.5% due to these violations.", "recommended_action": "Execute rollback to restore compliance posture. Document incident in Audit Trail for regulatory reporting.", "confidence_score": 98.5, "mitre_tactics": [], "suggested_rollback": False }
    else:
        return { "answer": f"SentinelOT X XAI Engine analyzed: '{query}'. The platform has detected 2 critical unauthorized logic mutations on Siemens S7-1500 (Plant Alpha) and Schneider M580 (Substation Gamma). Overall OT risk index: 94.5/100 (CRITICAL). Financial exposure: $942,500 USD.", "recommended_action": "Inspect the Logic Diff Viewer, review MITRE ICS control violations, and execute baseline restoration.", "confidence_score": 96.5, "mitre_tactics": ["T0843 - Program Download"], "suggested_rollback": True }


# ─── HTTP Handler ──────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        code = args[1] if len(args) > 1 else ''
        print(f"  [{self.command}] {self.path} -> {code}")

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def _json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        p = urlparse(self.path).path.rstrip('/')

        # ── PLCs ──────────────────────────────────
        if p == '/api/v1/plcs':
            self._json(list(PLC_RUNTIME_STATES.values()))

        elif '/api/v1/plcs/' in p and p.endswith('/diff'):
            plc_id = p.split('/')[4]
            diff = dict(MOCK_DIFF_PLC01)
            diff['plc_id'] = plc_id
            state = PLC_RUNTIME_STATES.get(plc_id, {})
            diff['current_hash'] = state.get('current_hash', diff['current_hash'])
            self._json(diff)

        elif '/api/v1/plcs/' in p and p.endswith('/risk'):
            plc_id = p.split('/')[4]
            self._json({**MOCK_RISK, 'plc_id': plc_id})

        elif '/api/v1/plcs/' in p:
            plc_id = p.split('/')[4]
            plc = PLC_RUNTIME_STATES.get(plc_id)
            if plc:
                self._json(plc)
            else:
                self._json({'error': 'PLC not found'}, 404)

        # ── Digital Twin ──────────────────────────
        elif '/api/v1/digital-twin/' in p:
            plc_id = p.split('/')[4]
            twin = dict(DIGITAL_TWIN_PLC01)
            twin['plc_id'] = plc_id
            state = PLC_RUNTIME_STATES.get(plc_id, {})
            if not state.get('drift_detected', True):
                twin['status'] = 'OPERATIONAL'
                twin['current_pressure_psi'] = 72.5
                twin['current_temp_c'] = 65.0
                twin['valve_open_pct'] = 45.0
                twin['active_anomaly'] = None
            self._json(twin)

        # ── Drift / UEBA ──────────────────────────
        elif p == '/api/v1/drift/ueba':
            self._json(MOCK_UEBA)

        elif p == '/api/v1/drift/compliance':
            self._json(MOCK_COMPLIANCE)

        elif p == '/api/v1/drift/alerts':
            self._json(MOCK_ALERTS)

        # ── Reports ───────────────────────────────
        elif p == '/api/v1/reports/summary':
            self._json(MOCK_REPORT)

        # ── Health / Root ─────────────────────────
        elif p in ('', '/'):
            self._json({ "platform": "SentinelOT X", "status": "OPERATIONAL", "version": "1.0.0-ENTERPRISE", "docs": "/docs" })

        elif p == '/health':
            self._json({ "status": "HEALTHY", "database": "CONNECTED", "ai_engine": "ACTIVE" })

        else:
            self._json({'error': 'Not found', 'path': p}, 404)

    def do_POST(self):
        p = urlparse(self.path).path.rstrip('/')
        length = int(self.headers.get('Content-Length', 0))
        body_raw = self.rfile.read(length) if length else b'{}'
        try:
            body = json.loads(body_raw)
        except Exception:
            body = {}

        # ── Rollback ──────────────────────────────
        if '/rollback' in p and '/api/v1/plcs/' in p:
            plc_id = p.split('/')[4]
            if plc_id in PLC_RUNTIME_STATES:
                state = PLC_RUNTIME_STATES[plc_id]
                state['current_hash'] = state['baseline_hash']
                state['drift_detected'] = False
                state['status'] = 'OPERATIONAL'
            self._json({
                "success": True, "plc_id": plc_id,
                "message": f"One-Click Rollback executed. Baseline SHA-256 restored for {plc_id}.",
                "new_status": "OPERATIONAL"
            })

        # ── Sync Baseline ─────────────────────────
        elif '/sync-baseline' in p and '/api/v1/plcs/' in p:
            plc_id = p.split('/')[4]
            if plc_id in PLC_RUNTIME_STATES:
                state = PLC_RUNTIME_STATES[plc_id]
                state['baseline_hash'] = state['current_hash']
                state['drift_detected'] = False
                state['status'] = 'OPERATIONAL'
            self._json({ "success": True, "plc_id": plc_id, "message": "New baseline hash committed." })

        # ── AI Copilot ────────────────────────────
        elif p == '/api/v1/ai/copilot':
            query = body.get('query', '')
            self._json(ai_response(query))

        # ── Login ─────────────────────────────────
        elif p == '/api/v1/auth/login':
            user = body.get('username', '')
            pwd  = body.get('password', '')
            role_map = {
                'admin':    ('Dr. Elena Rostova',   'Principal OT Cyber Architect'),
                'engineer': ('Marcus Vance',         'Lead Automation Engineer'),
                'analyst':  ('Sofia Chen',           'SOC Incident Handler'),
            }
            if user in role_map:
                name, role = role_map[user]
                self._json({ "access_token": f"sentinel_jwt_{user}_2026", "token_type": "bearer", "user_name": name, "role": role })
            else:
                self._json({ "access_token": "sentinel_jwt_demo_2026", "token_type": "bearer", "user_name": "SentinelOT Operator", "role": "SOC Analyst" })

        # ── Report Generate ───────────────────────
        elif p == '/api/v1/reports/generate-pdf':
            self._json({ "status": "success", "message": "Executive OT Security Report compiled.", "download_url": f"/api/v1/reports/download/RPT-2026-0726-SENTINEL.pdf", "report_id": "RPT-2026-0726-SENTINEL" })

        else:
            self._json({'error': 'Not found', 'path': p}, 404)


# ─── Main ─────────────────────────────────────────────────────────────────────

def run(port=8000):
    httpd = HTTPServer(('', port), Handler)
    print(f"""
+--------------------------------------------------------------+
|  SentinelOT X -- API Server RUNNING                         |
|  URL: http://localhost:{port}                                   |
|                                                              |
|  GET  /api/v1/plcs                  -> PLC Fleet Inventory   |
|  GET  /api/v1/plcs/{{id}}/diff       -> Logic Diff            |
|  GET  /api/v1/plcs/{{id}}/risk       -> Risk Calculation      |
|  POST /api/v1/plcs/{{id}}/rollback   -> One-Click Rollback    |
|  GET  /api/v1/digital-twin/{{id}}    -> Digital Twin State    |
|  GET  /api/v1/drift/ueba            -> UEBA Events           |
|  GET  /api/v1/drift/compliance      -> Compliance Mappings   |
|  GET  /api/v1/drift/alerts          -> SOC Alert Feed        |
|  GET  /api/v1/reports/summary       -> Executive Report      |
|  POST /api/v1/ai/copilot            -> XAI Copilot Query     |
|  POST /api/v1/auth/login            -> Authentication        |
+--------------------------------------------------------------+
""")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")

if __name__ == '__main__':
    run()
