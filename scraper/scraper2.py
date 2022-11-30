from requests_html import HTMLSession

session = HTMLSession()
r = session.get('https://www.reddit.com/posts/2019/january-1-1/')
posts = r.html.find('.DirectoryPost')

for post in posts:
    print(post.find('.DirectoryPost__Title')[0].text)
    print(post.find('.DirectoryPost__Subreddit')[0].text)
    print(post.find('.DirectoryPost__Stats')[0].text)