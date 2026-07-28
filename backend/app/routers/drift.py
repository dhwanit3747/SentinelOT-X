from fastapi import APIRouter
from typing import List
from app.models.schemas import UEBAEvent, ComplianceMapping
from app.services.seed_data import get_mock_ueba_events, get_mock_compliance

router = APIRouter(prefix="/api/v1/drift", tags=["Drift & UEBA & Compliance"])

@router.get("/ueba", response_model=List[UEBAEvent])
async def get_ueba_logs():
    return get_mock_ueba_events()

@router.get("/compliance", response_model=List[ComplianceMapping])
async def get_compliance_matrix():
    return get_mock_compliance()
