export class Comment {

  /**
  * Represents a comment in the forum. Includes replies.
  * @constructor
  * @param {string} info - The comment itself. 
  * @param {string|Date} category - What the comment is replying to. Top-level comments are "default", everything else is an ID.
  * @param {Date} date - The time the comment was made. Used for both user benefit and as an ID.
  * @param {Date} givenID - The ID itself. Either uses date the comment was made or passed in because PouchDB does not store objects as objects and used to recreate the comment.
  */
  constructor(info, category, date, givenID = null) {
    this.info = info;
    this.category = category;
    this.date = date;
    if (givenID === null) {
      this.id = date;
    } else {
      this.id = givenID;
    }
  }

  /**
  * Rendering a single article in the HTML document.
  * @function
  * @param {HTMLElement} container - The parent element.
  * @returns {HTMLElement} - returns the div to get the button.
  */
  render(container) {
    const div = document.createElement("div");
    div.classList.add("user-content");
    div.id = "comment-" + this.id;
    // Creating an internal div to hold the date and reply elements
    const innerDiv = document.createElement("div");
    innerDiv.classList.add("comment-options");

    const text = document.createElement("p");
    const date = document.createElement("p");
    const reply = document.createElement("button");

    text.innerText = this.info;
    date.innerText = this.date.toLocaleString();
    reply.classList.add("reply-button");
    reply.innerText = "Reply";

    div.appendChild(text);
    text.appendChild(innerDiv);
    innerDiv.appendChild(date);
    innerDiv.appendChild(reply);

    container.appendChild(div);
    return div;
  }
}
