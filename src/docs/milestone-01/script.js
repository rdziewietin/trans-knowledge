let tabs = document.getElementsByClassName("tab");

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.parentElement.nextElementSibling;
    console.log(content.innerHTML);
    if (content.style.display === "none"){
      content.style.display = "block";
    }
    else {
      content.style.display = "none";      
    }
  });
}