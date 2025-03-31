export default {
  /**
   *
   * @param {Request} request
   * @returns {Response}
   */
  fetch: async (request) => {
    // This is too annoying! Should just work with the first URL if I pass username:password in the URL
    const authorization = request.headers.get("Authorization");
    const url = new URL(request.url);
    const [username, password] = authorization.startsWith("Basic ")
      ? atob(authorization.slice("Basic ".length)).split(":")
      : [];
    url.username = username;
    url.password = password;

    console.log("URL credentials:", JSON.stringify({ username, password }));

    // THIS WORKS GREAT!
    const text = await request.text();
    console.log(text);
    return new Response("You entered text with " + text.length + " chars");
  },
};
