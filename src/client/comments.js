// let globalID = 0;

export class Comment {
    
    constructor(info, category, date, givenID=null) {
        this.info = info;
        this.category = category;
        this.date = date;
        if (givenID === null){
            this.id = date;
        }
        else {
            this.id = givenID;
        }
    }

    render(container){
        const div = document.createElement("div");
        div.classList.add("user-content");
        div.id = "comment-" + this.id;
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