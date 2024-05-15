import * as db from "./db.js";
import express from "express";
import * as test from "./testData.js";
import open from "open";

const headerFields = { "Content-Type": "text/plain" };

/**
 * Creates a document using the database, with the _id field as its name.
 * The doc is premade by the client. It returns a 409 error if the doc is
 * already created, which it sends back as a 500 error. Otherwise, it sends
 * 200. 
 *
 * @async
 * @param {object} response - The HTTP response object.
 * @param {string} doc - The document that will be created.
 * @throws {Error} - Catches errors both if the response fails and if it
 * succeeds but happens to be null.
 */
async function createDoc(response, doc) {
    try {
        const result = await db.saveDoc(doc);
        if (result === null){
            throw new Error();
        }
        response.writeHead(200, headerFields);
        response.end();
    } catch (err) {
        response.writeHead(500, headerFields);
        response.end();
    }
}
  
  /**
   * Loads a document from the database, then returns a JSON string version
   * in the response body. If the doc does not exist, it gives a 404 error.
   * Otherwise, it returns 200.
   *
   * @async
   * @param {object} response - The HTTP response object.
   * @param {string} name - The name of the document to be obtained.
   * @throws {Error} - Catches errors both if the response fails and if it
   * succeeds but happens to be null.
   */
  async function readDoc(response, name) {
    try {
      const doc = await db.loadDoc(name);
      if (doc === null){
        throw new Error();
      }
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(doc));
      response.end();
    } catch (err) {
      response.writeHead(404, headerFields);
      response.end();
    }
  }
  
  /**
   * Updates a specified document using the modifyDoc method. It requires
   * the name of the document to be retrieved and the updated doc to be saved,
   * which is created client-side. If the doc does not exist, it returns a 404
   * error. Otherwise, it returns 200. 
   *
   * @async
   * @param {object} response - The HTTP response object.
   * @param {string} name - The name of the doc to be updated.
   * @param {string} doc - The updated doc.
   * @throws {Error} - If the response sends back an error, then it throws
   * an error.
   */
  async function updateDoc(response, name, doc) {
    try {
      await db.modifyDoc(name, doc);
      response.writeHead(200, headerFields);
      response.end();
    } catch (err) {
      response.writeHead(404, headerFields);
      response.end();
    }
  }
  
  /**
   * Deletes a doc from the database using the deleteDoc method. It requires
   * the name of the document to be submitted in order to find the doc in the
   * database. While there is a catch for 404 errors that occur during the process,
   * regardless of whether the doc exists or not, the client will receive a 200 code
   * (either way, the doc is gone).
   * 
   *
   * @async
   * @param {object} response - The HTTP response object.
   * @param {string} name - The name of the doc to be deleted.
   * @throws {Error} - If there is an issue loading the counter (e.g., the counter
   * does not exist), an error is thrown and caught within the function. The
   * client is then informed that the counter was not found with a 404 response.
   */
  async function deleteDoc(response, name) {
    try {
      response.writeHead(200, headerFields);
      response.end();
      db.removeDoc(name);
    } catch (err) {
      response.writeHead(404, headerFields);
      response.end();
    }
  }

// Creating the mock data for this milestone
test.createTestArticles();
test.createTestComments();
test.createTestResources();

// Basic express setup
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("src/client"));

// A handler that checks to make sure the JS method fits with the HTTP method. 
const MethodNotAllowedHandler = async (request, response) => {
  response.status(405);
  response.type('text/plain');
  response.send('Method Not Allowed');
};

// Routing using express
app
  .route("/read")
  .get(async (request, response) => {
    const options = request.query;
    readDoc(response, options.name);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/create")
  .post(async (request, response) => {
    const doc = request.body;
    createDoc(response, doc);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/update")
  .put(async (request, response) => {
    const options = request.query;
    const doc = request.body;
    updateDoc(response, options.name, doc);
  })
  .all(MethodNotAllowedHandler);

app
  .route("/delete")
  .delete(async (request, response) => {
    const options = request.query;
    deleteDoc(response, options.name);
  })
  .all(MethodNotAllowedHandler);

// Otherwise, 404
app.route("*").all(async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Auto-opening in the browser
await open("http://localhost:3000");