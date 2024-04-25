/**
 * Counter Management Server Module
 *
 * This module provides a comprehensive suite of functionalities for managing
 * counter data via HTTP requests. It leverages a set of core operations
 * including creating, reading, updating, and deleting counters, along with a
 * functionality to dump all counters. These operations are exposed through a
 * basic HTTP server setup that routes incoming requests to the appropriate
 * action based on the URL path and query parameters.
 *
 * Core Functionalities:
 * - `createCounter(response, name)`: Creates a new counter with a specified
 *   name. If the name is not provided, it responds with a 400 status code
 *   indicating a bad request.
 * - `readCounter(response, name)`: Reads the value of a specified counter by
 *   its name. If the counter is found, it responds with a 200 status code and
 *   the counter's value. If not, it responds with a 404 status code indicating
 *   the counter could not be found.
 * - `updateCounter(response, name)`: Updates the value of a specified counter
 *   by incrementing its count by one. Responds with a 200 status code on
 *   success or a 404 if the counter is not found.
 * - `deleteCounter(response, name)`: Deletes a specified counter by its name,
 *   responding with a 200 status code upon success or a 404 if the counter
 *   cannot be found.
 * - `dumpCounters(response)`: Dumps all counters, formatting them into an HTML
 *   response.
 * - `basicServer(request, response)`: The entry point for incoming HTTP
 *   requests. It routes the request to the appropriate counter operation based
 *   on the URL.
 *
 * Usage: This module is designed to be deployed as part of a Node.js server
 * environment. It handles HTTP requests related to counter data management,
 * making it suitable for applications requiring basic counter functionalities
 * with HTTP interfaces.
 *
 * Example: A simple use case might involve deploying this module in a Node.js
 * server and interacting with the counter operations through HTTP requests,
 * such as creating a new counter by sending a request to
 * `/create?name=myCounter` or reading a counter's value by navigating to
 * `/read?name=myCounter`.
 */

import * as http from "http";
import * as url from "url";
import * as db from "./db.js";
import * as fsp from "fs/promises";

const headerFields = { "Content-Type": "text/html", "Access-Control-Allow-Origin": "http://Localhost:3000" };

/**
 * Asynchronously creates a counter with the specified name. If the name is not
 * provided, it responds with a 400 status code indicating a bad request.
 * Otherwise, it saves the counter with an initial value of 0 to the database
 * and responds with a 200 status code indicating success.
 *
 * @async
 * @param {object} response - The HTTP response object used to send back data to
 * the client. It must have `writeHead`, `write`, and `end` methods available.
 * @param {string} [name] - The name of the counter to be created. If not
 * provided, the function will respond with an error message.
 */
async function createFeed(response, name) {
  if (name === undefined) {
    response.writeHead(400, headerFields);
    response.write("<h2>Feed Name Required</h2>");
    response.end();
  } else {
    try {
      await db.saveFeed(name, 0);
      response.writeHead(200, headerFields);
      response.write(`<h2>Feed ${name} Created</h2>`);
      response.end();
    } catch (err) {
      response.writeHead(500, headerFields);
      response.write("<h2>Internal Server Error</h2>");
      response.write("<p>Unable to create feed</p>");
      response.write(`<p>This is likely a duplicate feed name!</p>`);
      response.end();
    }
  }
}

/**
 * Asynchronously reads the value of a specified counter by its name. If the
 * counter is found, it responds with a 200 status code and the counter's value.
 * If the counter is not found, it catches the error and responds with a 404
 * status code indicating that the counter could not be found.
 *
 * @async
 * @param {object} response - The HTTP response object used to send data back to
 * the client. It must support `writeHead`, `write`, and `end` methods.
 * @param {string} name - The name of the counter to be read. The function
 * attempts to load a counter with this name from the database.
 * @throws {Error} - If there is an issue loading the counter (e.g., the counter
 * does not exist), an error is thrown and caught within the function. The
 * client is then informed that the counter was not found.
 */
async function readFeed(response, name) {
  try {
    const feed = await db.loadFeed(name);
    response.writeHead(200, headerFields);
    response.write(`<h2>Feed ${feed._id} = ${feed.count}</h2>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h2>Feed ${name} Not Found</h2>`);
    response.end();
  }
}

/**
 * Asynchronously updates the value of a specified counter by incrementing its
 * count by one. It first tries to load the counter from the database using the
 * provided name. If successful, it increments the counter's value and updates
 * the database. The client is then informed of the successful update with a 200
 * status code. If the counter cannot be found, it responds with a 404 status
 * code, indicating that the counter does not exist.
 *
 * @async
 * @param {object} response - The HTTP response object for sending data back to
 * the client. It is expected to have `writeHead`, `write`, and `end` methods.
 * @param {string} name - The name of the counter to be updated. This function
 * attempts to find and update a counter with this name in the database.
 * @throws {Error} - If the counter cannot be found or if there is a problem
 * updating the counter in the database, an error is thrown and caught within
 * the function. The client is then notified that the counter was not found.
 */
