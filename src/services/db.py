"""
This file contains the mysql database configuration
"""

from typing import Dict
import mysql.connector
from mysql.connector import Error
from src.config import logging
from functools import lru_cache
import src.config as config


def rds_connection(
    host: str, database: str, username: str, password: str, port: int
) -> Dict:
    dict = {}
    retry = 0
    try:
        connection = mysql.connector.connect(
            host=host, database=database, user=username, password=password, port=port
        )
        if connection.is_connected():
            connection.autocommit = False  # type: ignore
            db_Info = connection.get_server_info()
            logging.info("Connected to MySQL Server version " + str(db_Info))
            cursor = connection.cursor()
            connection.autocommit = True  # type: ignore
            dict["cursor"] = cursor
            dict["connection"] = connection
            return dict
            # get all records
        else:
            if retry != 5:
                logging.warning("retry database connection :" + str(retry))
                retry += 1
                rds_connection(host, database, username, password, port)
            else:
                logging.error(
                    {
                        "message": f"Failed to connect to {database} check credentials !!",
                        "line": format(sys.exc_info()[-1].tb_lineno),  # type: ignore
                    }
                )

    except Error as e:
        logging.error(
            {
                "message": "Failed to connect to RDS database",
                "error": str(e),
                "line": e.__traceback__.tb_lineno if e.__traceback__ else None,
            }
        )
    finally:
        return dict


# @lru_cache
def get_connection_objects() -> Dict:
    return rds_connection(
        config.MYSQL_HOST,
        config.MYSQL_DATABASE,
        config.MYSQL_USER,
        config.MYSQL_PASSWORD,
        config.MYSQL_PORT,
    )
