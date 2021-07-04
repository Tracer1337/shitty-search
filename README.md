<a href="https://tracer1337.github.io/shitty-search/" target="_blank">
    <p align="center">
        <img width="100" src="./docs/assets/pile-of-poo.png">
        <img width="100" src="./docs/assets/plus.png">
        <img width="100" src="./docs/assets/magnifying-glass.png">
    </p>
</a>

---

### [Demo](https://tracer1337.github.io/shitty-search/)

Shitty-Search is the worst search engine you have ever seen.

[<img src="./docs/assets/video-preview.png" alt="Video" width="500">](https://www.youtube.com/watch?v=C5kGCwJ25Yc)

# Quick Start

[<img src="./docs/assets/docker-logo.png" alt="Docker Hub" width="130"/>](https://hub.docker.com/r/tracer1337/shitty-search)

1. Create a new mysql database
2. Run the crawler
3. Run the pagerank algorithm
4. Start the server and upload the client to a free hosting platform
5. <img src="https://media1.tenor.com/images/15ae412a294bf128f6ba7e60aa0ea8e1/tenor.gif?itemid=4246425" alt="Party 🎉" width="200">

# Development

```
git clone https://github.com/Tracer1337/shitty-search.git
cd shitty-search
yarn
```

This project uses yarn, primarily for the monorepo design. Some packages from ``/packages`` depend on other packages stored there and yarn will link them through the ``node_modules`` folder. Keep in mind that in order to use the code from a package in another package, it has to be compiled and imported through the ``/dist`` folder. This also means that in development you will often use ``yarn build`` to use code changes in another package.

# Packages

### Client

The website which queries and displays search results from a given endpoint. The endpoint can be defined at build-time through the ``API_ENDPOINT`` environment variable.

### Crawler

Crawls the internet and stores the data it found in the database.

### Pagerank

Implementation of the pagerank algorithm as desribed on [Wikipedia](https://en.wikipedia.org/wiki/PageRank). The ``Runner`` class adapts the pagerank algorithm to the database, but this package can be used in any situation.

### Search

Finds and ranks the results of a given query, where the query is a sequence of keywords. This package contains the scoring mechanism.

### Server

The only thing this one really does is exposing a single API endpoint which runs the search package so the client can query it.

### Shared

Contains the functionality which all packages need, like the database stuff and some utilities.
