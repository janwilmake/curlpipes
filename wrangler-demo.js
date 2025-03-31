export default {
  /**
   *
   * @param {Request} request
   * @returns {Response}
   */
  fetch: async (request) => {
    // This is too annoying! Should just work with the first URL if I pass username:password in the URL
    const authorization = request.headers.get("Authorization");
    const firstUrl = new URL(request.url);
    const credentials = authorization.startsWith("Basic ")
      ? atob(authorization.slice("Basic ".length))
      : undefined;
    const url = credentials
      ? new URL("https://" + credentials + "@" + firstUrl.host, firstUrl)
      : firstUrl;
    const username = url.username;
    const password = url.password;
    console.log("URL credentials:", JSON.stringify({ username, password }));

    // THIS WORKS GREAT!
    const text = await request.text();
    console.log(text);
    return new Response("You entered text with " + text.length + " chars");
  },
};
