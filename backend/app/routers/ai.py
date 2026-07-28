from fastapi import APIRouter
from app.models.schemas import AICopilotRequest, AICopilotResponse

router = APIRouter(prefix="/api/v1/ai", tags=["AI Copilot & XAI"])

@router.post("/copilot", response_model=AICopilotResponse)
async def query_ai_copilot(req: AICopilotRequest):
    q = req.query.lower()
    
    if "emergency" in q or "stop" in q or "bypass" in q:
        return AICopilotResponse(
            answer="Analysis of Siemens S7-1500 PLC-01 logic indicates Rung 0001 had its Emergency Stop interlock commented out (`// AN 'I0.1'`). This bypasses manual physical trip buttons, leaving the cooling pump unable to shut down automatically under overpressure conditions.",
            recommended_action="Execute immediate One-Click Rollback to baseline SHA-256 (Hash ending in ...b855) and isolate Engineering Workstation IP 192.168.10.99.",
            confidence_score=99.4,
            mitre_tactics=["T0843 - Program Download", "T0855 - Unauthorized Command Message"],
            suggested_rollback=True
        )
    elif "pressure" in q or "setpoint" in q or "bar" in q:
        return AICopilotResponse(
            answer="Logic Diff shows Rung 0002 coolant relief setpoint was elevated from 5.0 Bar to 12.0 Bar. The reactor vessel burst safety envelope is 8.5 Bar. Operating at 12.0 Bar risks violent vessel rupture and catastrophic chemical release within 90 seconds.",
            recommended_action="Trigger emergency coolant bypass override and perform cryptographic baseline reload.",
            confidence_score=98.8,
            mitre_tactics=["T0836 - Modify Parameter", "T0807 - Command Injection"],
            suggested_rollback=True
        )
    elif "rollback" in q or "fix" in q:
        return AICopilotResponse(
            answer="SentinelOT X One-Click Rollback will flash the verified golden SHA-256 baseline compiled on 2026-07-25 08:30:00 UTC back into PLC memory block DB10.",
            recommended_action="Confirm administrator credentials and click 'Execute Rollback' on the PLC Detail / Diff View modal.",
            confidence_score=100.0,
            mitre_tactics=["Inhibit Response Avoidance"],
            suggested_rollback=True
        )
    
    return AICopilotResponse(
        answer=f"SentinelOT X XAI Engine evaluated query '{req.query}'. The platform detected 2 unauthorized logic mutations on target PLCs. Operating conditions exhibit elevated risk index (94.5/100).",
        recommended_action="Inspect the Logic Diff Viewer, review MITRE ICS control violations, and execute baseline restoration.",
        confidence_score=96.5,
        mitre_tactics=["T0843 - Program Download"],
        suggested_rollback=True
    )
