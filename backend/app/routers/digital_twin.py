from fastapi import APIRouter
from app.models.schemas import DigitalTwinState
from app.services.seed_data import get_mock_digital_twin

router = APIRouter(prefix="/api/v1/digital-twin", tags=["Digital Twin & Attack Replay"])

@router.get("/{plc_id}", response_model=DigitalTwinState)
async def get_digital_twin_state(plc_id: str):
    return get_mock_digital_twin(plc_id)
