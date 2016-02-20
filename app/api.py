from functools import wraps

from flask import jsonify
from flask.ext.restful import Api, Resource, reqparse, abort

from app import app
from app.models import User
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


class FavoritingAPI(FavoritingResource):
    def get(self, user):
        return jsonify({'success': True, 'user': user.id})

    def post(self, user):
        return jsonify()

api.add_resource(FavoritingAPI, '/favoriting/api/v1.0/<int:user>/')
