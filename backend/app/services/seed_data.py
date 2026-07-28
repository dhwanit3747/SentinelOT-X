import hashlib
from typing import List
from app.models.schemas import (
    PLCAsset, PLCVendor, PLCProtocol, RiskLevel, LogicDiffResult, LogicRungDiff,
    RiskCalculation, UEBAEvent, DigitalTwinState, AttackReplayFrame, ComplianceMapping, ExecutiveReportSummary
)

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

SAMPLE_BASELINE_CODE_PLC1 = """// Siemens S7-1500 PLC - Primary Cooling Water Pump Control
RUNG 0001: NETWORK 1 - System Readiness Verification
A   "M0.0" // Master Switch ON
AN  "I0.1" // Emergency Stop Pressed (NC)
=   "Q0.0" // System Power Relay

RUNG 0002: NETWORK 2 - Coolant Valve Pressure Regulation
L   "DB10".Pressure_Sensor_Value
L   5.000000e+000 // Target Setpoint: 5.0 Bar
>=F
=   "Q0.1" // Relief Valve Open Signal

RUNG 0003: NETWORK 3 - High Temperature Interlock Timer
A   "I0.2" // Over-temperature Switch
SD  "T1"   // On-Delay Timer 5.0 Seconds Safety Threshold
S   "Q0.2" // Thermal Trip Alarm
"""

SAMPLE_CURRENT_DRIFTED_CODE_PLC1 = """// Siemens S7-1500 PLC - Primary Cooling Water Pump Control
RUNG 0001: NETWORK 1 - System Readiness Verification
A   "M0.0" // Master Switch ON
// AN  "I0.1" // Emergency Stop Bypass Injected
=   "Q0.0" // System Power Relay

RUNG 0002: NETWORK 2 - Coolant Valve Pressure Regulation
L   "DB10".Pressure_Sensor_Value
L   1.200000e+001 // TARGET OVERRIDDEN: Increased setpoint from 5.0 Bar to 12.0 Bar!
>=F
=   "Q0.1" // Relief Valve Open Signal

RUNG 0003: NETWORK 3 - High Temperature Interlock Timer
A   "I0.2" // Over-temperature Switch
SD  "T1"   // TIMER TAMPERED: Reduced from 5.0 Seconds to 0.1 Seconds (Premature shutdown)
S   "Q0.2" // Thermal Trip Alarm

RUNG 0004: NETWORK 4 - [UNAUTHORIZED INJECTION] Unauthorized Command Buffer Leak
A   "M100.4" // Hidden Bit Trigger
=   "Q10.0"  // Rogue Pulse Relay
"""

MOCK_PLCS: List[PLCAsset] = [
    PLCAsset(
        id="PLC-01-CHEM-TX",
        name="Siemens S7-1500 (Reactor Cooling Loop)",
        site="Plant Alpha - Houston TX",
        location="Chemical Processing Bay 4",
        vendor=PLCVendor.SIEMENS,
        model="S7-1518F-4 PN/DP",
        firmware_version="v2.9.4",
        ip_address="192.168.10.45",
        protocol=PLCProtocol.S7COMM,
        criticality=RiskLevel.CRITICAL,
        baseline_hash=compute_sha256(SAMPLE_BASELINE_CODE_PLC1),
        current_hash=compute_sha256(SAMPLE_CURRENT_DRIFTED_CODE_PLC1),
        drift_detected=True,
        last_baseline_sync="2026-07-25 08:30:00",
        status="DRIFT_ALERT",
        process_zone="Primary Coolant & Pressure Relief"
    ),
    PLCAsset(
        id="PLC-02-WATER-WA",
        name="Allen-Bradley ControlLogix 5580",
        site="Water Treatment Site 02 - Seattle WA",
        location="Chlorine Injection & Dosing Hub",
        vendor=PLCVendor.ROCKWELL,
        model="1756-L83E",
        firmware_version="v33.011",
        ip_address="10.240.4.12",
        protocol=PLCProtocol.ETHERNET_IP,
        criticality=RiskLevel.HIGH,
        baseline_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        current_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        drift_detected=False,
        last_baseline_sync="2026-07-26 06:00:00",
        status="OPERATIONAL",
        process_zone="Chlorination Subsystem"
    ),
    PLCAsset(
        id="PLC-03-GRID-OH",
        name="Schneider Modicon M580",
        site="Substation Gamma - Columbus OH",
        location="Substation Feeder Breaker Bank A",
        vendor=PLCVendor.SCHNEIDER,
        model="BMEP584040",
        firmware_version="v3.20",
        ip_address="172.16.88.101",
        protocol=PLCProtocol.MODBUS_TCP,
        criticality=RiskLevel.CRITICAL,
        baseline_hash="7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e",
        current_hash="a892b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200996f9011a",
        drift_detected=True,
        last_baseline_sync="2026-07-24 14:15:00",
        status="DRIFT_ALERT",
        process_zone="Grid Synchronization & Interlock"
    ),
    PLCAsset(
        id="PLC-04-ENERGY-LA",
        name="ABB AC800M Controller",
        site="Solar Storage Array - Baton Rouge LA",
        location="Inverter Control Skid 12",
        vendor=PLCVendor.ABB,
        model="PM891",
        firmware_version="v6.1.0",
        ip_address="192.168.120.30",
        protocol=PLCProtocol.PROFINET,
        criticality=RiskLevel.MEDIUM,
        baseline_hash="c4ca4238a0b923820dcc509a6f75849b",
        current_hash="c4ca4238a0b923820dcc509a6f75849b",
        drift_detected=False,
        last_baseline_sync="2026-07-26 09:10:00",
        status="OPERATIONAL",
        process_zone="DC-AC Inverter Bus"
    )
]

