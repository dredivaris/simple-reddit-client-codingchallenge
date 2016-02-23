from functools import wraps

from flask import jsonify
from flask.ext.restful import Api, Resource, reqparse, abort

from app import app, db
from app.models import User, FavoriteLink
from app.reddit import get_submissions

api = Api(app)


class RedditAPI(Resource):
    def get(self, subreddit):
        parser = reqparse.RequestParser()
        parser.add_argument('number_of_entries', type=int, help='Number of posts', required=False)
        parser.add_argument('after_name', type=str, required=False)
        args = parser.parse_args()

        return jsonify({'submissions': get_submissions(subreddit,
                                                       args['number_of_entries'],
                                                       args['after_name'])})


api.add_resource(RedditAPI, '/reddit/api/v1.0/<string:subreddit>/')


def validate_id(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = User.query.get(kwargs['user'])
        if not user:
            abort(404, message='Invalid user')
        kwargs['user'] = user
        return func(*args, **kwargs)
    return wrapper


class FavoritingResource(Resource):
    method_decorators = [validate_id]


class FavoritingListAPI(FavoritingResource):
    def get(self, user):
        favorites = [{'url': f.url,
                      'thumbnail': f.thumbnail,
                      'reddit_post_id': f.reddit_post_id,
                      'title': f.title} for f in user.favorite_links.all()]
        return {'success': True, 'user': user.id, 'favorites': favorites}

    def post(self, user):
        parser = reqparse.RequestParser()
        parser.add_argument('url', type=str, required=True)
        parser.add_argument('thumbnail', type=str, required=False)
        parser.add_argument('reddit_post_id', type=str, required=True)
        parser.add_argument('title', type=str, required=False)
        args = parser.parse_args()

        fav_link = FavoriteLink(url=args['url'], reddit_post_id=args['reddit_post_id'], owner=user)
        if 'thumbnail' in args:
            fav_link.thumbnail = args['thumbnail']
        if 'title' in args:
            fav_link.title = args['title']
        db.session.commit()
        return {'success': True,
                'favorite_link': {
                    'url': fav_link.url,
                    'thumbnail': fav_link.thumbnail,
                    'reddit_post_id': fav_link.reddit_post_id
                }}


class FavoritingAPI(FavoritingResource):
    def delete(self, user, reddit_post_id):
        FavoriteLink.query.filter_by(owner=user, reddit_post_id=reddit_post_id).delete()
        db.session.commit()
        return {'success': True}

api.add_resource(FavoritingListAPI, '/favoriting/api/v1.0/<int:user>/')
api.add_resource(FavoritingAPI, '/favoriting/api/v1.0/<int:user>/<string:reddit_post_id>/')
