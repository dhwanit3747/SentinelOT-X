from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.schemas import PLCAsset, LogicDiffResult, RiskCalculation
from app.services.seed_data import MOCK_PLCS, get_mock_diff_result, get_mock_risk_calculation

router = APIRouter(prefix="/api/v1/plcs", tags=["PLC Management"])

@router.get("", response_model=List[PLCAsset])
async def get_all_plcs(site: Optional[str] = None, status: Optional[str] = None):
    results = MOCK_PLCS
    if site:
        results = [p for p in results if site.lower() in p.site.lower()]
    if status:
        results = [p for p in results if p.status == status]
    return results

@router.get("/{plc_id}", response_model=PLCAsset)
async def get_plc_by_id(plc_id: str):
    plc = next((p for p in MOCK_PLCS if p.id == plc_id), None)
    if not plc:
        # Fallback to first PLC if id not found for smooth demo
        return MOCK_PLCS[0]
    return plc

@router.get("/{plc_id}/diff", response_model=LogicDiffResult)
async def get_plc_logic_diff(plc_id: str):
    return get_mock_diff_result(plc_id)

@router.get("/{plc_id}/risk", response_model=RiskCalculation)
async def get_plc_risk(plc_id: str):
    return get_mock_risk_calculation(plc_id)

@router.post("/{plc_id}/rollback")
async def rollback_plc_logic(plc_id: str):
    plc = next((p for p in MOCK_PLCS if p.id == plc_id), MOCK_PLCS[0])
    # Perform mock rollback logic update
    plc.current_hash = plc.baseline_hash
    plc.drift_detected = False
    plc.status = "OPERATIONAL"
    return {
        "success": True,
        "plc_id": plc_id,
        "message": f"One-Click Rollback executed successfully for {plc.name}. Baseline SHA-256 restored.",
        "restored_hash": plc.baseline_hash,
        "new_status": "OPERATIONAL"
    }

@router.post("/{plc_id}/sync-baseline")
async def sync_plc_baseline(plc_id: str):
    plc = next((p for p in MOCK_PLCS if p.id == plc_id), MOCK_PLCS[0])
    plc.baseline_hash = plc.current_hash
    plc.drift_detected = False
    plc.status = "OPERATIONAL"
    return {
        "success": True,
        "plc_id": plc_id,
        "message": f"New baseline hash committed for {plc.name}.",
        "new_baseline_hash": plc.baseline_hash
    }
