from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models.schemas import ExecutiveReportSummary
from app.services.seed_data import get_mock_report_summary

router = APIRouter(prefix="/api/v1/reports", tags=["Executive Reports"])

@router.get("/summary", response_model=ExecutiveReportSummary)
async def get_report_summary():
    return get_mock_report_summary()

@router.post("/generate-pdf")
async def generate_executive_pdf():
    summary = get_mock_report_summary()
    return JSONResponse(
        content={
            "status": "success",
            "message": "Executive OT Security Report PDF compiled successfully.",
            "download_url": f"/api/v1/reports/download/{summary.report_id}.pdf",
            "report_id": summary.report_id,
            "summary": summary.dict()
        }
    )
