from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    favorite_links = db.relationship('FavoriteLink', backref='owner', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.nickname)


class FavoriteLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reddit_post_id = db.Column(db.String, unique=True)
    url = db.Column(db.String, unique=False)
    thumbnail = db.Column(db.String)
    title = db.Column(db.String)

    def __repr__(self):
        return '<Favorite URL {}>'.format(self.url)
