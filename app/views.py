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
    user = {'nickname': 'John Doe'}  # placeholder user
    posts = [  # fake array of posts
        {
            'author': {'nickname': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'nickname': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]

    return render_template('index.html',
                           title='Home',
                           user=user,
                           posts=posts)
    # return render_template('index.html')


# route to react tutorial page
@app.route('/hello_template')
def hello():
    return render_template('hello.html')