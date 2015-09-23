# Overview

---

The scripts are in js/function.js. I chose to rewrite a pagination from scratch instead of using a library. The script uses an open source library to convert JSON into DOM.

## Split

The term "split" is about pagination splitting, when the limit - defined by PAGES_BY_SPLIT - is excedeed due to the number of pages needed, the script will split the pagination in some parts :

```
Let PAGES_BY_SPLIT = 5, nbMoviesPage = 2 and nbMovies = 16, the application will have 2 pagination parts :
1 - 2 - 3 - 4 - 5 and 6 - 7 - 8
```
