# this works, putting this in the terminal will send both datapointst to a server, with '&' in between. arguably the & doesn't matter much, so great! especially since the xymake will have 2 newlines at the end.
# thread: https://xymake.com/janwilmake/status/1906601421664833750

curl -s https://xymake.com/janwilmake/status/1906585720447189401 | curl -d @- -d @prompt.md http://localhost:8787