export default {
  fetch: async (request) => {
    const text = await request.text();
    console.log(text);
    return new Response("You entered text with " + text.length + " chars");
  },
};
