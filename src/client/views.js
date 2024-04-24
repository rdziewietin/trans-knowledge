
    export function load(viewId) {
      // Hide all views
      document.querySelectorAll(".view").forEach((view) => {
        view.style.display = "none";
      });
  
      document.querySelectorAll(".sidebar").forEach((sidebar) => {
        sidebar.style.display = "none";
      });
  
      // Show the requested view
      document.getElementById(viewId + "-view").style.display = "block";
      if (document.getElementById(viewId + "-sidebar") !== null){
        document.getElementById(viewId + "-sidebar").style.display = "grid";
      }
      // if (viewId === "map-view"){
      //   document.getElementById("views").style.maxWidth = "100%";
      // }
      // else {
      //   document.getElementById("views").style.maxWidth = "100%";
      // }
      
    //   animateIn(viewId);
    // }
  
    // function animateIn(viewID) {
    //   document.querySelectorAll(".view").forEach((view) => {
    //     view.style.visibility = "hidden";
    //     view.style.opacity = 0;
    //   });
  
    //   document.getElementById(viewId).style.visibility = "visible";
    //   document.getElementById(viewId).style.opacity = 1;
  
    };