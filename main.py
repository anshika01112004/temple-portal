from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Temple
from schemas import TempleCreate, TempleUpdate

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Home Page"}        


# GET all temples
@app.get("/temples")
def get_temples(db: Session = Depends(get_db)):
    return db.query(Temple).all()


# ADD temple
@app.post("/temples")
def add_temple(temple: TempleCreate, db: Session = Depends(get_db)):
    new_temple = Temple(**temple.dict())
    db.add(new_temple)
    db.commit()
    db.refresh(new_temple)
    return new_temple


# DELETE temple
@app.delete("/temples/{id}")
def delete_temple(id: int, db: Session = Depends(get_db)):
    temple = db.query(Temple).filter(Temple.id == id).first()

    if temple:
        db.delete(temple)
        db.commit()
        return {"message": "Deleted successfully"}

    return {"error": "Temple not found"}


# UPDATE temple
@app.put("/temples/{id}")
def update_temple(id: int, updated: TempleUpdate, db: Session = Depends(get_db)):
    temple = db.query(Temple).filter(Temple.id == id).first()

    if temple:
        temple.name = updated.name
        temple.state = updated.state
        temple.history = updated.history
        temple.image = updated.image

        db.commit()
        return {"message": "Updated successfully"}

    return {"error": "Temple not found"}