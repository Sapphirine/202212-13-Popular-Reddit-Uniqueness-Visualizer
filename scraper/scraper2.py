from requests_html import HTMLSession
import pandas as pd
import calendar
from datetime import date, timedelta
import os

start_date = date(2019, 1, 1)
end_date = date(2020, 1, 1)
delta = timedelta(days=1)
while start_date < end_date:
    year = start_date.year
    day = start_date.day
    month = calendar.month_name[start_date.month]
    start_date += delta

    session = HTMLSession()
    r = session.get(f'https://www.reddit.com/posts/{year}/{month}-{day}-1/')
    print(f'Scraping https://www.reddit.com/posts/{year}/{month}-{day}-1/')
    
    posts_dict = {"Title": [], 
                "Title Link": [],
                "Score": [],
                "Num Comments": [], 
                "Subreddit": []
                }
    posts = r.html.find('.DirectoryPost')
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

    if not os.path.exists(f'{year}'):
        os.makedirs(f'{year}')

    posts_df.to_csv(f'{year}/{month}-{day}.csv', index=False)

