export class Article {

  /**
  * Represents a single article.
  * @constructor
  * @param {string} source - The source of the article (e.g. New York Times, Fox News, etc).
  * @param {string} headline - The article's headline.
  * @param {string} summary - A brief summary of the article.
  * @param {string} link - the URL pointing to the article.
  */
  constructor(source, headline, summary, link) {
    this.source = source;
    this.headline = headline;
    this.summary = summary;
    this.link = link;
  }

  /**
  * Rendering a single article in the HTML document.
  * @function
  * @param {HTMLElement} container - The parent element.
  */
  render(container) {
    const div = document.createElement("div");
    div.classList.add("news-article");
    
    // Uses h3 and anchor for ease of CSS formatting and consistency.
    const headline = document.createElement("h3");
    const headline2 = document.createElement("a");
    headline2.href = this.link;
    headline2.innerText = this.headline;
    headline.appendChild(headline2);
    div.appendChild(headline);

    // Everything else is p
    const source = document.createElement("p");
    source.innerText = "(" + this.source + ")";
    div.appendChild(source);

    const summary = document.createElement("p");
    summary.innerText = this.summary;
    div.appendChild(summary);

    container.appendChild(div);
  }
}
