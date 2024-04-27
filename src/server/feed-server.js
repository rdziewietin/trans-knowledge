const feedNameInput = document.getElementById("feed-name");
const sourceNameInput = document.getElementById("source-name");
const createBtn = document.getElementById("new-button");
const readBtn = document.getElementById("load-button");
const deleteBtn = document.getElementById("delete-button");
const addBtn = document.getElementById("add-button");
const removeBtn = document.getElementById("remove-button");
const feedResponse = document.getElementById("feed-header");

const URL = "http://localhost:3000"; // URL of our server

// TASK #4: Write event handler functions for each button
// Function to handle create counter action
async function createFeed() {
  if (feedNameInput.value === "") {
    alert("Feed name is required!");
    return;
  }
  const feed_name = feedNameInput.value;
  const response = await fetch(`${URL}/create?name=${feed_name}`, {
    method: "POST",
  });
  const data = await response.text();
  feedResponse.innerHTML = data;
}

// TASK #4: Write event handler functions for each button
// Function to handle read counter action
async function readFeed() {
  if (feedNameInput.value === "") {
    alert("Feed name is required!");
    return;
  }
  const feed_name = feedNameInput.value;
  const response = await fetch(`${URL}/read?name=${feed_name}`, {
    method: "GET",
  });
  const data = await response.text();
  feedResponse.innerHTML = data;
}

// TASK #4: Write event handler functions for each button
// Function to handle update counter action
async function updateFeed() {
  if (feedNameInput.value === "") {
    alert("Feed name is required!");
    return;
  }
  const feed_name = feedNameInput.value;
  const response = await fetch(`${URL}/update?name=${feed_name}`, {
    method: "PUT",
  });
  const data = await response.text();
  feedResponse.innerHTML = data;
}

// TASK #4: Write event handler functions for each button
// Function to handle delete counter action
async function deleteFeed() {
  if (feedNameInput.value === "") {
    alert("Feed name is required!");
    return;
  }
  const feed_name = feedNameInput.value;
  const response = await fetch(`${URL}/delete?name=${feed_name}`, {
    method: "DELETE",
  });
  const data = await response.text();
  feedResponse.innerHTML = data;
}

// TASK #5: Add event listeners
createBtn.addEventListener("click", () => {
  createFeed();
});
readBtn.addEventListener("click", () => {
  readFeed();
});
deleteBtn.addEventListener("click", () => {
  deleteFeed();
});
