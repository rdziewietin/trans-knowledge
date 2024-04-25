import PouchDB from "pouchdb";

const db = new PouchDB("feeds");

export async function saveFeed(name, sources){
    await db.put({_id: name, sources});
}

export async function modifyFeed(doc){
    await db.put(doc);
}

export async function loadFeed(name) {
    const feed = await db.get(name);
    return name;
}

export async function removeFeed(name) {
    db.remove(name);
}