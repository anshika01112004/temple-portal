from sqlalchemy import Column, Integer, String
from database import Base

class Temple(Base):
    __tablename__ = "temples"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    state = Column(String)
    history = Column(String)
    image = Column(String)