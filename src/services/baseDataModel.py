from datetime import datetime
from typing import Protocol

from pydantic import BaseModel


class Series(BaseModel):
    name: str
    unit: str
    axis: str = "left"  # "left" or "right" y-axis
    values: list[float | None]  # same length as SeriesResponse.timestamps


class SeriesResponse(BaseModel):
    timestamps: list[int]  # epoch milliseconds, UTC
    series: list[Series]
