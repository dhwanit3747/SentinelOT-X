from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class PLCProtocol(str, Enum):
    MODBUS_TCP = "Modbus-TCP"
    PROFINET = "PROFINET"
    ETHERNET_IP = "EtherNet/IP"
    S7COMM = "S7comm"

class PLCVendor(str, Enum):
    SIEMENS = "Siemens"
    ROCKWELL = "Rockwell Automation"
    SCHNEIDER = "Schneider Electric"
    ABB = "ABB"

class PLCAsset(BaseModel):
    id: str
    name: str
    site: str
    location: str
    vendor: PLCVendor
    model: str
    firmware_version: str
    ip_address: str
    protocol: PLCProtocol
    criticality: RiskLevel
    baseline_hash: str
    current_hash: str
    drift_detected: bool = False
    last_baseline_sync: str
    status: str  # OPERATIONAL, DRIFT_ALERT, MAINTENANCE, DEGRADED
    process_zone: str # e.g. "Primary Cooling Loop", "Chemical Reactor B", "Turbine Control"

class LogicRungDiff(BaseModel):
    line_number: int
    rung_id: str
    status: str # "ADDED", "REMOVED", "MODIFIED", "UNCHANGED"
    baseline_code: str
    current_code: str
    explanation: Optional[str] = None
    hazard_score: float = 0.0

class LogicDiffResult(BaseModel):
    plc_id: str
    plc_name: str
    baseline_hash: str
    current_hash: str
    baseline_timestamp: str
    current_timestamp: str
    total_rungs: int
    modified_rungs_count: int
    added_rungs_count: int
    deleted_rungs_count: int
    rungs_diff: List[LogicRungDiff]
    overall_safety_hazard: str
    root_cause_summary: str

class RiskCalculation(BaseModel):
    plc_id: str
    overall_risk_score: float # 0 to 100
    risk_level: RiskLevel
    confidentiality_impact: float
    integrity_impact: float
    availability_impact: float
    safety_hazard_index: float
    financial_impact_per_hour: float # in USD
    estimated_downtime_hours: float
    explainability_factors: List[str]

class UEBAEvent(BaseModel):
    id: str
    timestamp: str
    user_id: str
    user_name: str
    role: str
    ip_address: str
    action: str
    plc_affected: str
    anomaly_score: float # 0 to 100
    is_suspicious: bool
    details: str

class AttackReplayFrame(BaseModel):
    step_number: int
    timestamp_offset_sec: int
    title: str
    description: str
    affected_component: str
    pressure_psi: float
    temperature_celsius: float
    valve_position_pct: float
    alarm_status: str # NORMAL, WARNING, CRITICAL_TRIP

class DigitalTwinState(BaseModel):
    plc_id: str
    process_name: str
    status: str
    system_health_pct: float
    current_pressure_psi: float
    target_pressure_psi: float
    current_temp_c: float
    target_temp_c: float
    pump_flow_rate_lpm: float
    valve_open_pct: float
    active_anomaly: Optional[str] = None
    replay_frames: List[AttackReplayFrame]

class ComplianceMapping(BaseModel):
    standard: str # "IEC 62443", "NIST SP 800-82", "MITRE ATT&CK for ICS"
    control_id: str
    control_title: str
    status: str # "PASS", "VIOLATED", "WARNING"
    details: str

class AICopilotRequest(BaseModel):
    query: str
    plc_id: Optional[str] = None

class AICopilotResponse(BaseModel):
    answer: str
    recommended_action: str
    confidence_score: float
    mitre_tactics: List[str]
    suggested_rollback: bool

class ExecutiveReportSummary(BaseModel):
    report_id: str
    generated_at: str
    total_plcs_monitored: int
    total_drifts_detected: int
    total_unauthorized_changes: int
    overall_posture_score: float
    projected_financial_risk_usd: float
    key_findings: List[str]
    compliance_score_pct: float
