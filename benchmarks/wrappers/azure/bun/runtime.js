/**
 * Custom server for Azure
 */

const handler = require("./handler.js");

const PORT = parseInt(process.env.FUNCTIONS_CUSTOMHANDLER_PORT) || 8080;

console.log(`Starting Bun server on port ${PORT}...`);

Bun.serve({
  port: PORT,
  async fetch(req) {
    const context = {
      invocationId: req.headers.get("x-azure-functions-invocationid") || null,
    };
    // default nodejs handler expects req.body to be already parsed (like express.js)
    const mockReq = {
      body: await req.json(),
      headers: req.headers,
    };
    try {
      const result = await handler(context, mockReq);

      return new Response(JSON.stringify(result.body), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  },
});
