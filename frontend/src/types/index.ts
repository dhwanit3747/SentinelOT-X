// ─── Enums ──────────────────────────────────────────────────────────────────
export type RiskLevel     = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PLCStatus     = 'OPERATIONAL' | 'DRIFT_ALERT' | 'MAINTENANCE' | 'OFFLINE';
export type DiffStatus    = 'MODIFIED' | 'ADDED' | 'REMOVED' | 'UNCHANGED';
export type AlarmStatus   = 'NORMAL' | 'WARNING' | 'CRITICAL_TRIP';
export type Criticality   = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ComplianceStatus = 'PASS' | 'VIOLATED' | 'PARTIAL';

// ─── PLC Asset ───────────────────────────────────────────────────────────────
export interface PLCAsset {
  id: string;
  name: string;
  site: string;
  location: string;
  vendor: string;
  model: string;
  firmware_version: string;
  ip_address: string;
  protocol: string;
  criticality: Criticality;
  baseline_hash: string;
  current_hash: string;
  drift_detected: boolean;
  last_baseline_sync: string;
  status: PLCStatus;
  process_zone: string;
}

// ─── Logic Diff ──────────────────────────────────────────────────────────────
export interface LogicRungDiff {
  line_number: number;
  rung_id: string;
  status: DiffStatus;
  baseline_code: string;
  current_code: string;
  explanation: string;
  hazard_score: number;
}

export interface LogicDiffResult {
  plc_id: string;
  plc_name: string;
  baseline_hash: string;
  current_hash: string;
  baseline_timestamp: string;
  current_timestamp: string;
  total_rungs: number;
  modified_rungs_count: number;
  added_rungs_count: number;
  deleted_rungs_count: number;
  rungs_diff: LogicRungDiff[];
  overall_safety_hazard: string;
  root_cause_summary: string;
}

// ─── Risk Calculation ────────────────────────────────────────────────────────
export interface RiskCalculation {
  plc_id: string;
  overall_risk_score: number;
  risk_level: RiskLevel;
  confidentiality_impact: number;
  integrity_impact: number;
  availability_impact: number;
  safety_hazard_index: number;
  financial_impact_per_hour: number;
  estimated_downtime_hours: number;
  explainability_factors: string[];
}

// ─── Digital Twin ────────────────────────────────────────────────────────────
export interface AttackReplayFrame {
  step_number: number;
  timestamp_offset_sec: number;
  title: string;
  description: string;
  affected_component: string;
  pressure_psi: number;
  temperature_celsius: number;
  valve_position_pct: number;
  alarm_status: AlarmStatus | string;
}

export interface DigitalTwinState {
  plc_id: string;
  process_name: string;
  status: string;
  system_health_pct: number;
  current_pressure_psi: number;
  target_pressure_psi: number;
  current_temp_c: number;
  target_temp_c: number;
  pump_flow_rate_lpm: number;
  valve_open_pct: number;
  active_anomaly: string | null;
  replay_frames: AttackReplayFrame[];
}

// ─── UEBA Event ──────────────────────────────────────────────────────────────
export interface UEBAEvent {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  role: string;
  ip_address: string;
  action: string;
  plc_affected: string;
  anomaly_score: number;
  is_suspicious: boolean;
  details: string;
}

// ─── Compliance ──────────────────────────────────────────────────────────────
export interface ComplianceMapping {
  standard: string;
  control_id: string;
  control_title: string;
  status: ComplianceStatus;
  details: string;
}

// ─── SOC Alerts ──────────────────────────────────────────────────────────────
export interface SOCAlert {
  id: string;
  timestamp: string;
  severity: string;
  plc: string;
  tactic: string;
  source_ip: string;
  protocol: string;
  message: string;
}

// ─── AI Copilot ──────────────────────────────────────────────────────────────
export interface AICopilotResponse {
  answer: string;
  recommended_action: string;
  confidence_score: number;
  mitre_tactics: string[];
  suggested_rollback: boolean;
}

// ─── Executive Report ────────────────────────────────────────────────────────
export interface ExecutiveReportSummary {
  report_id: string;
  generated_at: string;
  total_plcs_monitored: number;
  total_drifts_detected: number;
  total_unauthorized_changes: number;
  overall_posture_score: number;
  projected_financial_risk_usd: number;
  key_findings: string[];
  compliance_score_pct: number;
}
