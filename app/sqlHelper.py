from sqlalchemy import create_engine, Column, String, Float, BigInteger
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

Base = declarative_base()

class MeteoriteLanding(Base):
    __tablename__ = 'meteorite-landings'  
    id = Column(BigInteger, primary_key=True)
    name = Column(String, nullable=False)
    mass = Column(Float, nullable=False)
    recclass = Column(String, nullable=False)
    year = Column(Float, nullable=False)  # Consider changing to Integer if appropriate
    lat = Column(Float, nullable=False)
    long = Column(Float, nullable=False)
    GeoLocation = Column(String, nullable=False)

def init_db(app):
    print('Initializing database...')
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    Base.metadata.create_all(engine)
    Session = scoped_session(sessionmaker(bind=engine))
    return Session