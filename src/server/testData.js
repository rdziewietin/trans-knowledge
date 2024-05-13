import * as db from "./db.js";

// Test articles
const posArticles = [];
const neutArticles = [];
const negArticles = [];

const newsPosTest = new news.Article(
  "Slate",
  "Trans People Good",
  "Trans people deserve to live.",
  "https://slate.com",
);
posArticles.push(newsPosTest);
const newsPosTest2 = new news.Article(
  "Them",
  "Trans People Great!",
  "Trans people deserve to be happy!",
  "https://them.us",
);
posArticles.push(newsPosTest2);

// Saving articles to database
if ((await db.loadDoc("Positive")) === null) {
  const doc = {
    _id: "Positive",
    contents: posArticles,
  };
  db.saveDoc(doc);
}

const newsNeutTest = new news.Article(
  "New York Times",
  "Trans People Good?",
  "Do trans people deserve to live?",
  "https://nytimes.com",
);
neutArticles.push(newsNeutTest);

// Saving articles to database
if ((await db.loadDoc("Neutral")) === null) {
  const doc = {
    _id: "Neutral",
    contents: neutArticles,
  };
  db.saveDoc(doc);
}

const newsNegTest = new news.Article(
  "Fox News",
  "Trans People Bad",
  "Trans people don't deserve to live.",
  "https://foxnews.com",
);
negArticles.push(newsNegTest);

// Saving articles to database
if ((await db.loadDoc("Negative")) === null) {
  const doc = {
    _id: "Negative",
    contents: negArticles,
  };
  db.saveDoc(doc);
}

// Test comments
const allComments = [];

const commentTest = new comments.Comment(
  "Hi!",
  "default",
  new Date("April 21, 24 20:01:04 GMT+00:00"),
);
allComments.push(commentTest);

const replyTest = new comments.Comment(
  "Hi :)",
  commentTest.id,
  new Date("April 22, 24 13:51:42 GMT+00:00"),
);
allComments.push(replyTest);

// Saving comments to database
if ((await db.loadDoc("testComments")) === null) {
  const doc = {
    _id: "testComments",
    contents: allComments,
  };
  db.saveDoc(doc);
}

// Test resources
const allResources = [];

const resourceCategoryTest = new resources.Resource("Trans Clinics", "default");
allResources.push(resourceCategoryTest);

const resourceLinkTest = new resources.Resource(
  "Transhealth",
  "Trans Clinics",
  "https://transhealth.com",
);
allResources.push(resourceLinkTest);

// Saving resources to database
if ((await db.loadDoc("testResources")) === null) {
  const doc = {
    _id: "testResources",
    contents: allResources,
  };
  db.saveDoc(doc);
}