def get_mock_diff_result(plc_id: str) -> LogicDiffResult:
    return LogicDiffResult(
        plc_id=plc_id,
        plc_name="Siemens S7-1500 (Reactor Cooling Loop)",
        baseline_hash=compute_sha256(SAMPLE_BASELINE_CODE_PLC1),
        current_hash=compute_sha256(SAMPLE_CURRENT_DRIFTED_CODE_PLC1),
        baseline_timestamp="2026-07-25 08:30:00 UTC",
        current_timestamp="2026-07-26 10:14:22 UTC",
        total_rungs=4,
        modified_rungs_count=2,
        added_rungs_count=1,
        deleted_rungs_count=0,
        rungs_diff=[
            LogicRungDiff(
                line_number=4,
                rung_id="RUNG 0001",
                status="MODIFIED",
                baseline_code='AN  "I0.1" // Emergency Stop Pressed (NC)',
                current_code='// AN  "I0.1" // Emergency Stop Bypass Injected',
                explanation="CRITICAL HAZARD: Emergency Stop physical interlock has been commented out, preventing manual operator safety trip.",
                hazard_score=9.8
            ),
            LogicRungDiff(
                line_number=9,
                rung_id="RUNG 0002",
                status="MODIFIED",
                baseline_code='L   5.000000e+000 // Target Setpoint: 5.0 Bar',
                current_code='L   1.200000e+001 // TARGET OVERRIDDEN: Increased setpoint from 5.0 Bar to 12.0 Bar!',
                explanation="OPERATIONAL THREAT: Coolant pressure trip point elevated 140% above maximum safety rating of 8.5 Bar.",
                hazard_score=9.5
            ),
            LogicRungDiff(
                line_number=15,
                rung_id="RUNG 0003",
                status="MODIFIED",
                baseline_code='SD  "T1"   // On-Delay Timer 5.0 Seconds Safety Threshold',
                current_code='SD  "T1"   // TIMER TAMPERED: Reduced from 5.0 Seconds to 0.1 Seconds',
                explanation="HIGH ANOMALY: Interlock timer delay reduced by 98%, causing erratic rapid trip cycling.",
                hazard_score=8.2
            ),
            LogicRungDiff(
                line_number=20,
                rung_id="RUNG 0004",
                status="ADDED",
                baseline_code='',
                current_code='A   "M100.4"\n=   "Q10.0"  // Rogue Pulse Relay',
                explanation="MALICIOUS INJECTION: Rogue logic rung detected writing to unmapped output register Q10.0.",
                hazard_score=9.0
            )
        ],
        overall_safety_hazard="CRITICAL - HIGH CATISTROPHIC EXCURSION RISK",
        root_cause_summary="Unauthorized Engineering Workstation (192.168.10.99) performed an unauthenticated PLC logic download via S7comm protocol bypassing Change Management approval."
    )

def get_mock_risk_calculation(plc_id: str) -> RiskCalculation:
    return RiskCalculation(
        plc_id=plc_id,
        overall_risk_score=94.5,
        risk_level=RiskLevel.CRITICAL,
        confidentiality_impact=45.0,
        integrity_impact=98.0,
        availability_impact=92.0,
        safety_hazard_index=9.6,
        financial_impact_per_hour=145000.0,
        estimated_downtime_hours=6.5,
        explainability_factors=[
            "Emergency Stop Interlock Bypassed in Rung 1",
            "Coolant Relief Valve pressure setpoint elevated from 5.0 Bar to 12.0 Bar (Exceeds Vessel Burst Threshold)",
            "Unapproved engineering workstation connection during non-shift window (03:14 AM)",
            "IEC 62443 Control SR 3.1 & SR 7.6 Violations Triggered"
        ]
    )

def get_mock_ueba_events() -> List[UEBAEvent]:
    return [
        UEBAEvent(
            id="UEBA-9901",
            timestamp="2026-07-26 10:14:22",
            user_id="usr_eng_guest99",
            user_name="Unknown Engineer (External IP)",
            role="Contractor / Vendor",
            ip_address="192.168.10.99",
            action="PLC_LOGIC_DOWNLOAD",
            plc_affected="PLC-01-CHEM-TX",
            anomaly_score=97.2,
            is_suspicious=True,
            details="Logic project downloaded to PLC outside maintenance window without ticket authorization."
        ),
        UEBAEvent(
            id="UEBA-9892",
            timestamp="2026-07-26 09:45:10",
            user_id="usr_admin_smith",
            user_name="John Smith (OT Admin)",
            role="OT Systems Admin",
            ip_address="10.240.2.15",
            action="BASELINE_AUDIT_REQUEST",
            plc_affected="PLC-02-WATER-WA",
            anomaly_score=12.1,
            is_suspicious=False,
            details="Standard periodic baseline hash verification."
        )
    ]

