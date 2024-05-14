// Imports
import * as views from "./views.js";
import * as news from "./article.js";
import * as resources from "./resources.js";
import * as comments from "./comments.js";
import * as db from "./db.js";
import { areas, stateNames, stateQuality } from "./map.js";

const URL = "http://localhost:3000";

// // Test articles
// const posArticles = [];
// const neutArticles = [];
// const negArticles = [];

// const newsPosTest = new news.Article(
//   "Slate",
//   "Trans People Good",
//   "Trans people deserve to live.",
//   "https://slate.com",
// );
// posArticles.push(newsPosTest);
// const newsPosTest2 = new news.Article(
//   "Them",
//   "Trans People Great!",
//   "Trans people deserve to be happy!",
//   "https://them.us",
// );
// posArticles.push(newsPosTest2);

// // Saving articles to database
// if ((await db.loadDoc("Positive")) === null) {
//   const doc = {
//     _id: "Positive",
//     contents: posArticles,
//   };
//   db.saveDoc(doc);
// }

// const newsNeutTest = new news.Article(
//   "New York Times",
//   "Trans People Good?",
//   "Do trans people deserve to live?",
//   "https://nytimes.com",
// );
// neutArticles.push(newsNeutTest);

// // Saving articles to database
// if ((await db.loadDoc("Neutral")) === null) {
//   const doc = {
//     _id: "Neutral",
//     contents: neutArticles,
//   };
//   db.saveDoc(doc);
// }

// const newsNegTest = new news.Article(
//   "Fox News",
//   "Trans People Bad",
//   "Trans people don't deserve to live.",
//   "https://foxnews.com",
// );
// negArticles.push(newsNegTest);

// // Saving articles to database
// if ((await db.loadDoc("Negative")) === null) {
//   const doc = {
//     _id: "Negative",
//     contents: negArticles,
//   };
//   db.saveDoc(doc);
// }

// // Test comments
// const allComments = [];

// const commentTest = new comments.Comment(
//   "Hi!",
//   "default",
//   new Date("April 21, 24 20:01:04 GMT+00:00"),
// );
// allComments.push(commentTest);

// const replyTest = new comments.Comment(
//   "Hi :)",
//   commentTest.id,
//   new Date("April 22, 24 13:51:42 GMT+00:00"),
// );
// allComments.push(replyTest);

// // Saving comments to database
// if ((await db.loadDoc("testComments")) === null) {
//   const doc = {
//     _id: "testComments",
//     contents: allComments,
//   };
//   db.saveDoc(doc);
// }

// // Test resources
// const allResources = [];

// const resourceCategoryTest = new resources.Resource("Trans Clinics", "default");
// allResources.push(resourceCategoryTest);

// const resourceLinkTest = new resources.Resource(
//   "Transhealth",
//   "Trans Clinics",
//   "https://transhealth.com",
// );
// allResources.push(resourceLinkTest);

// // Saving resources to database
// if ((await db.loadDoc("testResources")) === null) {
//   const doc = {
//     _id: "testResources",
//     contents: allResources,
//   };
//   db.saveDoc(doc);
// }

// Error management
function manageErrors(response){
  if (!response.ok){
    throw Error(response.statusText);
  }
  return response;
}


// Functions for rendering data onto the webpage
/**
  * Renders all the articles in the PouchDB database
  * @function
  * @param {string} feed - The database the articles are stored in.
  * @param {HTMLElement} container - The parent HTML element of the articles.
  */
async function renderAllArticles(feed, container) {
  container.innerHTML = "";
  fetch(`${URL}/read?name=${feed}`, { method: "GET" })
  .then(function(response){
    console.log(response);
    response.json();
    console.log(response);
  })
  .then(function(loadedFeed){
    console.log(loadedFeed);
    document.getElementById("news-header").innerText = feed;
    for (let article in loadedFeed.contents) {
      const jsonArticle = loadedFeed.contents[article];
      const currArticle = new news.Article(
        jsonArticle.source,
        jsonArticle.headline,
        jsonArticle.summary,
        jsonArticle.link,
      );
    currArticle.render(container);
  }
  })
  .catch(function(){
    
  });
}

