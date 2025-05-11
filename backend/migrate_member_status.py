"""
Migration script to update member status values from the old format to the new format.
This script maps:
- 'active' to 'anggota'
- 'inactive' and 'suspended' remain unchanged

Usage:
python migrate_member_status.py
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add the current directory to the path so we can import the app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment or use a default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

def migrate_member_status():
    """
    Migrate member status values from old format to new format
    """
    # Create engine and session
    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Get count of members with old status values
        active_count = session.execute(text("SELECT COUNT(*) FROM member WHERE status = 'active'")).scalar()
        
        print(f"Found {active_count} members with status 'active'")
        
        # Update 'active' to 'anggota'
        if active_count > 0:
            session.execute(text("UPDATE member SET status = 'anggota' WHERE status = 'active'"))
            print(f"Updated {active_count} members from 'active' to 'anggota'")
        
        # Commit the changes
        session.commit()
        print("Migration completed successfully")
        
    except Exception as e:
        session.rollback()
        print(f"Error during migration: {e}")
        
    finally:
        session.close()

if __name__ == "__main__":
    print("Starting member status migration...")
    migrate_member_status()
    print("Migration process completed.")
