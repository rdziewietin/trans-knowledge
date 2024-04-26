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
        
        
        // if link is null, then it's a sidebar category
        if (this.link == null){
            div.classList.add("resource-sidebar");
            const text = document.createElement("button");
            text.innerText = this.info;
            div.appendChild(text);
            container.appendChild(div);
            return text;
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
            return null;
        }
    }
}