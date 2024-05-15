// Imports
import * as views from "./views.js";
import * as news from "./article.js";
import * as resources from "./resources.js";
import * as comments from "./comments.js";
import * as db from "./db.js";
import { areas, stateNames, stateQuality } from "./map.js";

const transKnowledgeURL = "http://localhost:3000";
let resourceTypes = new Set();
let routeStates = [];

/**
  * Manages errors in fetch retrieval
  * @function
  * @param {Response} response - The response of a fetch() method.
  * @throws {Error} - Throws an error if the fetch was unsuccessful
  */
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
  fetch(`${transKnowledgeURL}/read?name=${feed}-feed`, { method: "GET" })
  .then(manageErrors)
  .then(function(response){
    return response.json();
  })
  .then(function(loadedFeed){
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
    document.getElementById("news-header").innerText = "Feed not found!";
    newsHolder.innerHTML = "";
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
  const response = await fetch(`${transKnowledgeURL}/read?name=${list}`, { method: "GET" });
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
  const response = await fetch(`${transKnowledgeURL}/read?name=testResources`, { method: "GET" });
  const loadedFeed = await response.json();
  container.innerHTML = "";
  resourcesSidebar.innerHTML = "";
  if (category !== "") {
    resourcesHeader.innerText = category;
  }
  for (let article in loadedFeed.contents) {
    const jsonResources = loadedFeed.contents[article];
    resourceTypes.add(jsonResources.category);
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
  // Immutable information
  container.innerHTML = "";
  const stateName = document.createElement("h2");
  stateName.innerText = stateNames[area.id];
  const stateDesc = document.createElement("p");
  stateDesc.innerText = stateQuality[area.id];

  // The button and its event listener
  const routeButton = document.createElement("button");
  routeButton.id = "add-route-button";
  routeButton.innerText = "Add state to route";
  routeButton.addEventListener("click", async () => {
    const routeName = document.getElementById("route-name").value;
    // Needs a route name before it creates the route
    if (routeName === ""){
      document.getElementById("map-header").innerText = "Please enter a route name.";
      return;
    }
    document.getElementById("map-header").innerText = "Click on a state to learn more.";

    routeStates.push(stateName.innerText);

    // Using local data but creates space for server data, less load
    if (await db.loadDoc(routeName) === null){
      const doc = {
        _id: routeName,
        contents: []
      }
      await db.saveDoc(doc);
      fetch(`${transKnowledgeURL}/create`, { 
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)
      })
      .then(manageErrors)
      .catch(function(){
        document.getElementById("map-header").innerText = "Network Error";
      });
    }

    await db.modifyDoc(routeName, stateName.innerText);

    const newState = document.createElement("p");
    newState.innerText = stateName.innerText;
    document.getElementById("route").appendChild(newState);
  })

  container.appendChild(stateName);
  container.appendChild(stateDesc);
  container.appendChild(routeButton);
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
const resourceType = document.getElementById("resource-type");

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
  if (feedName.value === "testComments" || feedName.value === "testResources") {
    document.getElementById("news-header").innerText = "Reserved name";
    newsHolder.innerHTML = "";
    return;
  }
  const doc = {
    _id: feedName.value + "-feed",
    contents: [],
  };
  fetch(`${transKnowledgeURL}/create`, { 
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
  if (feed === "") {
    document.getElementById("news-header").innerText = "Feed name blank!";
    newsHolder.innerHTML = "";
    return;
  } 
  if (feedName.value === "testComments" || feedName.value === "testResources") {
    document.getElementById("news-header").innerText = "Not a usable feed";
    newsHolder.innerHTML = "";
    return;
  }
  fetch(`${transKnowledgeURL}/read?name=${feed}-feed`, { method: "GET" })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = feedName.value;
    renderAllArticles(feedName.value, newsHolder);
  }).catch(function(){
    document.getElementById("news-header").innerText = "Feed not found!";
    newsHolder.innerHTML = "";
  });
});

document.getElementById("add-button").addEventListener("click", () => {
  // Checking for text input errors
  const feed = feedName.value;
  newsHolder.innerHTML = "";
  if (feed === "") {
    document.getElementById("news-header").innerText = "Feed name blank!";
  } else if (sourceName.value === "") {
    document.getElementById("news-header").innerText = "Source url blank!";
  }
  if (feedName.value === "testComments" || feedName.value === "testResources") {
    document.getElementById("news-header").innerText = "Cannot add to database";
    newsHolder.innerHTML = "";
    return;
  }
  if (feedName.value === "Positive" || feedName.value === "Neutral" || feedName.value === "Negative") {
    document.getElementById("news-header").innerText = "Standard feeds, cannot modify";
    newsHolder.innerHTML = "";
    return;
  }
  let source = sourceName.value;
  

  if (!source.startsWith("http://") || !source.startsWith("https://")) {
    source = "http://" + source;
  }

  if (!source.includes(".")) {
    document.getElementById("news-header").innerText = "Cannot detect URL top-level domain";
    newsHolder.innerHTML = "";
    return;
  }

  const currURL = new URL(source);

  // Creating the article doc
  const article = new news.Article(
    currURL.hostname,
    "Example Headline",
    "Will be replaced with API functionality in full release, click to go to source.",
    currURL.href,
  );
  fetch(`${transKnowledgeURL}/update?name=${feed}-feed`, { 
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = "Added!";
  }).catch(function(){
    document.getElementById("news-header").innerText = "Addition failed!";
  });
});

