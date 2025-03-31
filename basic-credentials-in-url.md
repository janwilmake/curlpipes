`curl` will happily send any request that contains credentials in the URL. It will be received by any node server as basic authorization header.

However, `fetch` does not allow this.

This example gives an error:

![](credentials-in-fetch.png)

```
TypeError: Request cannot be constructed from a URL that includes credentials: https://jan:password@sponsorflare.com/
```

Unfortunate, because writing it like this is so much shorter! And `btoa` is deprecated so it's even longer now with `Buffer.from(username + ':' + password, "binary").toString("base64");`

Not acceptable! It could just do the same as how curl does it imo; not storing any creds in cache, just converting them into the basic authorization header! Yes, this would be ideal.
