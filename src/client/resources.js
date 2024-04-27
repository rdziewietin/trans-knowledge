export class Resource {

  /**
  * Represents a single resource/sidebar category.
  * @constructor
  * @param {string} info - A brief description of the resource. 
  * @param {string} category - The category each resource belongs to. Sidebar categories are "default", everything else is a sidebar category.
  * @param {string} link - Optional, links to an external resource. Unused when used as a sidebar category.
  */
  constructor(info, category, link = null) {
    this.info = info;
    this.category = category;
    if (link !== null) {
      this.link = link;
    }
  }


  /**
  * Rendering a single article in the HTML document.
  * @function
  * @param {HTMLElement} container - The parent element.
  * @returns {null|HTMLButtonElement} - button if it is a sidebar category, null if not.
  */
  render(container) {
    const div = document.createElement("div");

    // if link is null, then it's a sidebar category
    if (this.link == null) {
      div.classList.add("resource-sidebar");
      const button = document.createElement("button");

      button.innerText = this.info;

      div.appendChild(button);
      container.appendChild(div);

      // Returning button to add event handler in main 
      return button;
    }

    // otherwise it's a normal resource
    else {
      div.classList.add("user-content");
      const text = document.createElement("p");
      const linked = document.createElement("a");

      linked.href = this.link;
      linked.innerText = this.info;

      text.appendChild(linked);
      div.appendChild(text);
      container.appendChild(div);

      // Returning null for consistency
      return null;
    }
  }
}
