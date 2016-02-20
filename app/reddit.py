import praw

from app.constants import REDDIT_USERAGENT


def get_submissions(subreddit, num_entries, after):
    num_entries = num_entries if num_entries else 25
    reddit = praw.Reddit(user_agent=REDDIT_USERAGENT)
    params = {'after': after} if after else None
    all_gen = reddit.get_subreddit(subreddit).get_hot(limit=num_entries, params=params)
    return [{'link': s.permalink,
             'thumbnail': s.thumbnail,
             'title': s.title,
             'name': s.name} for s in all_gen]
