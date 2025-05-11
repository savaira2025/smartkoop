import logging
from app.db.init_db import init_db
from app.db.database import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init() -> None:
    """
    Initialize the database with test data
    """
    logger.info("Creating initial data")
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    logger.info("Initial data created")

if __name__ == "__main__":
    init()