/**
  * Renders all the comments in the PouchDB database.
  * @function
  * @param {string} list - The database the articles are stored in.
  * @param {HTMLElement} container - The parent HTML element of the comments.
  */
async function renderAllComments(list, container) {
  let map = new Map();
  const response = await fetch(`${URL}/read?name=${list}`, { method: "GET" });
  const loadedFeed = await response.json();
  container.innerHTML = "";
  for (let comment in loadedFeed.contents) {
    const jsonComment = loadedFeed.contents[comment];
    const currComment = new comments.Comment(
      jsonComment.info,
      jsonComment.category,
      jsonComment.date,
      jsonComment.id,
    );
    let div = null;
    if (map.has(jsonComment.category)) {
      div = currComment.render(map.get(jsonComment.category));
    } else {
      div = currComment.render(container);
    }
    const buttons = div.getElementsByTagName("button");
    for (let button in buttons) {
      buttons[0].addEventListener("click", () => {
        reply = currComment.id;
        forumHeader.innerText = "Replying...";
      });
    }
    map.set(jsonComment.id, div);
  }
}

/**
  * Renders all the resources in the PouchDB database
  * @function
  * @param {string} category - The name of the category of the desired resources.
  * @param {HTMLElement} container - The parent HTML element of the resources.
  */
async function renderAllResources(category, container) {
  // TODO: Check
  const response = await fetch(`${URL}/read?name=${category}`, { method: "GET" });
  const loadedFeed = await response.json();
  container.innerHTML = "";
  resourcesSidebar.innerHTML = "";
  if (category !== "") {
    resourcesHeader.innerText = category;
  }
  for (let article in loadedFeed.contents) {
    const jsonResources = loadedFeed.contents[article];
    if (
      jsonResources.category === category ||
      jsonResources.category === "default"
    ) {
      let newContainer = container;
      if (jsonResources.category === "default") {
        newContainer = resourcesSidebar;
      }
      const currResources = new resources.Resource(
        jsonResources.info,
        jsonResources.category,
        jsonResources.link,
      );
      const button = currResources.render(newContainer);
      if (jsonResources.category === "default") {
        button.addEventListener("click", () =>
          renderAllResources(button.innerText, resourcesHolder),
        );
      }
    }
  }
}

/**
  * Renders all the areas onto the US Map.
  * @function
  * @param {Map} map - A list containing the id and coordinates of the areas.
  * @param {HTMLElement} container - The parent HTML element of the areas (i.e. the map).
  */
function renderMap(map, container) {
  container.innerHTML = "";
  map.forEach((coords, state) => {
    const area = document.createElement("area");
    area.id = state;
    area.shape = "poly";
    area.coords = coords;
    container.appendChild(area);
  });
}

/**
  * Renders a US state's information into the sidebar when clicked.
  * @function
  * @param {HTMLAreaElement} area - The area element being selected.
  * @param {HTMLElement} container - The parent HTML element of the state info.
  */
function loadStateInfo(area, container) {
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

// Changes if the user is replying, default if not
let reply = "default";

// View event listeners, used to change to the different pages
document
  .getElementById("home")
  .addEventListener("click", () => views.load("home"));

document
  .getElementById("map")
  .addEventListener("click", () => views.load("map"));

document
  .getElementById("news")
  .addEventListener("click", () => views.load("news"));

document.getElementById("forum").addEventListener("click", () => {
  views.load("forum");
  renderAllComments("testComments", commentHolder);
});

document.getElementById("resources").addEventListener("click", () => {
  views.load("resources");
  renderAllResources("", resourcesSidebar);
});

// News event listeners
// These three get the pregen feeds
document
  .getElementById("positive")
  .addEventListener("click", () => renderAllArticles("Positive", newsHolder));

document
  .getElementById("neutral")
  .addEventListener("click", () => renderAllArticles("Neutral", newsHolder));

document
  .getElementById("negative")
  .addEventListener("click", () => renderAllArticles("Negative", newsHolder));

// Creates a feed
// Next four follow the same pattern of check/change database, update HTML elements 
document.getElementById("new-button").addEventListener("click", async () => {
  if (feedName.value === "") {
    document.getElementById("news-header").innerText = "Feed name blank!";
    newsHolder.innerHTML = "";
    return;
  }
  const doc = {
    _id: feedName.value,
    contents: [],
  };
  fetch(`${URL}/create`, { 
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(doc)
  })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = "Created!";
    newsHolder.innerHTML = "";
  })
  .catch(function(){
    document.getElementById("news-header").innerText = "Already exists!";
    newsHolder.innerHTML = "";
  });
});

