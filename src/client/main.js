import * as views from "./views.js";
import * as news from "./article.js";

// Test articles
const allArticles = new Map();
const newsPosTest = new news.Article("Slate", "Trans People Good", "Trans people deserve to live.", "https://en.wikipedia.org/wiki/Transgender");
allArticles.set(newsPosTest, "Positive");
const newsPosTest2 = new news.Article("Them", "Trans People Great!", "Trans people deserve to be happy!", "https://en.m.wiktionary.org/wiki/whee#English");
allArticles.set(newsPosTest2, "Positive");
const newsNeutTest = new news.Article("New York Times", "Trans People Good?", "Do trans people deserve to live?", "https://en.wikipedia.org/wiki/Leading_question");
allArticles.set(newsNeutTest, "Neutral");
const newsNegTest = new news.Article("Fox News", "Trans People Bad", "Trans people don't deserve to live.", "https://en.wikipedia.org/wiki/Hate_crime");
allArticles.set(newsNegTest, "Negative");

function renderAll(map, leaning, container){
  document.getElementById("news-header").innerText = leaning;
  container.innerHTML = "";
  map.forEach((value, article) =>{
    if (value === leaning){
      article.render(container);
    }
  }
  )
}

// Constants
const newsHolder = document.getElementById("news-holder");

// Event listeners
document.getElementById("home").addEventListener("click", () => views.load("home"));
document.getElementById("map").addEventListener("click", () => views.load("map"));
document.getElementById("news").addEventListener("click", () => views.load("news"));
document.getElementById("forum").addEventListener("click", () => views.load("forum"));
document.getElementById("resources").addEventListener("click", () => views.load("resources"));
document.getElementById("positive").addEventListener("click", () => renderAll(allArticles, "Positive", newsHolder));
document.getElementById("neutral").addEventListener("click", () => renderAll(allArticles, "Neutral", newsHolder));
document.getElementById("negative").addEventListener("click", () => renderAll(allArticles, "Negative", newsHolder));

// Initialize with the home view
views.load("home");



// Assuming your images are within a container with the class
// 'image-container'
document.querySelectorAll(".image-container img").forEach((img) => {
  img.addEventListener("click", function () {
    const parent = this.parentNode;
    parent.insertBefore(this, parent.firstChild); // Move the clicked image to the beginning
  });
});

function mapClicker(e) {
  if (e.target !== e.currentTarget){
    const id = e.target.Id;
    alert(id);
    console.log("correct")
  }
  e.stopPropagation();
}

// State event listener
document.getElementById("map").addEventListener("click", mapClicker, false);