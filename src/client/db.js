import * as news from "./article.js";

const dbFeed = new PouchDB("feeds");
const dbComments = new PouchDB("comments");

export async function saveDoc(doc){
    try {
        if (await loadDoc(doc._id) !== null){
            throw new Error("Database already exists");
        }
        const response = await dbFeed.put(doc);
        // console.log(doc);
        console.log("Document created successfully", response);
      } catch (error) {
        // console.error(error);
        return null;
      }
}

export async function modifyDoc(name, addition){
    try {
        const doc = await dbFeed.get(name);
        const contents = doc.contents;
        contents.push(addition);
        const response = await dbFeed.put({
            _id: name,
            _rev: doc._rev,
            contents: contents
        });
        // console.log(doc);
        console.log("Document created successfully", response);
      } catch (error) {
        // console.error(error);
        return;
      }
}

export async function loadDoc(name) {
    try {
        const doc = await dbFeed.get(name);
        // console.log(doc);
        return doc;
      } catch (error) {
        // console.error(error);
        return null;
      }
}

export async function removeDoc(name) {
    try {
        const doc = await dbFeed.get(name);
        await dbFeed.remove(doc);
      } catch (error) {
        // console.error(error);
        return;
      }
}