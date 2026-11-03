from collections.abc import Callable
from datetime import datetime, timedelta
import random
from src.services.baseDataModel import SeriesResponse, Series

STEP_MS = 60_000  # one sample per minute
MAX_SPAN = timedelta(days=7)
CYCLE_MIN = 180  # a "hot water" cycle every 3 h
RUN_MIN = 25  # ...running for 25 min


def _epoch_ms(dt: datetime) -> int:
    return int(dt.timestamp() * 1000)


def _timestamps(start: datetime, end: datetime) -> list[int]:
    start = max(start, end - MAX_SPAN)
    first = (_epoch_ms(start) // STEP_MS) * STEP_MS
    return list(range(first, _epoch_ms(end) + 1, STEP_MS))


SIGNALS: dict[str, tuple[str, str, float]] = {
    "Suction temp": ("°C", "left", 20.0),
    "Discharge temp": ("°C", "left", 20.0),
    "Exp in temp": ("°C", "left", 20.0),
    "Exp out temp": ("°C", "left", 20.0),
    "Ambient temp": ("°C", "left", 20.0),
    # "DHW temp": ("°C", "left", 50.0),
    "Flow temp": (
        "°C",
        "left",
        25.0,
    ),
    "Return temp": ("°C", "left", 25.0),
    "PCB temp": ("°C", "left", 25.0),
    "Flow_1": ("m/s", "left", 25.0),
    "Flow_2": ("m/s", "left", 25.0),
    "Output_Flag_1": ("bool", "left", 1.0),
    "Output_Flag_2": ("bool", "left", 1.0),
    "Output_Flag_3": ("bool", "left", 1.0),
    "Fan_Tach": ("rpm", "left", 300.0),
    "Stepper_Position": ("step", "left", 300.0),
    "Flow_Rate": ("m/s", "left", 15.0),
    "Comp_Speed_Target": ("rpm", "left", 300.0),
    "Comp_Speed_Actual": ("rpm", "left", 250.0),
    "Discharge_Presure": ("bar", "left", 1394.0),
    "Suction_Presure": ("bar", "left", 394.0),
    "Fan_Speed_Target": ("rpm", "left", 200.0),
    "Superheat": ("°C", "left", 708.0),
    "Subcool": ("°C", "left", 8708.0),
    "Pump_Speed_Target": ("rpm", "left", 600.0),
    "System_Flow_Rate": ("rpm", "left", 200.0),
    "State_Chnages_Per_6s": ("rpm", "left", 200.0),
    "Flow_Rate_L_Per_Min_Times_10": ("rpm", "left", 200.0),
    "Sika_Flow_Rate": ("rpm", "left", 200.0),
    "Evaporation_Temperature": ("°C", "left", 200.0),
    "Condensing_Temperature": ("°C", "left", 200.0),
    "System_Flow_Temperature": ("°C", "left", 200.0),
    "System_Return_Temperature": ("°C", "left", 200.0),
    "P_Flow_Setpoint": ("rpm", "left", 45.0),
    "Superheat_Error": ("°C", "left", 45.0),
    "Discharge_Temperature_Error": ("°C", "left", 45.0),
    "P_EEV_Start_Postion": ("position", "left", 500.0),
    "Fan_State": ("flag", "left", 1.0),
    "Comp_State": ("flag", "left", 1.0),
    "Comp_Timer": ("flag", "left", 1.0),
    "EEV_State": ("flag", "left", 1.0),
    "EEV_Timer": ("flag", "left", 1.0),
    "EEV_Threshold_Timer": ("flag", "left", 1.0),
    "Pump_APP_State": ("flag", "left", 1.0),
    "Pump_Timer": ("flag", "left", 1.0),
    "Demand_1": ("flag", "left", 1.0),
    "P_EEV_Open_Time": ("flag", "left", 1.0),
    "P_KP": ("flag", "left", 1.0),
    "P_Superheat_Error_Scalor": ("flag", "left", 1.0),
    "P_EEV_Threshold_Check_Time": ("flag", "left", 1.0),
    "P_Fan_Auto": ("flag", "left", 1.0),
    "pump_Mode": ("flag", "left", 1.0),
    "pump_rpm_set": ("Hz", "right", 400),
}


class MockSource:
    def __init__(self) -> None:
        self._rng = random.Random(42)

    def get_series(
        self, start: datetime, end: datetime, names: list[str] | None = None
    ) -> SeriesResponse:
        timestamps = _timestamps(start, end)
        selected = [n for n in SIGNALS if names is None or n in names]
        series = []
        for name in selected:
            unit, axis, fn = SIGNALS[name]
            values = [fn]
            series.append(
                Series(name=name, unit=unit, axis=axis, values=values)  # type: ignore
            )
        return SeriesResponse(timestamps=timestamps, series=series)
