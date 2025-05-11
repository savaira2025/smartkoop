from sqlalchemy.orm import Session
from app.db.database import Base, engine
from app.models.user import User
from app.models.member import Member, SavingsTransaction, SHUDistribution
from app.utils.security import get_password_hash
from app.utils.id_generator import generate_member_id
from datetime import date, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db(db: Session) -> None:
    """
    Initialize the database with some test data
    """
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Created database tables")
    
    # Check if we already have users
    user = db.query(User).first()
    if user:
        logger.info("Database already initialized, skipping")
        return
    
    # Create admin user
    admin_user = User(
        username="admin",
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        full_name="Admin User",
        is_active=True,
        is_superuser=True,
        role="admin"
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    logger.info(f"Created admin user: {admin_user.username}")
    
    # Create test members
    members = [
        {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "address": "123 Main St, Anytown, USA",
            "join_date": date.today() - timedelta(days=30),
            "principal_savings": 5000,
            "mandatory_savings": 2000,
            "voluntary_savings": 1000,
            "status": "active"
        },
        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "phone": "0987654321",
            "address": "456 Oak Ave, Somewhere, USA",
            "join_date": date.today() - timedelta(days=60),
            "principal_savings": 5000,
            "mandatory_savings": 3000,
            "voluntary_savings": 2000,
            "status": "active"
        },
        {
            "name": "Bob Johnson",
            "email": "bob.johnson@example.com",
            "phone": "5551234567",
            "address": "789 Pine Rd, Nowhere, USA",
            "join_date": date.today() - timedelta(days=90),
            "principal_savings": 5000,
            "mandatory_savings": 4000,
            "voluntary_savings": 3000,
            "status": "active"
        }
    ]
    
    for member_data in members:
        member = Member(
            member_id=generate_member_id(db),
            name=member_data["name"],
            email=member_data["email"],
            phone=member_data["phone"],
            address=member_data["address"],
            join_date=member_data["join_date"],
            principal_savings=member_data["principal_savings"],
            mandatory_savings=member_data["mandatory_savings"],
            voluntary_savings=member_data["voluntary_savings"],
            unpaid_mandatory=0,
            shu_balance=0,
            status=member_data["status"],
            registration_method="web"
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        logger.info(f"Created member: {member.name} with ID: {member.member_id}")
        
        # Create savings transactions for this member
        transactions = [
            {
                "transaction_date": date.today() - timedelta(days=30),
                "amount": member_data["principal_savings"],
                "transaction_type": "principal",
                "description": "Initial principal savings",
                "status": "completed"
            },
            {
                "transaction_date": date.today() - timedelta(days=30),
                "amount": member_data["mandatory_savings"],
                "transaction_type": "mandatory",
                "description": "Initial mandatory savings",
                "status": "completed"
            },
            {
                "transaction_date": date.today() - timedelta(days=30),
                "amount": member_data["voluntary_savings"],
                "transaction_type": "voluntary",
                "description": "Initial voluntary savings",
                "status": "completed"
            }
        ]
        
        for transaction_data in transactions:
            transaction = SavingsTransaction(
                member_id=member.id,
                transaction_date=transaction_data["transaction_date"],
                amount=transaction_data["amount"],
                transaction_type=transaction_data["transaction_type"],
                description=transaction_data["description"],
                status=transaction_data["status"]
            )
            db.add(transaction)
        
        db.commit()
        logger.info(f"Created savings transactions for member: {member.name}")
    
    logger.info("Database initialization completed")

if __name__ == "__main__":
    from app.db.database import SessionLocal
    
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
