from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routers import query, emergency, safety, feedback, sms, admin, routes, auth, notify, operator

app = FastAPI(
    title="Transit India API",
    description="National bus information platform API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router)
app.include_router(emergency.router)
app.include_router(safety.router)
app.include_router(feedback.router)
app.include_router(sms.router)
app.include_router(admin.router)
app.include_router(routes.router)
app.include_router(auth.router)
app.include_router(notify.router)
app.include_router(operator.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "transit-india"}

handler = Mangum(app, lifespan="off")
