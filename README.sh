# this works, putting this in the terminal will send both datapointst to a server, with '&' in between. arguably the & doesn't matter much, so great! especially since the xymake will have 2 newlines at the end.
# thread: https://xymake.com/janwilmake/status/1906601421664833750

# run wrangler server with 'wrangler dev wrangler-demo.js'
# then:
curl -s https://xymake.com/janwilmake/status/1906585720447189401 | curl -d @- -d @prompt.md http://localhost:8787

# the node.js demo shows that the request is actually comprised of the url and some headers for the host and credentials!
# with this in mind, the behavior of workerd makes more sense, but it's still annoying that they DO add the hostname to the request.url, but they forgot the basic credentials! 
# run node demo with 'node node-demo.js'

# Great explanation: https://github.com/cloudflare/workerd/issues/194