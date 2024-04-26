import * as views from "./views.js";
import * as news from "./article.js";
import * as resources from "./resources.js"
import * as comments from "./comments.js";
import * as db from "./db.js";
import { areas, stateNames, stateQuality } from "./map.js";

// Test articles
const posArticles = [];
const neutArticles = [];
const negArticles = [];

const newsPosTest = new news.Article("Slate", "Trans People Good", "Trans people deserve to live.", "https://slate.com");
posArticles.push(newsPosTest);
const newsPosTest2 = new news.Article("Them", "Trans People Great!", "Trans people deserve to be happy!", "https://them.us");
posArticles.push(newsPosTest2);
if (await db.loadDoc("Positive") === null){
  const doc = {
    _id: "Positive",
    contents: posArticles
  };
  db.saveDoc(doc);
}

const newsNeutTest = new news.Article("New York Times", "Trans People Good?", "Do trans people deserve to live?", "https://nytimes.com");
neutArticles.push(newsNeutTest);
if (await db.loadDoc("Neutral") === null){
  const doc = {
    _id: "Neutral",
    contents: neutArticles
  };
  db.saveDoc(doc);
}

const newsNegTest = new news.Article("Fox News", "Trans People Bad", "Trans people don't deserve to live.", "https://foxnews.com");
negArticles.push(newsNegTest);
if (await db.loadDoc("Negative") === null){
  const doc = {
    _id: "Negative",
    contents: negArticles
  };
  db.saveDoc(doc);
}


// Test comments
const allComments = [];
const commentTest = new comments.Comment("Hi!", "default", new Date('April 21, 24 20:01:04 GMT+00:00'));
allComments.push(commentTest);
const replyTest = new comments.Comment("Hi :)", commentTest.id, new Date('April 22, 24 13:51:42 GMT+00:00'));
allComments.push(replyTest);
if (await db.loadDoc("testComments") === null){
  const doc = {
    _id: "testComments",
    contents: allComments
  };
  db.saveDoc(doc);
}

// Test resources
const allResources = [];
const resourceCategoryTest = new resources.Resource("Trans Clinics", "default");
allResources.push(resourceCategoryTest);
const resourceLinkTest = new resources.Resource("Transhealth", "Trans Clinics", "https://transhealth.com");
allResources.push(resourceLinkTest);
if (await db.loadDoc("testResources") === null){
  const doc = {
    _id: "testResources",
    contents: allResources
  };
  db.saveDoc(doc);
}



// Functions for rendering data onto the webpage
async function renderAllArticles(feed, container){
  const loadedFeed = await db.loadDoc(feed);
  document.getElementById("news-header").innerText = feed;
  container.innerHTML = "";
  for (let article in loadedFeed.contents) {
    const jsonArticle = loadedFeed.contents[article];
    const currArticle = new news.Article(jsonArticle.source, jsonArticle.headline, jsonArticle.summary, jsonArticle.link);
    currArticle.render(container);
  }
}

async function renderAllComments(list, container){
  let map = new Map();
  const loadedFeed = await db.loadDoc(list);
  container.innerHTML = "";
  for (let comment in loadedFeed.contents) {
    const jsonComment = loadedFeed.contents[comment];
    const currComment = new comments.Comment(jsonComment.info, jsonComment.category, jsonComment.date, jsonComment.id);
    let div = null;
    if (map.has(jsonComment.category)){
      div = currComment.render(map.get(jsonComment.category));
    }
    else {
      div = currComment.render(container);
    }
    const buttons = div.getElementsByTagName("button");
    for (let button in buttons){
      buttons[0].addEventListener("click", () => {reply = currComment.id; forumHeader.innerText = "Replying...";});
    }
    map.set(jsonComment.id, div);
  }
}

async function renderAllResources(category, container){
  const loadedFeed = await db.loadDoc("testResources");
  container.innerHTML = "";
  resourcesSidebar.innerHTML = "";
  if (category !== ""){
    resourcesHeader.innerText = category;
  }
  for (let article in loadedFeed.contents) {
    const jsonResources = loadedFeed.contents[article];
    if (jsonResources.category === category || jsonResources.category === "default"){
      let newContainer = container;
      if (jsonResources.category === "default"){
        newContainer = resourcesSidebar;
      }
      const currResources = new resources.Resource(jsonResources.info, jsonResources.category, jsonResources.link);
      const button = currResources.render(newContainer);
      if (jsonResources.category === "default"){
        button.addEventListener("click", () => renderAllResources(button.innerText, resourcesHolder));
      }
    }
  }
}

function renderMap(map, container){
  container.innerHTML = "";
  map.forEach((coords, state) => {
    const area = document.createElement("area");
    area.id = state;
    area.shape = "poly";
    area.coords = coords;
    container.appendChild(area);
  })
}

