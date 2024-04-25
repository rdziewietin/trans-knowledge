export class Resource {
    
    constructor(info, category, link=null) {
        this.info = info;
        this.category = category;
        if (link !== null){
            this.link = link;
        }
    }

    render(container){
        const div = document.createElement("div");
        div.classList.add("user-content");
        
        const text = document.createElement("p");
        if (this.link != null){
            const linked = document.createElement("a");
            linked.href = this.link;
            linked.innerText = this.info;
            text.appendChild(linked);
        }
        else {
            text.innerText = this.info;
        }
        div.appendChild(text);

        container.appendChild(div);
    }
}