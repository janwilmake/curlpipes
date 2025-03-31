# URL Pipes

A lightweight toolbox for handling URL pipes - passing and processing URLs through other URLs.

## What are URL Pipes?

URL pipes allow you to:

1. Pass a URL as a parameter to another URL: `https://urlpipes.com/{encoded_url}`
2. Chain URL requests recursively: `https://urlpipes.com/process/https://example.com/data`
3. Stream content between endpoints using curl pipes: `curl -s https://example.com | curl -d @- https://urlpipes.com/process`

## Better API Design Through URL Pipes

URL Pipes create cleaner, more concise API endpoints by:

- **Eliminating verbose query params**: Use `urlpipes.com/fetch/https://example.com` instead of `urlpipes.com/fetch?url=https://example.com&format=json&other=params`
- **Reducing parameter encoding complexity**: No need to manually encode special characters in params
- **Keeping URLs short and readable**: Treat entire URLs as single path parameters
- **Enabling simple function chaining**: Each pipe is a transformation that can be composed

## Usage Examples

### Basic URL Pipe

```
https://urlpipes.com/process/https://example.com/data
```

### Curl Piping

This pipes data from one endpoint to another:

```bash
curl -s https://xymake.com/some/status | curl -d @- https://urlpipes.com/process
```

## Implementation Notes

URL pipes provide a clean way to chain data processing between services:

```javascript
// Process incoming data and send to the next pipe
export default {
  fetch: async (request) => {
    const text = await request.text();
    // Simple transformation on piped content
    return new Response("Processed " + text.length + " chars");
  },
};
```

## Browser Compatibility

URL pipes work in modern browsers too:

```
https://urlpipes.com/process/https://example.com/data
```

## Why URL Pipes?

- **Elegant composition**: Chain multiple transformations with minimal syntax
- **Simplified APIs**: Keep endpoints clean without query param bloat
- **Flexible pipelines**: Works across tools (curl, browsers, custom clients)
- **Improved readability**: URLs clearly show the processing flow

## License

MIT
