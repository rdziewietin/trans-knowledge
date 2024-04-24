
export class Article {

    constructor(source, headline, summary, link) {
        this.source = source;
        this.headline = headline;
        this.summary = summary;
        this.link = link;
    };

    render(container){
        const div = document.createElement("div");
        div.classList.add("news-article");
        
        const headline = document.createElement("h3");
        const headline2 = document.createElement("a");
        headline2.href = this.link;
        headline2.innerText = this.headline;
        headline.appendChild(headline2);
        div.appendChild(headline);

        const source = document.createElement("p");
        source.innerText = "(" + this.source + ")";
        div.appendChild(source);

        const summary = document.createElement("p");
        summary.innerText = this.summary;
        div.appendChild(summary);

        container.appendChild(div);
    }
};

