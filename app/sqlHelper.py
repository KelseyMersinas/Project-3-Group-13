from sqlalchemy import create_engine, Column, Integer, String, Float
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, declarative_base, sessionmaker

Base = declarative_base()

class MeteoriteLanding(Base):
    __tablename__ = 'meteorite-landings'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    mass = Column(Float, nullable=False)
    year = Column(Float, nullable=False) # change this to an int later
    lat = Column(Float, nullable=False)
    long = Column(Float, nullable=False)
    GeoLocation = Column(String, nullable=False)


def init_db(app):
    # Create engine and session
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    Base.metadata.create_all(engine)
    Session = scoped_session(sessionmaker(bind=engine))
    return Session()
