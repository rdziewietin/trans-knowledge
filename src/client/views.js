/**
* Loads a single page in the HTML using CSS display.
* @function
* @param {string} viewId - Which page and/or sidebar will be seen (home, map, news, forum, resources).
*/
export function load(viewId) {
  // Hide all views
  document.querySelectorAll(".view").forEach((view) => {
    view.style.display = "none";
  });

  // Hide all sidebars
  document.querySelectorAll(".sidebar").forEach((sidebar) => {
    sidebar.style.display = "none";
  });

  // Show the requested view
  if (document.getElementById(viewId + "-sidebar2") !== null) {
    document.getElementById(viewId + "-sidebar2").style.display = "grid";
  }
  document.getElementById(viewId + "-view").style.display = "block";
  if (document.getElementById(viewId + "-sidebar") !== null) {
    document.getElementById(viewId + "-sidebar").style.display = "grid";
  }
}
