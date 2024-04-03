let tabs = document.getElementsByClassName("tab");

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function() {
    let content = this.parentElement.nextElementSibling;
    if (content.style.display === "block"){
      this.innerHTML = "Expand";
      content.style.display = "none";
    }
    else {  
      this.innerHTML = "Collapse";
      content.style.display = "block";
    }
  });
}