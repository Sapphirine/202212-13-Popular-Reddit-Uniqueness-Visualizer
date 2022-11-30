from requests_html import HTMLSession

session = HTMLSession()
r = session.get('https://www.reddit.com/posts/2019/january-1-1/')