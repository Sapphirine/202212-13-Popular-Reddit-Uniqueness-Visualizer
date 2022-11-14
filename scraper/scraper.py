import praw
import pandas as pd

reddit_read_only = praw.Reddit(client_id="6Y5YYofos73ccNJ60hUdRw",         # your client id
                               client_secret="iZXMfHJsHA4jc0p3fL9vaub0ca4Zrg",      # your client secret
                               user_agent="PRUV")        # your user agent

posts_dict = {"Title": [], "Title Link": [],
              "Author": [], "Score": [],
              "Num Comments": [], "Subreddit": []
              }
subreddit = reddit_read_only.subreddit("Popular")

idx = 0
file_num = 1
for post in subreddit.hot(limit=25):
    posts_dict["Title"].append(post.title)
    posts_dict["Title Link"].append(
        post.url if not post.is_self else "N/A")
    posts_dict["Author"].append(post.author)
    posts_dict["Score"].append(post.score)
    posts_dict["Num Comments"].append(post.num_comments)
    posts_dict["Subreddit"].append(post.subreddit)

    if idx % 5 == 0:
        top_posts = pd.DataFrame(posts_dict)
        print(top_posts)
        top_posts.to_csv(str(file_num)+".csv", index=False)
        posts_dict = {"Title": [], "Title Link": [],
                      "Author": [], "Score": [],
                      "Num Comments": [], "Subreddit": []
                      }
        file_num = file_num + 1
    idx = idx + 1


top_posts = pd.DataFrame(posts_dict)
print(top_posts)
top_posts.to_csv(str(file_num)+".csv", index=False)
