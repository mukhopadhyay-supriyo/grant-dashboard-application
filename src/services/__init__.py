from functools import lru_cache

from src import config
from src.services.baseDataModel import DataSource


@lru_cache
def get_data_source() -> DataSource:
    """Pick the data source from the DATA_SOURCE environment variable."""
    if config.DATA_SOURCE == "mock":
        from src.services.mockData import MockSource

        return MockSource()
    if config.DATA_SOURCE == "mysql":
        from src.services.mysql_source import MysqlSource

        return MysqlSource()
    raise ValueError(f"Unknown DATA_SOURCE: {config.DATA_SOURCE!r}")
