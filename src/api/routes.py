from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/api")


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/hello")
def hello():
    return {"message": "Hello from FastAPI!"}
