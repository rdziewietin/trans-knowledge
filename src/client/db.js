// Only used for the JDOC objects
import { Article } from "./article";
import { Comment } from "./comments";
import { Resource } from "./resources";

// Creating the database
const dbFeed = new PouchDB("feeds");

 /**
  * Saves a document to the database.
  * @function
  * @param {JSON} doc - The document to be saved. 
  * @returns {null} - Only returns for error testing.
  */
export async function saveDoc(doc) {
  try {
    if ((await loadDoc(doc._id)) !== null) {
      throw new Error("Database already exists");
    }
    const response = await dbFeed.put(doc);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
  * Modifies a document in the database.
  * @function
  * @param {string} doc - The ID of the document to be modified. 
  * @param {Article|Comment|Resource} addition - What is being added to the document.
  */
export async function modifyDoc(name, addition) {
  try {
    const doc = await dbFeed.get(name);
    const contents = doc.contents;
    contents.push(addition);
    const response = await dbFeed.put({
      _id: name,
      _rev: doc._rev,
      contents: contents,
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

/**
  * Loads a document from the database.
  * @function
  * @param {string} name - The ID of the document to be retrieved. 
  * @returns {JSON|null} - Returns null for error testing, the document if correct.
  */
export async function loadDoc(name) {
  try {
    const doc = await dbFeed.get(name);
    return doc;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
  * Removes a document from the database.
  * @function
  * @param {doc} doc - The name of the document to be removed. 
  */
export async function removeDoc(name) {
  try {
    const doc = await dbFeed.get(name);
    await dbFeed.remove(doc);
  } catch (error) {
    console.error(error);
    return;
  }
}
