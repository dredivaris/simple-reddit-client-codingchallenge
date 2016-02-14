from flask import render_template

from app import app


# route to basic hello world
@app.route('/hello')
def hello_world_text():
    return "Hello, World!"


# route to flask tutorial page
@app.route('/')
@app.route('/index')
def index():
    user = {'default_user': 'John Doe'}  # placeholder user
    return render_template('index.html',
                           title='Home',
                           user=user)
    # return render_template('index.html')


# route to react tutorial page
@app.route('/hello_template')
def hello():
    return render_template('hello.html')