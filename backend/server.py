from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timedelta
import random
import requests
from jose import JWTError, jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# EmailJS config
EMAILJS_CONFIG = {
    'SERVICE_ID': 'service_lh3dkt8',
    'TEMPLATE_ID': 'template_9f9udc8',
    'USER_ID': 't4JkOzvFRHXRR4Isb',
}

# JWT config
SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class VerificationCode(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    code: str
    expires_at: datetime

class SendVerificationRequest(BaseModel):
    email: str

class VerifyCodeRequest(BaseModel):
    email: str
    code: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

def generate_verification_code():
    return f"{random.randint(100000, 999999)}"

def send_email_via_emailjs(to_email: str, code: str):
    url = "https://api.emailjs.com/api/v1.0/email/send"
    payload = {
        "service_id": EMAILJS_CONFIG['SERVICE_ID'],
        "template_id": EMAILJS_CONFIG['TEMPLATE_ID'],
        "user_id": EMAILJS_CONFIG['USER_ID'],
        "template_params": {
            "to_email": to_email,
            "code": code
        }
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.status_code == 200

@api_router.post("/send-verification-code")
async def send_verification_code(request: SendVerificationRequest):
    email = request.email.lower()
    code = generate_verification_code()
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Store or update the verification code in DB
    existing = await db.verification_codes.find_one({"email": email})
    if existing:
        await db.verification_codes.update_one(
            {"email": email},
            {"$set": {"code": code, "expires_at": expires_at}}
        )
    else:
        verification_code = VerificationCode(email=email, code=code, expires_at=expires_at)
        await db.verification_codes.insert_one(verification_code.dict())

    # Send email
    if not send_email_via_emailjs(email, code):
        raise HTTPException(status_code=500, detail="Failed to send verification email")

    return {"message": "Verification code sent"}

@api_router.post("/verify-code")
async def verify_code(request: VerifyCodeRequest):
    email = request.email.lower()
    code = request.code

    record = await db.verification_codes.find_one({"email": email, "code": code})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if datetime.utcnow() > record['expires_at']:
        raise HTTPException(status_code=400, detail="Verification code expired")

    # Create or get user
    user = await db.users.find_one({"email": email})
    if not user:
        user_obj = User(email=email)
        await db.users.insert_one(user_obj.dict())
        user = user_obj.dict()

    # Generate JWT token
    to_encode = {"sub": user['id'], "email": user['email']}
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    # Optionally delete the used verification code
    await db.verification_codes.delete_one({"email": email, "code": code})

    return {"access_token": encoded_jwt, "token_type": "bearer"}

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
