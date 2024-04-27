<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#layout">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This project consists of five different views. Home is where the application opens up, providing an overview of the project as a whole. Map provides an interactive  US map, showing the legal landscape of trans laws in a given state. News has filtered news sources as well as a custom feed generator. Forum provides an anonymous community forum for users to discuss trans issues. Resources is a repository of external resources useful for trans people to know. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Setting up this project is altogether fairly simple.

### Prerequisites

The only prerequisite is NPM.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/rdziewietin/trans-knowledge
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run milestone command
   ```sh
   npm run milestone-02
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LAYOUT -->
## Layout

Internally, the src folder contains all the work done on this project, with the client folder being milestone-02. The media folder contains the (so far) only image file used in the project, a US map. Each of the other files make up the code. index.html is the sole HTML file, styles.css is the custom CSS, and main.js is the primary JavaScript file run to provide interactivity. Most of the other .js files are classes, with the exception of map.js, which contains maps and lists used to provide <area> information for the US map.

The docs folder contains milestone-01 information and server contains the beginnings of work for milestone-03. They do not provide any functionality to TransKnowledge at this time.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License.

<p align="right">(<a href="#readme-top">back to top</a>)</p>