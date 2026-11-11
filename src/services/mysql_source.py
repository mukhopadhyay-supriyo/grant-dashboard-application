from src.services.baseDataModel import Series, SeriesResponse, LoginRequest

from datetime import UTC, datetime
from src.services.db import get_connection_objects

from src.services.mockData import SIGNALS  # unit + axis for each chart key

MAX_ROWS = 500_000  # safety cap so a very wide time range cannot exhaust memory

COLUMN_MAP: dict[str, str] = {
    "Suction_Temperature": "Suction_temp",
    "Discharge_Temperature": "Discharge_temp",
    "EXP_IN_Temperature": "Exp_in_temp",
    "EXP_OUT_Temperature": "Exp_out_temp",
    "Ambient_Temperture": "Ambient_temp",
    "T6": "Flow_temp",  # check: is T6 the flow temperature?
    "T7": "Return_temp",  # check: is T7 the return temperature?
    "PCB_NTC": "PCB_temp",
    "Flow_1": "Flow_1",
    "Flow_2": "Flow_2",
    "Output_Flag_1": "Output_Flag_1",
    "Output_Flag_2": "Output_Flag_2",
    "Output_Flag_3": "Output_Flag_3",
    "Fan_Tach": "Fan_Tach",
    "Stepper_Position": "Stepper_Position",
    "Flow_Rate": "Flow_Rate",
    "Comp_Speed_Target": "Comp_Speed_Target",
    "Comp_Speed_Actual": "Comp_Speed_Actual",
    "Discharge_Pressure": "Discharge_Presure",
    "Suction_Pressure": "Suction_Presure",
    "Fan_Speed_Target": "Fan_Speed_Target",
    "Superheat": "Superheat",
    "Subcool": "Subcool",
    "Pump_Speed_Target": "Pump_Speed_Target",
    "System_Flow_Rate": "System_Flow_Rate",
    "State_Changes_Per_6s": "State_Chnages_Per_6s",
    "Flow_Rate_L_Per_Min_Times_10": "Flow_Rate_L_Per_Min_Times_10",
    "Sika_Flow_Rate": "Sika_Flow_Rate",
    "Evaporation_Temperature": "Evaporation_Temperature",
    "Condensing_Temperature": "Condensing_Temperature",
    "System_Flow_Temperature": "System_Flow_Temperature",
    "System_Return_Temperature": "System_Return_Temperature",
    "P_Flow_Setpoint": "P_Flow_Setpoint",
    "Superheat_Error": "Superheat_Error",
    "Discharge_Temperature_Error": "Discharge_Temperature_Error",
    "P_EEV_Start_Position": "P_EEV_Start_Postion",
    "Fan_State": "Fan_State",
    "Comp_State": "Comp_State",
    "Comp_Timer": "Comp_Timer",
    "EEV_State": "EEV_State",
    "EEV_Timer": "EEV_Timer",
    "EEV_Threshold_Timer": "EEV_Threshold_Timer",
    "Pump_APP_State": "Pump_APP_State",
    "Pump_Timer": "Pump_Timer",
    "Demand_1": "Demand_1",
    "P_EEV_Open_Time": "P_EEV_Open_Time",
    "P_KP": "P_KP",
    "P_Superheat_Error_Scalor": "P_Superheat_Error_Scalor",
    "P_EEV_Threshold_Check_Time": "P_EEV_Threshold_Check_Time",
    "P_Fan_Auto": "P_Fan_Auto",
    "pump_mode": "pump_Mode",
    "pump_rpm_set": "pump_rpm_set",
}

DEVICE_PREFIX = "LAB%"  # same filter as: WHERE Device_Id LIKE 'LAB%'


def _db_time(dt: datetime) -> datetime:
    """Aware datetime -> naive UTC, which is how MySQL DATETIME values are stored here."""
    return dt.astimezone(UTC).replace(tzinfo=None)


def _to_ms(ts) -> int:
    """Time_stamp -> epoch milliseconds (handles DATETIME or a numeric epoch)."""
    if isinstance(ts, datetime):
        return int(ts.replace(tzinfo=UTC).timestamp() * 1000)
    ts = float(ts)
    return int(ts if ts > 1e12 else ts * 1000)


class MysqlSource:
    def get_series(
        self, start: datetime, end: datetime, names: list[str] | None = None
    ) -> SeriesResponse:
        columns = [
            col for col, key in COLUMN_MAP.items() if names is None or key in names
        ]

        select_list = ", ".join(f"`{c}`" for c in columns)

        sql = f"""
            SELECT `Time_stamp`, {select_list}
            FROM `heatpump_data`
            WHERE `Device_Id` LIKE %s AND
            `Time_stamp` BETWEEN %s AND %s
            ORDER BY `Time_stamp` ASC
            LIMIT %s
        """

        db = get_connection_objects()
        if not db:
            raise RuntimeError("Could not connect to MySQL")
        conn, cursor = db["connection"], db["cursor"]

        try:
            cursor.execute(
                sql, (DEVICE_PREFIX, _db_time(start), _db_time(end), MAX_ROWS)
            )
            rows = cursor.fetchall()
        finally:
            cursor.close()
            db["cursor"].close()
            conn.close()

        # print(rows)
        # Wide rows are already the right shape: one list per column.
        timestamps = [_to_ms(row[0]) for row in rows]
        series = []
        for i, col in enumerate(columns, start=1):
            key = COLUMN_MAP[col]
            unit, axis, _ = SIGNALS.get(key, ("", "left", 0))
            values = [None if row[i] is None else float(row[i]) for row in rows]
            series.append(
                Series(name=key, unit=unit, axis=axis, values=values)
            )  # type: 

        return SeriesResponse(timestamps=timestamps, series=series)

    def validate(
        self, email: str | None = None, password: str | None = None
    ) -> LoginRequest:

        sql = f"SELECT * FROM `ep011-db`.`User` WHERE `Email` = '{email}' AND `Password` = '{password}'"
        db = get_connection_objects()
        if not db:
            raise RuntimeError("Could not connect to MySQL")
        conn, cursor = db["connection"], db["cursor"]
        try:
            cursor.execute(sql)
            rows = cursor.fetchall()
        finally:
            cursor.close()
            db["cursor"].close()
            conn.close()

        timestamps = datetime.now()
        user = []

        user = LoginRequest(
            name=rows[0][1], email=rows[0][2], password=rows[0][3], id=rows[0][0]
        )

        return user


# ms = MysqlSource()

# ms.validate("smukhopadhyay@grant.ie", "123")
