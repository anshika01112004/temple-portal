from pydantic import BaseModel

class TempleBase(BaseModel):
    name: str
    state: str
    history: str
    image: str

class TempleCreate(TempleBase):
    id: int

class TempleUpdate(TempleBase):
    pass