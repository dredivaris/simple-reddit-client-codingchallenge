import os

basedir = os.path.abspath(os.path.dirname(__file__))


if os.environ.get('HEROKU') is None:
    SQLALCHEMY_DATABASE_URI = "postgresql://redditdbuser:redajisdg@localhost/redditclient"
else:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')