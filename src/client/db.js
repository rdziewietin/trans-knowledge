import PouchDB from "pouchdb";

const dbFeed = new PouchDB("feeds");

export async function saveFeed(name, sources){
    await dbFeed.put({_id: name, sources});
}

export async function modifyFeed(doc){
    await dbFeed.put(doc);
}

export async function loadFeed(name) {
    const feed = await dbFeed.get(name);
    return name;
}

export async function removeFeed(name) {
    dbFeed.remove(name);
}