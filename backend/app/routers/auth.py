from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    role: str

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    if req.username == "admin" and req.password == "sentinel123":
        return LoginResponse(
            access_token="mock_jwt_token_sentinel_admin_sec_991823",
            token_type="bearer",
            user_name="Dr. Elena Rostova",
            role="Principal OT Cyber Architect"
        )
    elif req.username == "engineer" and req.password == "sentinel123":
        return LoginResponse(
            access_token="mock_jwt_token_sentinel_eng_441029",
            token_type="bearer",
            user_name="Marcus Vance",
            role="Lead Automation Engineer"
        )
    # Default fallback for easy demo
    return LoginResponse(
        access_token="mock_jwt_token_sentinel_demo_110293",
        token_type="bearer",
        user_name="SentinelOT Operator",
        role="SOC Incident Handler"
    )