function loadStateInfo(area, container){
  container.innerHTML = "";
  const stateName = document.createElement("h2");
  stateName.innerText = stateNames[area.id];
  const stateDesc = document.createElement("p");
  stateDesc.innerText = stateQuality[area.id];

  container.appendChild(stateName);
  container.appendChild(stateDesc);
}

// Constants
const newsHolder = document.getElementById("news-holder");
const commentHolder = document.getElementById("comment-holder");
const resourcesSidebar = document.getElementById("resources-sidebar-links");
const mapSidebar = document.getElementById("map-sidebar");
const feedName = document.getElementById("feed-name");
const sourceName = document.getElementById("source-name");
const commentInput = document.getElementById("comment");
const forumHeader = document.getElementById("forum-header");
const resourcesHolder = document.getElementById("resources-holder");
const resourceName = document.getElementById("resource-name");
const resourcesHeader = document.getElementById("resources-header");


// Reply?
let reply = "default";


// View event listeners
document.getElementById("home").addEventListener("click", () => views.load("home"));
document.getElementById("map").addEventListener("click", () => views.load("map"));
document.getElementById("news").addEventListener("click", () => views.load("news"));
document.getElementById("forum").addEventListener("click", () => {views.load("forum"); renderAllComments("testComments", commentHolder)});
document.getElementById("resources").addEventListener("click", () => {
  views.load("resources"); 
  renderAllResources("", resourcesSidebar);
});


// News event listeners
document.getElementById("positive").addEventListener("click", () => renderAllArticles("Positive", newsHolder));
document.getElementById("neutral").addEventListener("click", () => renderAllArticles("Neutral", newsHolder));
document.getElementById("negative").addEventListener("click", () => renderAllArticles("Negative", newsHolder));
document.getElementById("new-button").addEventListener("click", async () => {
  const doc = {
    _id: feedName.value,
    contents: []
  };
  const response = await db.saveDoc(doc);
  if (response === null){
    if (feedName.value === ""){
      document.getElementById("news-header").innerText = "Feed name blank!";
    }
    else {
      document.getElementById("news-header").innerText = "Already exists!";
    }
    newsHolder.innerHTML = "";
  }
  else {
    document.getElementById("news-header").innerText = "Created!";
    newsHolder.innerHTML = "";
  }
});
document.getElementById("load-button").addEventListener("click", async () => {
  const doc = await db.loadDoc(feedName.value);
  if (doc === null){
    if (feedName.value === ""){
      document.getElementById("news-header").innerText = "Feed name blank!";
    }
    else {
      document.getElementById("news-header").innerText = "Feed not found!";
    }
    newsHolder.innerHTML = "";
  }
  else {
    document.getElementById("news-header").innerText = feedName.value;
    renderAllArticles(feedName.value, newsHolder);
  }
});
document.getElementById("add-button").addEventListener("click", () => {
  let source = sourceName.value;
  // Only necessary for testing, will be replaced with back-end milestone
  if (!(source.startsWith("http://")) || !(source.startsWith("https://"))){
    source = "http://" + source;
  }
  const article = new news.Article("New Source", "Example Headline", "Will be replaced with API functionality in full release, click to go to source.", source)
  db.modifyDoc(feedName.value, article);
  if (feedName.value === ""){
    document.getElementById("news-header").innerText = "Feed name blank!";
  }
  else if (sourceName.value === ""){
    document.getElementById("news-header").innerText = "Source url blank!";
  }
  else {
    document.getElementById("news-header").innerText = "Added!";
  }
})
document.getElementById("delete-button").addEventListener("click", () => {
  db.removeDoc(feedName.value);
  if (feedName.value === ""){
    document.getElementById("news-header").innerText = "Feed name blank!";
  }
  else {
    document.getElementById("news-header").innerText = "Feed deleted!";
  }
  newsHolder.innerHTML = "";
});


// Forum event listeners
document.getElementById("comment-button").addEventListener("click", async () => {
  forumHeader.innerText = "Talk! (Be respectful)";
  let category = reply;
  reply = "default";
  const comment = new comments.Comment(commentInput.value, category, new Date());
  commentInput.value = "";
  // const doc = await db.loadDoc("testComments");
  // doc.contents.push(comment);
  await db.modifyDoc("testComments", comment);
  renderAllComments("testComments", commentHolder);
})


// Resources event listeners
document.getElementById("resource-button").addEventListener("click", async () => {
  let source = resourceName.value;
  if (!(source.startsWith("http://")) || !(source.startsWith("https://"))){
    source = "http://" + source;
  }
  const addedResource = new resources.Resource("Example of added resource", "Trans Clinics", source);
  resourceName.value = "";
  await db.modifyDoc("testResources", addedResource);
  renderAllResources("", resourcesHolder);
  resourcesHeader.innerText = "Thank you!";
})


// Initialize with the home view
views.load("home");


// Add map areas
renderMap(areas, document.getElementById("trans-map"));


// Selecting each map area
document.querySelectorAll("area").forEach((area) => {
  area.addEventListener("click", function () {
    loadStateInfo(area, mapSidebar);
  });
});