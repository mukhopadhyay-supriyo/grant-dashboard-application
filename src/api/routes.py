from fastapi import APIRouter, HTTPException, Query
import src.services.db as database
from src.services.baseDataModel import SeriesResponse, LoginRequest
from datetime import UTC, datetime, timedelta
from src.services import get_data_source
from typing import Any

router = APIRouter(prefix="/api")


def _window(start: datetime | None, end: datetime | None) -> tuple[datetime, datetime]:
    """Default to the last 24 hours; treat naive datetimes as UTC."""
    end = end or datetime.now(UTC)
    start = start or end - timedelta(hours=24)
    if end.tzinfo is None:
        end = end.replace(tzinfo=UTC)
    if start.tzinfo is None:
        start = start.replace(tzinfo=UTC)
    return start, end


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/hello")
def hello():
    return {"message": "Hello from FastAPI!"}


@router.get("/health/db")
def health_db() -> dict[str, str]:
    try:
        conn = database.get_connection_objects()
        conn["cursor"].execute("SELECT 1")
    except Exception as e:
        raise HTTPException(
            status_code=503, detail=f"Database unreachable ({type(e).__name__})"
        )
    return {"status": "ok"}


@router.get("/series", response_model=SeriesResponse)
def series(
    start: datetime | None = None,
    end: datetime | None = None,
    names: list[str] | None = Query(default=None),
) -> SeriesResponse:
    print(start)
    print(end)
    start, end = _window(start, end)
    return get_data_source().get_series(start, end, names)


@router.post("/login")
def login(body: LoginRequest) -> dict[str, Any]:
    print(body.email)
    user = get_data_source().validate(email=body.email, password=body.password)
    print(user.email)
    if user is None:
        # Same message for "no such email" and "wrong password", so it
        # doesn't reveal which emails exist
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "status": "ok",
        "user": {"name": user.name, "email": user.email, "id": user.id},
    }


# validateUser("smukhopadhyay@grant.ie", "123")
