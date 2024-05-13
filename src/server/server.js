import * as db from "./db.js";
import express from "express";

const headerFields = { "Content-Type": "text/plain" };

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
async function createDoc(response, doc) {
    try {
        await db.saveDoc(doc);
        response.writeHead(200, headerFields);
        response.write(`Doc Created`);
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.write("<h1>Internal Server Error</h1>");
        response.write("<p>Unable to create counter</p>");
        response.write(`<p>This is likely a duplicate counter name!</p>`);
        response.end();
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
  async function readDoc(response, name) {
    try {
      const doc = await db.loadDoc(name);
      if (doc === null){
        throw new Error();
      }
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(doc);
      response.end();
    } catch (err) {
      response.writeHead(404, headerFields);
      response.write(`<h1>Counter ${name} Not Found</h1>`);
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
  async function updateDoc(response, name, doc) {
    try {
      await db.modifyDoc(name, doc);
      response.writeHead(200, headerFields);
      response.write(`<h1>Counter Updated</h1>`);
      response.end();
    } catch (err) {
      response.writeHead(404, headerFields);
      response.write(`<h1>Counter ${name} Not Found</h1>`);
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
  async function deleteDoc(response, name) {
    try {
      response.writeHead(200, headerFields);
      response.write(`<h1>Counter Deleted</h1>`);
      response.end();
      db.removeDoc(name);
    } catch (err) {
      response.writeHead(404, headerFields);
      response.write(`<h1>Counter ${name} Not Found</h1>`);
      response.end();
    }
  }



// check ExpressJS documentation at https://expressjs.com/en/5x/api.html#app
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// The following code handles static file requests for the client-side code.
// You do not need to modify this code. It serves the client-side files from
// the `src/client` directory.
app.use(express.static("src/client"));

// TASK #3: If the HTTP method is not explicitly defined for a matching route,
// respond with a 405 status code.
// Hint: Use the `response.status`, `response.type`  and `response.send` methods to send the
// appropriate response. Your server must respond with:
// - A 405 status code (Method Not Allowed)
// - A content type of 'text/plain'
// - A response body containing 'Method Not Allowed'
const MethodNotAllowedHandler = async (request, response) => {
  response.status(405);
  response.type('text/plain');
  response.send('Method Not Allowed');
};

// Here is an example of how to handle a GET request to the '/read' path:
// Use this as a model for handling other methods and paths.
app
  .route("/read")
  .get(async (request, response) => {
    const options = request.query;
    readDoc(response, options.name);
  })
  .all(MethodNotAllowedHandler);

// Other routes
app
  .route("/create")
  .post(async (request, response) => {
    const options = request.query;
    createDoc(response, options.doc);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/update")
  .put(async (request, response) => {
    const options = request.query;
    updateDoc(response, options.name, options.doc);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/delete")
  .delete(async (request, response) => {
    const options = request.query;
    deleteDoc(response, options.name);
  })
  .all(MethodNotAllowedHandler);

// this should always be the last route
app.route("*").all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});