// Deleting a feed
document.getElementById("delete-button").addEventListener("click", () => {
  // Checking for text input errors
  if (feedName.value === "") {
    document.getElementById("news-header").innerText = "Feed name blank!";
    newsHolder.innerHTML = "";
    return;
  }
  if (feedName.value === "testComments" || feedName.value === "testResources") {
    document.getElementById("news-header").innerText = "Reserved name";
    newsHolder.innerHTML = "";
    return;
  }
  if (feedName.value === "Positive" || feedName.value === "Neutral" || feedName.value === "Negative") {
    document.getElementById("news-header").innerText = "Standard feeds, cannot modify";
    newsHolder.innerHTML = "";
    return;
  }
  const feed = feedName.value;
  fetch(`${transKnowledgeURL}/delete?name=${feed}-feed`, { method: "DELETE" })
  .then(manageErrors)
  .then(function(){
    document.getElementById("news-header").innerText = feedName.value + " Deleted";
    newsHolder.innerHTML = "";
  }).catch(function(){
    document.getElementById("news-header").innerText = "Feed not found!";
    newsHolder.innerHTML = "";
  });
});


// Forum event listener
document
  .getElementById("comment-button")
  .addEventListener("click", () => {
    if (commentInput.value === ""){
      forumHeader.innerText = "Comment cannot be blank!";
      return;
    }
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
    fetch(`${transKnowledgeURL}/update?name=testComments`, { 
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comment)
    })
    .then(manageErrors)
    .then(function(){
      // Rerender
      renderAllComments("testComments", commentHolder);
    }).catch(function(){
      // Checking for text input errors
      forumHeader.innerText = "Comment failed"
    });
  });


// Resources event listener
document
  .getElementById("resource-button")
  .addEventListener("click", async () => {
    // Source Checker
    let source = resourceName.value;
    if (source === ""){
      resourcesHeader.innerText = "Input cannot be blank!";
      return;
    }

    if (!source.startsWith("http://") && !source.startsWith("https://")) {
      source = "http://" + source;
    }

    if (!resourceTypes.has(resourceType.value)){
      resourcesHeader.innerText = "Invalid category";
      return;
    }

    const currURL = new URL(source);

    // Creating the resource to be added.
    const addedResource = new resources.Resource(
      currURL.hostname,
      "Trans Clinics",
      currURL.href,
    );
    resourceName.value = "";
    fetch(`${transKnowledgeURL}/update?name=testResources`, { 
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addedResource)
    })
    .then(manageErrors)
    .then(function(){
      resourcesHeader.innerText = "Thank you!";
      renderAllResources("", resourcesHolder);
    }).catch(function(){
      // Checking for text input errors
      forumHeader.innerText = "Submission failed"
    });
  });


// Map route event listener, which it saves 
document.getElementById("check-button").addEventListener("click", async () => {
  const routeName = document.getElementById("route-name").value;
  if (routeName === ""){
    document.getElementById("map-header").innerText = "Please enter a route name.";
    return;
  }
  fetch(`${transKnowledgeURL}/update?name=${routeName}`, { 
    method: "PUT",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(routeStates)
  })
  .then(manageErrors)
  .then(function(){
    document.getElementById("route-warnings").innerHTML = "";
    for (let state in routeStates){
      const stateInitial = Object.keys(stateNames).find(key => stateNames[key] === routeStates[state]);
      const quality = stateQuality[stateInitial];
      if (quality === "Bad" || quality == "Terrible"){
        const warning = document.createElement("p");
        warning.innerHTML = `${routeStates[state]} has a trans safety rating of <strong>${quality}</strong>.`
        document.getElementById("route-warnings").appendChild(warning);
      }
    }
  })
  .catch(function(){
    document.getElementById("map-header").innerText = "Network Error";
  });
})

// Event listener for loading the route
document.getElementById("route-button").addEventListener("click", () => {
  const routeName = document.getElementById("route-name").value;
  if (routeName === ""){
    document.getElementById("map-header").innerText = "Please enter a route name.";
    return;
  }
  fetch(`${transKnowledgeURL}/read?name=${routeName}`, { method: "GET" })
  .then(manageErrors)
  .then(function(response){
    console.log(response)
    return response.json();
  })
  .then(function(result){
    console.log(result)
    if (result.contents !== null){
      routeStates = result.contents.at(-1);
    }
    document.getElementById("route").innerHTML = "";
    for (let state in routeStates){
      const newState = document.createElement("p");
      newState.innerText = routeStates[state];
      document.getElementById("route").appendChild(newState);
    }
  })
  .catch(function(){
    // Checking for text input errors
    document.getElementById("map-header").innerText = "Feed not found!";
  });
  
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
