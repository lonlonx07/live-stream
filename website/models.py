from . import db
from sqlalchemy import func

class tbl_kanji(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    kanji = db.Column(db.String)
    onyomi = db.Column(db.String)
    kunyomi = db.Column(db.String)
    romaji = db.Column(db.String)
    meaning = db.Column(db.String)
    strokes_count = db.Column(db.Integer)
    level = db.Column(db.Integer)

class tbl_vocabs(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    romaji = db.Column(db.String)
    english = db.Column(db.String)
    hira_kata = db.Column(db.String)
    kanji = db.Column(db.String)
    others = db.Column(db.String)
    status = db.Column(db.Integer)

class tbl_grammar(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    romaji = db.Column(db.String)
    hiragana = db.Column(db.String)
    meaning = db.Column(db.String)
    level = db.Column(db.Integer)