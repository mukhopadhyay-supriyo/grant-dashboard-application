from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles

from src import config
from src.api.routes import router

app = FastAPI(title="Grant API")


app.include_router(router)
