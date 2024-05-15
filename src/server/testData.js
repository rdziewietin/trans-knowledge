import * as db from "./db.js";
import * as news from "../client/article.js";
import * as resources from "../client/resources.js";
import * as comments from "../client/comments.js";


// Saving articles to database
export async function createTestArticles(){

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

    if ((await db.loadDoc("Positive-feed")) === null) {
        const doc = {
        _id: "Positive-feed",
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
      if ((await db.loadDoc("Neutral-feed")) === null) {
        const doc = {
          _id: "Neutral-feed",
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
      if ((await db.loadDoc("Negative-feed")) === null) {
        const doc = {
          _id: "Negative-feed",
          contents: negArticles,
        };
        db.saveDoc(doc);
      }
}

export async function createTestComments(){
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
}


export async function createTestResources(){
    // Test resources
    const allResources = [];

    const resourceCategoryTest = new resources.Resource(
    "Trans Clinics", 
    "default"
    );
    allResources.push(resourceCategoryTest);

    const resourceCategoryTest2 = new resources.Resource(
      "Voice Training", 
      "default"
      );
      allResources.push(resourceCategoryTest2);

    const resourceLinkTest = new resources.Resource(
    "Transhealth",
    "Trans Clinics",
    "https://transhealth.com",
    );
    allResources.push(resourceLinkTest);

    const resourceLinkTest2 = new resources.Resource(
      "Planned Parenthood",
      "Trans Clinics",
      "https://plannedparenthood.org",
      );
      allResources.push(resourceLinkTest2);

    const resourceLinkTest3 = new resources.Resource(
      "GenderGP",
      "Voice Training",
      "https://www.gendergp.com/hrt-and-your-voice/",
      );
      allResources.push(resourceLinkTest3);

    const resourceLinkTest4 = new resources.Resource(
      "Cleveland Clinic",
      "Voice Training",
      "https://my.clevelandclinic.org/health/treatments/24510-transgender-voice-therapy",
      );
      allResources.push(resourceLinkTest4);

    // Saving resources to database
    if ((await db.loadDoc("testResources")) === null) {
    const doc = {
        _id: "testResources",
        contents: allResources,
    };
    db.saveDoc(doc);
    }
}