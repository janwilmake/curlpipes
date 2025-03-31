export default {
  /**
   *
   * @param {Request} request
   * @returns {Response}
   */
  fetch: async (request) => {
    const url = new URL(request.url);
    const username = url.username;
    const password = url.password;
    // NB: This does NOT WORK!!!!!
    console.log("URL username:", username);
    console.log("URL password:", password);
    console.log("Full URL:", request.url);

    // THIS WORKS GREAT!
    const text = await request.text();
    console.log(text);
    return new Response("You entered text with " + text.length + " chars");
  },
};
