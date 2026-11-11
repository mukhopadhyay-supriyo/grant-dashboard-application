from datetime import datetime
from typing import Protocol

from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str  # needs: pip install "pydantic[email]"; or use str
    password: str
    name: str = "Test"
    id: int = 1


class Series(BaseModel):
    name: str
    unit: str
    axis: str = "left"  # "left" or "right" y-axis
    values: list[float | None]  # same length as SeriesResponse.timestamps


class SeriesResponse(BaseModel):
    timestamps: list[int]  # epoch milliseconds, UTC
    series: list[Series]


class DataSource(Protocol):
    def get_series(
        self, start: datetime, end: datetime, names: list[str] | None = None
    ) -> SeriesResponse: ...

    def validate(
        self, email: str | None = None, password: str | None = None
    ) -> LoginRequest: ...
