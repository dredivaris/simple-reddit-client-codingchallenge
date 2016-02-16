from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)

    def __repr__(self):
        return '<User {}>'.format(self.nickname)


class FavoriteLink(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    url = db.Column(db.String, unique=True)

    def __repr__(self):
        return '<Favorite URL {}>'.format(self.url)
