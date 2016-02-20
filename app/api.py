from flask import jsonify
from flask.ext.restful import Api, Resource, reqparse

from app import app
from app.reddit import get_submissions

api = Api(app)


class RedditAPI(Resource):
    def get(self, subreddit):
        parser = reqparse.RequestParser()
        parser.add_argument('number_of_entries', type=int, help='Number of posts', required=False)
        parser.add_argument('after_name', type=str, required=False)
        args = parser.parse_args()

        print(args)

        return jsonify({'submissions': get_submissions(subreddit,
                                                       args['number_of_entries'],
                                                       args['after_name'])})


api.add_resource(RedditAPI, '/reddit/api/v1.0/<string:subreddit>/')

