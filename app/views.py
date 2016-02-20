
from app import app
from flask import render_template

# route to flask tutorial page
@app.route('/')
def index():
    return render_template('index.html',
                           title='Home')


# route to react tutorial page
@app.route('/hello_template')
def hello():
    return render_template('hello.html')
