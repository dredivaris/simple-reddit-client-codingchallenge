
from app import app
from flask import render_template

# route to flask tutorial page
@app.route('/')
def index():
    return render_template('index.html',
                           title='Home')