document.getElementById("load-button").addEventListener("click", async () => {
  const feed = feedName.value;
  fetch(`${URL}/read?name=${feed}`, { method: "GET" })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = feedName.value;
    renderAllArticles(feedName.value, newsHolder);
  }).catch(function(){
    // Checking for text input errors
    if (feedName.value === "") {
      document.getElementById("news-header").innerText = "Feed name blank!";
    } else {
      document.getElementById("news-header").innerText = "Feed not found!";
    }
    newsHolder.innerHTML = "";
  });
});

document.getElementById("add-button").addEventListener("click", () => {
  let source = sourceName.value;
  // Only necessary for testing, will be replaced with back-end milestone
  if (!source.startsWith("http://") || !source.startsWith("https://")) {
    source = "http://" + source;
  }
  // Creating the article doc
  const article = new news.Article(
    "New Source",
    "Example Headline",
    "Will be replaced with API functionality in full release, click to go to source.",
    source,
  );
  db.modifyDoc(feedName.value, article);
  // Checking for text input errors
  if (feedName.value === "") {
    document.getElementById("news-header").innerText = "Feed name blank!";
  } else if (sourceName.value === "") {
    document.getElementById("news-header").innerText = "Source url blank!";
  } else {
    document.getElementById("news-header").innerText = "Added!";
  }
});

// Deleting a feed
document.getElementById("delete-button").addEventListener("click", () => {
  const feed = feedName.value;
  fetch(`${URL}/delete?name=${feed}`, { method: "DELETE" })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = feedName.value;
  }).catch(function(){
    // Checking for text input errors
    if (feedName.value === "") {
      document.getElementById("news-header").innerText = "Feed name blank!";
    } else {
      document.getElementById("news-header").innerText = "Feed not found!";
    }
    newsHolder.innerHTML = "";
  });
});


// Forum event listener
document
  .getElementById("comment-button")
  .addEventListener("click", async () => {
    forumHeader.innerText = "Talk! (Be respectful)";
    // Checks if it is a reply, resets in case it is 
    let category = reply;
    reply = "default";
    // Creating the comment doc 
    const comment = new comments.Comment(
      commentInput.value,
      category,
      new Date(),
    );
    commentInput.value = "";
    await db.modifyDoc("testComments", comment);
    // Rerender
    renderAllComments("testComments", commentHolder);
  });


// Resources event listener
document
  .getElementById("resource-button")
  .addEventListener("click", async () => {
    let source = resourceName.value;
    // Only necessary for testing, will be replaced with back-end milestone
    if (!source.startsWith("http://") || !source.startsWith("https://")) {
      source = "http://" + source;
    }
    // Creating the resource to be added.
    const addedResource = new resources.Resource(
      "Example of added resource",
      "Trans Clinics",
      source,
    );
    resourceName.value = "";
    await db.modifyDoc("testResources", addedResource);
    renderAllResources("", resourcesHolder);
    // Rerender
    resourcesHeader.innerText = "Thank you!";
  });


// Initialize with the home view
views.load("home");


// Add map areas to the map image
renderMap(areas, document.getElementById("us-map"));


// Selecting and adding event listeners to each map area
document.querySelectorAll("area").forEach((area) => {
  area.addEventListener("click", function () {
    loadStateInfo(area, mapSidebar);
  });
});