async function updateFeed(response, name) {
  try {
    const feed = await db.loadFeed(name);
    feed.count++;
    await db.modifyFeed(feed);
    response.writeHead(200, headerFields);
    response.write(`<h2>Feed ${feed._id} Updated</h2>`);
    response.end();
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h2>Feed ${name} Not Found</h2>`);
    response.end();
  }
}

/**
 * Asynchronously deletes a specified counter by its name. The function attempts
 * to find the counter in the database. If found, it sends a confirmation
 * response to the client that the counter has been deleted, and then proceeds
 * to remove the counter from the database. If the counter cannot be found, it
 * responds with a 404 status code, indicating that the counter does not exist.
 *
 * It's important to note that the removal from the database happens after
 * sending the response to the client. This means the client is informed of the
 * deletion before the deletion process completes in the database.
 *
 * @async
 * @param {object} response - The HTTP response object for sending back data to
 * the client. This object must include `writeHead`, `write`, and `end` methods
 * to properly send the response.
 * @param {string} name - The name of the counter to be deleted. The function
 * will search for a counter by this name in the database.
 * @throws {Error} - If there is an issue loading the counter (e.g., the counter
 * does not exist), an error is thrown and caught within the function. The
 * client is then informed that the counter was not found with a 404 response.
 */
async function deleteFeed(response, name) {
  try {
    const feed = await db.loadFeed(name);
    response.writeHead(200, headerFields);
    response.write(`<h2>Feed ${feed._id} Deleted</h2>`);
    response.end();
    db.removeFeed(feed);
  } catch (err) {
    response.writeHead(404, headerFields);
    response.write(`<h2>Feed ${name} Not Found</h2>`);
    response.end();
  }
}

/**
 * Asynchronously handles HTTP requests for various counter operations based on
 * the request URL. It supports creating, reading, updating, deleting, and
 * dumping all counters. The function parses the query parameters from the
 * request URL to determine the requested action and the name of the counter (if
 * applicable). It then delegates the request to the corresponding function
 * based on the URL's path.
 *
 * The server responds differently depending on the path:
 * - `/create` creates a new counter with the name provided in the query string.
 * - `/read` reads and returns the value of the counter specified by the name in
 *   the query string.
 * - `/update` increments the value of the specified counter by one.
 * - `/delete` deletes the counter specified by the name in the query string.
 * - All other request URLs trigger a dump of all counters.
 *
 * @async
 * @param {object} request - The HTTP request object, containing the URL and
 * query string from which the desired action and counter name are extracted.
 * @param {object} response - The HTTP response object used to send back data to
 * the client. It must support `writeHead`, `write`, and `end` methods.
 * @throws {Error} - Handles any errors that may occur during the processing of
 * the request. Specific errors depend on the operation attempted (e.g., counter
 * not found, database issues).
 */
async function basicServer(request, response) {
  const options = url.parse(request.url, true).query;

  // Check if the request method and path are equal to the given method and path
  const isEqual = (method, path) =>
    request.method === method && request.url === path;

  // Match the request method and path
  const isMatch = (method, path) =>
    request.method === method && request.url.startsWith(path);

  // Check if the request URL ends with a specific suffix
  const hasSuffix = (suffix) =>
    request.method === "GET" && request.url.endsWith(suffix);

  // Get the suffix of the request URL
  const getSuffix = (urlpath = request.url) => {
    const parts = urlpath.split(".");
    return parts[parts.length - 1];
  };

  // Get the content type based on the file type
  const getContentType = (urlpath = request.url) =>
    ({
      html: "text/html",
      css: "text/css",
      js: "text/javascript",
    })[getSuffix(urlpath)] || "text/plain";

  const sendStaticFile = async (urlpath = request.url) => {
    try {
      // Read the file from the src/client folder and send it back to the client
      const data = await fsp.readFile("src" + urlpath, "utf8");
      response.writeHead(200, { "Content-Type": getContentType(urlpath) });
      response.write(data);
      response.end();
      return;
    } catch (err) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("Not found: " + urlpath);
      response.end();
      return;
    }
  };

  if (isMatch("GET", "/read")) {
    await readFeed(response, options.name);
    return;
  }

  if (isMatch("POST", "/create")) {
    await createFeed(response, options.name);
    return;
  }

  if (isMatch("PUT", "/update")) {
    await updateFeed(response, options.name);
    return;
  }

  if (isMatch("DELETE", "/delete")) {
    await deleteFeed(response, options.name);
    return;
  }

  // The following code handles static file requests for the client-side code.
  // You do not need to modify this code. It serves the client-side files from
  // the `src/client` directory.
  if (
    isEqual("GET", "") ||
    isEqual("GET", "/") ||
    isEqual("GET", "/client") ||
    isEqual("GET", "/client/") ||
    isEqual("GET", "/client/index.html") ||
    isEqual("GET", "/index.html")
  ) {
    sendStaticFile("/index.html");
    return;
  }

  if (
    (isMatch("GET", "") || isMatch("GET", "/")) &&
    (hasSuffix(".html") || hasSuffix(".css") || hasSuffix(".js"))
  ) {
    sendStaticFile("/client" + request.url);
    return;
  }

  else {
    response.writeHead(405, { "Content-Type": "text/plain" });
    response.write("Method Not Allowed");
    response.end();
  }
}

http.createServer(basicServer).listen(3000, () => {
  console.log("Server started on port 3000");
});
