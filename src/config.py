"""Project-level configuration placeholder.

Keep non-secret defaults here. Load credentials and deployment-specific values
from environment variables or a secrets manager once the Python API is added.
"""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# --- MySQL (used when DATA_SOURCE=mysql) -------------------------------------------------------
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_PORT = int(os.getenv("MYSQL_PORT", "3306"))
MYSQL_USER = os.getenv("MYSQL_USER", "")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "")

logging.basicConfig(
    format="%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.INFO,
)


# --- AWS Credentials for access ------------------------------------------------------------------
ACCESS_KEY = os.getenv("ACCESS_KEY", "localhost")
SECRETE_ACCESS_KEY = os.getenv("SECRETE_ACCESS_KEY", "localhost")
REGION = os.getenv("REGION", "localhost")

# --- Data source -------------------------------------------------------------------------------
DATA_SOURCE = os.getenv("DATA_SOURCE", "mock")
