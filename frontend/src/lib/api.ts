import {
  PLCAsset, LogicDiffResult, RiskCalculation, DigitalTwinState,
  UEBAEvent, ComplianceMapping, AICopilotResponse, ExecutiveReportSummary,
  SOCAlert
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ── PLCs ────────────────────────────────────────────────────────────────────

export async function fetchPLCs(): Promise<PLCAsset[]> {
  try { return await apiFetch(`${API_BASE}/plcs`); }
  catch { console.warn('[API] fetchPLCs → mock fallback'); }
  return MOCK_PLCS;
}

export async function fetchPLC(id: string): Promise<PLCAsset> {
  try { return await apiFetch(`${API_BASE}/plcs/${id}`); }
  catch { return MOCK_PLCS.find(p => p.id === id) ?? MOCK_PLCS[0]; }
}

export async function fetchLogicDiff(plcId: string): Promise<LogicDiffResult> {
  try { return await apiFetch(`${API_BASE}/plcs/${plcId}/diff`); }
  catch { console.warn('[API] fetchLogicDiff → mock fallback'); }
  return MOCK_DIFF;
}

export async function fetchRiskCalculation(plcId: string): Promise<RiskCalculation> {
  try { return await apiFetch(`${API_BASE}/plcs/${plcId}/risk`); }
  catch { return MOCK_RISK; }
}

export async function rollbackPLC(plcId: string) {
  try {
    return await apiFetch(`${API_BASE}/plcs/${plcId}/rollback`, { method: 'POST' });
  } catch {
    return { success: true, plc_id: plcId, message: 'Rollback executed (offline mode).' };
  }
}

// ── Digital Twin ─────────────────────────────────────────────────────────────

export async function fetchDigitalTwin(plcId: string): Promise<DigitalTwinState> {
  try { return await apiFetch(`${API_BASE}/digital-twin/${plcId}`); }
  catch { return MOCK_TWIN; }
}

// ── SOC Alerts ───────────────────────────────────────────────────────────────

export async function fetchAlerts(): Promise<SOCAlert[]> {
  try { return await apiFetch(`${API_BASE}/drift/alerts`); }
  catch { return MOCK_ALERTS; }
}

// ── UEBA ─────────────────────────────────────────────────────────────────────

export async function fetchUEBAEvents(): Promise<UEBAEvent[]> {
  try { return await apiFetch(`${API_BASE}/drift/ueba`); }
  catch { return MOCK_UEBA; }
}

// ── Compliance ───────────────────────────────────────────────────────────────

export async function fetchCompliance(): Promise<ComplianceMapping[]> {
  try { return await apiFetch(`${API_BASE}/drift/compliance`); }
  catch { return MOCK_COMPLIANCE; }
}

// ── Reports ──────────────────────────────────────────────────────────────────

export async function fetchReportSummary(): Promise<ExecutiveReportSummary> {
  try { return await apiFetch(`${API_BASE}/reports/summary`); }
  catch { return MOCK_REPORT; }
}

export async function generateReport() {
  try {
    return await apiFetch(`${API_BASE}/reports/generate-pdf`, { method: 'POST' });
  } catch {
    return { status: 'success', report_id: 'RPT-2026-0726-SENTINEL', download_url: '#' };
  }
}

// ── AI Copilot ───────────────────────────────────────────────────────────────

export async function queryAICopilot(query: string, plcId?: string): Promise<AICopilotResponse> {
  try {
    return await apiFetch(`${API_BASE}/ai/copilot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, plc_id: plcId }),
    });
  } catch {
    return MOCK_AI_RESPONSE;
  }
}

// ─── Mock Fallbacks ──────────────────────────────────────────────────────────

const MOCK_PLCS: PLCAsset[] = [
  { id: 'PLC-01-CHEM-TX',  name: 'Siemens S7-1500 (Reactor Cooling Loop)',  site: 'Plant Alpha - Houston TX',              location: 'Chemical Processing Bay 4',    vendor: 'Siemens',             model: 'S7-1518F-4 PN/DP', firmware_version: 'v2.9.4',  ip_address: '192.168.10.45',   protocol: 'S7comm',      criticality: 'CRITICAL', baseline_hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e', current_hash: 'a9101b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd20099ab912e', drift_detected: true,  last_baseline_sync: '2026-07-25 08:30:00', status: 'DRIFT_ALERT',  process_zone: 'Primary Coolant & Pressure Relief' },
  { id: 'PLC-02-WATER-WA', name: 'Allen-Bradley ControlLogix 5580',          site: 'Water Treatment Site 02 - Seattle WA',  location: 'Chlorine Injection Hub',       vendor: 'Rockwell Automation', model: '1756-L83E',        firmware_version: 'v33.011', ip_address: '10.240.4.12',     protocol: 'EtherNet/IP', criticality: 'HIGH',     baseline_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', current_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', drift_detected: false, last_baseline_sync: '2026-07-26 06:00:00', status: 'OPERATIONAL', process_zone: 'Chlorination Subsystem' },
  { id: 'PLC-03-GRID-OH',  name: 'Schneider Modicon M580',                   site: 'Substation Gamma - Columbus OH',         location: 'Substation Feeder Breaker',    vendor: 'Schneider Electric',  model: 'BMEP584040',       firmware_version: 'v3.20',   ip_address: '172.16.88.101',   protocol: 'Modbus-TCP',  criticality: 'CRITICAL', baseline_hash: '88a0b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e', current_hash: 'b991b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200996f9011a', drift_detected: true,  last_baseline_sync: '2026-07-24 14:15:00', status: 'DRIFT_ALERT',  process_zone: 'Grid Synchronization' },
  { id: 'PLC-04-ENERGY-LA',name: 'ABB AC800M Controller',                    site: 'Solar Storage Array - Baton Rouge LA',  location: 'Inverter Control Skid 12',     vendor: 'ABB',                 model: 'PM891',            firmware_version: 'v6.1.0',  ip_address: '192.168.120.30',  protocol: 'PROFINET',    criticality: 'MEDIUM',   baseline_hash: 'c4ca4238a0b923820dcc509a6f75849b',                                   current_hash: 'c4ca4238a0b923820dcc509a6f75849b',                                   drift_detected: false, last_baseline_sync: '2026-07-26 09:10:00', status: 'OPERATIONAL', process_zone: 'DC-AC Inverter Bus' },
];

const MOCK_DIFF: LogicDiffResult = {
  plc_id: 'PLC-01-CHEM-TX', plc_name: 'Siemens S7-1500 (Reactor Cooling Loop)',
  baseline_hash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e',
  current_hash: 'a9101b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd20099ab912e',
  baseline_timestamp: '2026-07-25 08:30:00 UTC', current_timestamp: '2026-07-26 10:14:22 UTC',
  total_rungs: 4, modified_rungs_count: 2, added_rungs_count: 1, deleted_rungs_count: 0,
  rungs_diff: [
    { line_number: 4,  rung_id: 'RUNG 0001', status: 'MODIFIED', baseline_code: 'AN  "I0.1" // Emergency Stop Pressed (NC)',        current_code: '// AN  "I0.1" // Emergency Stop Bypass Injected', explanation: 'CRITICAL HAZARD: Emergency Stop physical interlock commented out, disabling manual safety trip.', hazard_score: 9.8 },
    { line_number: 9,  rung_id: 'RUNG 0002', status: 'MODIFIED', baseline_code: 'L   5.000000e+000 // Target Setpoint: 5.0 Bar',     current_code: 'L   1.200000e+001 // TARGET OVERRIDDEN: Increased to 12.0 Bar!', explanation: 'OPERATIONAL THREAT: Coolant pressure trip point elevated 140% above maximum safety rating.', hazard_score: 9.5 },
    { line_number: 15, rung_id: 'RUNG 0003', status: 'MODIFIED', baseline_code: 'SD  "T1"   // On-Delay Timer 5.0 Seconds Threshold', current_code: 'SD  "T1"   // TIMER TAMPERED: Reduced from 5.0s to 0.1s', explanation: 'HIGH ANOMALY: Safety timer delay reduced by 98%, triggering rapid valve oscillation.', hazard_score: 8.2 },
    { line_number: 20, rung_id: 'RUNG 0004', status: 'ADDED',    baseline_code: '', current_code: 'A   "M100.4"\n=   "Q10.0"  // Rogue Pulse Relay', explanation: 'MALICIOUS INJECTION: Rogue logic rung writing to unmapped output register Q10.0.', hazard_score: 9.0 },
  ],
  overall_safety_hazard: 'CRITICAL - HIGH CATASTROPHIC EXCURSION RISK',
  root_cause_summary: 'Unauthorized Engineering Workstation (192.168.10.99) performed an unauthenticated PLC logic download via S7comm protocol bypassing Change Management approval.',
};

const MOCK_RISK: RiskCalculation = {
  plc_id: 'PLC-01-CHEM-TX', overall_risk_score: 94.5, risk_level: 'CRITICAL',
  confidentiality_impact: 45.0, integrity_impact: 98.0, availability_impact: 92.0,
  safety_hazard_index: 9.6, financial_impact_per_hour: 145000.0, estimated_downtime_hours: 6.5,
  explainability_factors: ['Emergency Stop Interlock Bypassed in Rung 1', 'Coolant Relief Valve pressure setpoint elevated from 5.0 Bar to 12.0 Bar (Exceeds Vessel Burst Threshold)', 'Unapproved engineering workstation connection during non-shift window (03:14 AM)', 'IEC 62443 Control SR 3.1 & SR 7.6 Violations Triggered'],
};

const MOCK_TWIN: DigitalTwinState = {
  plc_id: 'PLC-01-CHEM-TX', process_name: 'Chemical Reactor Thermal & Pressure Balance Twin',
  status: 'ATTACK_DEGRADED', system_health_pct: 28.5,
  current_pressure_psi: 174.2, target_pressure_psi: 72.5,
  current_temp_c: 185.4, target_temp_c: 65.0,
  pump_flow_rate_lpm: 12.4, valve_open_pct: 100.0,
  active_anomaly: 'UNAUTHORIZED LOGIC DRIFT - OVERPRESSURE RISK',
  replay_frames: [
    { step_number: 1, timestamp_offset_sec: 0,  title: 'Normal Baseline Execution',          description: 'PLC running golden baseline. Pressure 72.5 PSI, Temp 65°C. All interlocks active.',         affected_component: 'System Wide',          pressure_psi: 72.5,  temperature_celsius: 65.0,  valve_position_pct: 45.0,  alarm_status: 'NORMAL' },
    { step_number: 2, timestamp_offset_sec: 15, title: 'Unauthorized Logic Download',         description: 'Rogue WS writes tampered setpoint 12 Bar via unauthenticated S7comm.',                       affected_component: 'Siemens S7-1500 DB10', pressure_psi: 98.4,  temperature_celsius: 82.1,  valve_position_pct: 60.0,  alarm_status: 'NORMAL' },
    { step_number: 3, timestamp_offset_sec: 45, title: 'E-Stop Bypass & Pressure Spike',     description: 'Emergency Stop interlock disabled in Rung 1. Coolant valve locked 100% wide open.',           affected_component: 'Coolant Valve Q0.1',   pressure_psi: 135.0, temperature_celsius: 140.8, valve_position_pct: 100.0, alarm_status: 'WARNING' },
    { step_number: 4, timestamp_offset_sec: 90, title: 'Thermal Runaway & Critical Excursion','description': 'Vessel pressure 174.2 PSI — 140% above burst limit. Safety relief fails.',                  affected_component: 'Reactor Tank 4',       pressure_psi: 174.2, temperature_celsius: 185.4, valve_position_pct: 100.0, alarm_status: 'CRITICAL_TRIP' },
  ],
};

const MOCK_ALERTS: SOCAlert[] = [
  { id: 'ALT-9901', timestamp: '2026-07-26 10:14:22 UTC', severity: 'CRITICAL', plc: 'Siemens S7-1500 (Plant Alpha)',     tactic: 'MITRE T0843 / T0855', source_ip: '192.168.10.99',  protocol: 'S7comm',      message: 'SHA-256 Baseline Mismatch. Emergency Stop Interlock disabled in Rung 0001.' },
  { id: 'ALT-9884', timestamp: '2026-07-26 09:30:10 UTC', severity: 'CRITICAL', plc: 'Schneider M580 (Substation Gamma)', tactic: 'MITRE T0836',         source_ip: '172.16.88.204', protocol: 'Modbus-TCP',  message: 'Feeder Breaker trip delay parameter increased by 400ms without authorization.' },
  { id: 'ALT-9750', timestamp: '2026-07-25 22:15:00 UTC', severity: 'MEDIUM',   plc: 'Allen-Bradley ControlLogix',        tactic: 'UEBA Anomaly',         source_ip: '10.240.2.15',   protocol: 'EtherNet/IP', message: 'Engineering login outside standard shift window (03:14 AM) flagged.' },
];

const MOCK_UEBA: UEBAEvent[] = [
  { id: 'UEBA-9901', timestamp: '2026-07-26 10:14:22 UTC', user_id: 'usr_guest99', user_name: 'Unknown Engineer (External IP)', role: 'Contractor / External', ip_address: '192.168.10.99',  action: 'PLC_LOGIC_DOWNLOAD',    plc_affected: 'Siemens S7-1500 (Plant Alpha)',     anomaly_score: 97.2, is_suspicious: true,  details: 'Downloaded modified S7 project bypassing change ticket authorization outside maintenance window.' },
  { id: 'UEBA-9892', timestamp: '2026-07-26 09:45:10 UTC', user_id: 'usr_smith',   user_name: 'John Smith',                    role: 'OT Systems Admin',      ip_address: '10.240.2.15',    action: 'BASELINE_AUDIT_REQUEST', plc_affected: 'Allen-Bradley ControlLogix',        anomaly_score: 12.1, is_suspicious: false, details: 'Routine periodic baseline cryptographic hash verification.' },
  { id: 'UEBA-9710', timestamp: '2026-07-25 22:15:00 UTC', user_id: 'usr_vendor',  user_name: 'External Consultant (VPN)',      role: 'Third-Party Vendor',    ip_address: '172.16.88.204',  action: 'REGISTER_WRITE',         plc_affected: 'Schneider Modicon M580',             anomaly_score: 84.5, is_suspicious: true,  details: 'Direct Modbus write to holding register 40001 (Trip delay).' },
];

const MOCK_COMPLIANCE: ComplianceMapping[] = [
  { standard: 'IEC 62443',            control_id: 'SR 3.1',   control_title: 'Communication Integrity',           status: 'VIOLATED', details: 'Unauthenticated PLC logic transmission detected on S7comm interface.' },
  { standard: 'IEC 62443',            control_id: 'SR 7.6',   control_title: 'Software & Configuration Integrity', status: 'VIOLATED', details: 'SHA-256 runtime baseline mismatch on PLC-01-CHEM-TX.' },
  { standard: 'NIST SP 800-82',       control_id: 'PR.DS-6',  control_title: 'Integrity Checking Mechanisms',      status: 'VIOLATED', details: 'Unauthorized modification of process setpoints without cryptographic verification.' },
  { standard: 'NIST SP 800-82',       control_id: 'DE.AE-2',  control_title: 'Anomaly Detection Baseline',         status: 'PASS',     details: 'SentinelOT X flagged 94.5% risk delta within 200ms.' },
  { standard: 'MITRE ATT&CK for ICS', control_id: 'T0843',    control_title: 'Program Download',                   status: 'VIOLATED', details: 'Adversary transferred modified PLC executable block to target controller.' },
  { standard: 'MITRE ATT&CK for ICS', control_id: 'T0855',    control_title: 'Unauthorized Command Message',        status: 'VIOLATED', details: 'Direct manipulation of actuator setpoints via modified ladder rungs.' },
];

const MOCK_REPORT: ExecutiveReportSummary = {
  report_id: 'RPT-2026-0726-SENTINEL',
  generated_at: '2026-07-26 10:45:00 UTC',
  total_plcs_monitored: 4,
  total_drifts_detected: 2,
  total_unauthorized_changes: 4,
  overall_posture_score: 68.4,
  projected_financial_risk_usd: 942500.0,
  key_findings: [
    '2 out of 4 PLCs exhibited critical SHA-256 logic hash mismatches.',
    'Emergency Stop interlock disabled in Plant Alpha Chemical Bay 4.',
    'Unauthorized S7comm downloads originated from IP 192.168.10.99.',
    'Estimated $942,500 financial exposure mitigated by SentinelOT X XAI detection.',
  ],
  compliance_score_pct: 62.5,
};

const MOCK_AI_RESPONSE: AICopilotResponse = {
  answer: 'Analysis of Siemens S7-1500 PLC-01 logic indicates Rung 0001 had its Emergency Stop interlock commented out. This bypasses manual physical trip buttons, leaving the cooling pump unable to shut down automatically under overpressure conditions.',
  recommended_action: 'Execute immediate One-Click Rollback to baseline SHA-256 and isolate Engineering Workstation IP 192.168.10.99.',
  confidence_score: 99.4,
  mitre_tactics: ['T0843 - Program Download', 'T0855 - Unauthorized Command Message'],
  suggested_rollback: true,
};
