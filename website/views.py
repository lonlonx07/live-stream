from flask import Blueprint, render_template, Flask, request, jsonify, Response
from website.static.db_class import strg_class
import json
from . import db
from .models import tbl_kanji, tbl_vocabs, tbl_grammar
import cv2
camera = cv2.VideoCapture(0)  # Use 0 for default webcam

views = Blueprint('views', __name__)
 
@views.route('/', methods = ['GET']) 
def home(): 
    if(request.method == 'GET'): 
        kanji_data = tbl_kanji.query.all() 
        vocab_data = tbl_vocabs.query.all() 
        return render_template("home.html", kanji_list=kanji_data, kanji_len=len(kanji_data), vocab_list=vocab_data, vocab_len=len(vocab_data))
    
@views.route('/GET/<cnd>', methods = ['GET']) 
def disp(cnd): 
    try:
        #with open(f"./nihon_flashcard_api/website/static/json/{cnd}.json", "r") as f:
            #data_ = f.read()
        
        data = []
        i=0
        if cnd == "kanji":
            query_res = tbl_kanji.query.all() 
            for item in query_res:
                data.insert(i, [item.id, item.kanji, item.onyomi, item.kunyomi, item.romaji, item.meaning, item.strokes_count, item.level])
                i+=1
        elif cnd == "vocabulary":
            query_res = tbl_vocabs.query.all() 
            for item in query_res:
                data.insert(i, [item.id, item.romaji, item.english, item.hira_kata, item.kanji, item.others, item.status])
                i+=1
        elif cnd == "grammar":
            query_res = tbl_grammar.query.all() 
            for item in query_res:
                data.insert(i, [item.id, item.romaji, item.hiragana, item.meaning, item.level])
                i+=1

        res = jsonify(data)
    except:
        res = "none"

    return res

@views.route('/add-entry', methods = ['POST']) 
def add_entry(): 
    data_entry = json.loads(request.data)
    print(data_entry['type'], data_entry['kanji'], data_entry['hirakata'])
    return jsonify({})

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@views.route('/stream')
def index():
    return render_template('stream.html')

@views.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')