from flask import render_template

from app import app


# @app.route('/')
@app.route('/hello')
def hello_world_text():
    return "Hello, World!"


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/hello_template')
def hello():
    return render_template('hello.html')