def get_mock_digital_twin(plc_id: str) -> DigitalTwinState:
    return DigitalTwinState(
        plc_id=plc_id,
        process_name="Chemical Reactor Thermal & Pressure Balance Twin",
        status="ATTACK_DEGRADED",
        system_health_pct=28.5,
        current_pressure_psi=174.2, # elevated
        target_pressure_psi=72.5,   # normal
        current_temp_c=185.4,       # near runaway
        target_temp_c=65.0,
        pump_flow_rate_lpm=12.4,    # choked flow
        valve_open_pct=100.0,       # fully stuck open
        active_anomaly="UNAUTHORIZED LOGIC DRIFT - OVERPRESSURE RISK",
        replay_frames=[
            AttackReplayFrame(step_number=1, timestamp_offset_sec=0, title="Normal Baseline Execution", description="PLC running verified SHA-256 logic. Pressure stable at 72.5 PSI, Temp 65°C.", affected_component="System Wide", pressure_psi=72.5, temperature_celsius=65.0, valve_position_pct=45.0, alarm_status="NORMAL"),
            AttackReplayFrame(step_number=2, timestamp_offset_sec=15, title="Unauthorized Logic Download", description="Rogue engineering workstation writes tampered setpoint (12 Bar / 174 PSI) via S7comm.", affected_component="Siemens S7-1500 DB10", pressure_psi=78.2, temperature_celsius=68.5, valve_position_pct=60.0, alarm_status="NORMAL"),
            AttackReplayFrame(step_number=3, timestamp_offset_sec=45, title="E-Stop Bypass & Pressure Spike", description="Emergency Stop interlock disabled in Rung 1. Coolant valve locked wide open.", affected_component="Coolant Valve Q0.1", pressure_psi=124.0, temperature_celsius=110.2, valve_position_pct=100.0, alarm_status="WARNING"),
            AttackReplayFrame(step_number=4, timestamp_offset_sec=90, title="Thermal Runaway & Critical Overpressure", description="Reactor vessel pressure reaches 174.2 PSI. Safety relief fails due to setpoint override.", affected_component="Reactor Tank 4", pressure_psi=174.2, temperature_celsius=185.4, valve_position_pct=100.0, alarm_status="CRITICAL_TRIP")
        ]
    )

def get_mock_compliance() -> List[ComplianceMapping]:
    return [
        ComplianceMapping(standard="IEC 62443", control_id="SR 3.1", control_title="Communication Integrity", status="VIOLATED", details="Unauthenticated PLC logic transmission detected on Siemens S7comm interface."),
        ComplianceMapping(standard="IEC 62443", control_id="SR 7.6", control_title="Software and Configuration Integrity", status="VIOLATED", details="SHA-256 runtime baseline mismatch on PLC-01-CHEM-TX."),
        ComplianceMapping(standard="NIST SP 800-82", control_id="PR.DS-6", control_title="Integrity Checking Mechanisms", status="VIOLATED", details="Unauthorized modification of process setpoints without cryptographic verification."),
        ComplianceMapping(standard="NIST SP 800-82", control_id="DE.AE-2", control_title="Anomaly Detection Baseline", status="PASS", details="SentinelOT X successfully flagged 94.5% risk delta within 200ms."),
        ComplianceMapping(standard="MITRE ATT&CK for ICS", control_id="T0843", control_title="Program Download", status="VIOLATED", details="Adversary transferred modified PLC executable block to target controller."),
        ComplianceMapping(standard="MITRE ATT&CK for ICS", control_id="T0855", control_title="Unauthorized Command Message", status="VIOLATED", details="Direct manipulation of actuator setpoint outputs via modified ladder logic rungs.")
    ]

def get_mock_report_summary() -> ExecutiveReportSummary:
    return ExecutiveReportSummary(
        report_id="RPT-2026-0726-SENTINEL",
        generated_at="2026-07-26 10:45:00 UTC",
        total_plcs_monitored=4,
        total_drifts_detected=2,
        total_unauthorized_changes=4,
        overall_posture_score=68.4,
        projected_financial_risk_usd=942500.0,
        key_findings=[
            "2 out of 4 PLCs exhibited critical SHA-256 logic hash mismatches.",
            "Emergency Stop interlock disabled in Plant Alpha Chemical Bay 4.",
            "Unauthorized S7comm downloads originated from IP 192.168.10.99.",
            "Estimated downtime risk of $145,000 / hr prevented by early SentinelOT X XAI alerts."
        ],
        compliance_score_pct=62.5
    )
