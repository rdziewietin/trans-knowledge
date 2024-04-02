let tabs = document.getElementsByClassName("tab");

for (let i = 0; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    console.log(content.innerHTML);
    // if (content.style.maxHeight) {
    //   content.style.maxHeight = null;
    //   content.style.padding = null;
    // } else {
    //   content.style.maxHeight = content.scrollHeight + "px";
    //   content.style.padding = 8 + "px";
    // }
  });
}