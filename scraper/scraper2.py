from requests_html import HTMLSession
import re
import pandas as pd

session = HTMLSession()
r = session.get('https://www.reddit.com/posts/2019/january-1-1/')
posts = r.html.find('.DirectoryPost')

posts_dict = {"Title": [], 
              "Title Link": [],
              "Score": [],
              "Num Comments": [], 
              "Subreddit": []
              }

for post in posts:
    res = post.find('.DirectoryPost__Stats')[0].text.split(" · ")

    posts_dict["Title"].append(post.find('.DirectoryPost__Title')[0].text)
    posts_dict["Title Link"].append(list(post.find('.DirectoryPost__Title')[0].absolute_links)[0])
    posts_dict["Subreddit"].append(post.find('.DirectoryPost__Subreddit')[0].text)
    posts_dict["Score"].append(res[0].split(" ")[0])
    posts_dict["Num Comments"].append(res[1].split(" ")[0])

posts_df = pd.DataFrame(posts_dict)
posts_df["Score"] = posts_df["Score"].replace({'k': '*1e3', 'm': '*1e6'}, regex=True).map(pd.eval).astype(int)
posts_df["Num Comments"] = posts_df["Num Comments"].replace({'k': '*1e3', 'm': '*1e6'}, regex=True).map(pd.eval).astype(int)

print(posts_df)
posts_df.to_csv("pep.csv", index=False)