from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()
DB_NAME = "flashcard_db.db"

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = "lonlonx123"
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)
    
    from .views import views

    app.register_blueprint(views, url_prefix='/')

    #from .models import tbl_kanji, tbl_vocabs, tbl_grammar
    
    # with app.app_context():
    #     db.create_all()
        
    return app

