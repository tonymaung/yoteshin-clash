const autocompleteConfig = {
    label: "Search for a Movie or TV series with OMdb Api",
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${imgSrc}" />
        ${movie.Title}(${movie.Year})
      `
    },

    inputValue: (movie) => {
        return movie.Title + ` (${movie.Year})`
    },
    fetchData: async(searchTerm) => {
        const response = await axios.get("https://www.omdbapi.com/", {
            params: {
                apikey: '8c682b5d',
                s: searchTerm
            }
            //,proxy: {protocol: 'https'}
        });
        console.log(response.data);
        if (response.data.Error) {
            return [];
        }

        return response.data.Search;
    }
};
createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector(".left-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), 'left');
    }

});
createAutocomplete({
    ...autocompleteConfig,
    root: document.querySelector(".right-autocomplete"),
    onOptionSelect: (movie) => {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), 'right');
    }

});
let rightMovie;
let leftMovie;
const onMovieSelect = async(movie, selector, side) => {
        const response = await axios.get("https://www.omdbapi.com/", {
            params: {
                apikey: '8c682b5d',
                t: movie.Title
            }
            //,proxy: {protocol: 'https'}
        });
        if (response.data.Error) {
            return [];
        }
        console.log(response.data);
        selector.innerHTML = renderMovie(response.data)
        if (side === "left") {
            leftMovie = response.data
        } else {
            rightMovie = response.data
        }
        if (leftMovie && rightMovie) {
            runComparison()
        }

    }
    //helper function to compare
const runComparison = () => {
    console.log("Start Comparing")
    const lefthand = document.querySelector('#left-summary').querySelectorAll('.notification');
    const righthand = document.querySelector('#right-summary').querySelectorAll('.notification');
    lefthand.forEach((leftStat, index) => {
        let lefthandStat = isNaN(leftStat.dataset.value) ? 0 : parseFloat(leftStat.dataset.value);
        let righthandStat = isNaN(righthand[index].dataset.value) ? 0 : parseFloat(righthand[index].dataset.value); //parseInt(righthand[index].dataset.value);
        if (righthandStat > lefthandStat) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.remove("is-link");
            leftStat.classList.remove("is-success");
            leftStat.classList.add("is-danger");
            righthand[index].classList.remove("is-primary");
            righthand[index].classList.remove("is-danger");
            righthand[index].classList.remove("is-link");
            righthand[index].classList.add("is-success");
        } else if (righthandStat == lefthandStat) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.remove("is-danger");
            leftStat.classList.remove("is-success");
            leftStat.classList.add("is-link");
            righthand[index].classList.remove("is-primary");
            righthand[index].classList.remove("is-danger");
            righthand[index].classList.remove("is-success");
            righthand[index].classList.add("is-link");
        } else {
            righthand[index].classList.remove("is-primary");
            righthand[index].classList.remove("is-link");
            righthand[index].classList.remove("is-success");
            righthand[index].classList.add("is-danger");
            leftStat.classList.remove("is-primary");
            leftStat.classList.remove("is-link");
            leftStat.classList.remove("is-danger");
            leftStat.classList.add("is-success");
        }
    })
}
const renderMovie = (movie) => {
        let awards, dollars, metascore, imdbRating, imdbVotes, ratings1, ratings2;
        if (movie.Awards) {
            awards = movie.Awards.split(" ").reduce((prev, word) => {
                const value = parseInt(word)
                if (isNaN(value)) {
                    return prev;
                } else {
                    return prev + value;
                }
            }, 0);
        }
        if (movie.BoxOffice) {
            dollars = parseInt(movie.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
        } else {
            dollars = "-"
        }
        if (movie.MetaScore) {
            metascore = parseInt(movie.MetaScore);
        } else {
            metascore = "-"
        }
        if (movie.imdbRating) {
            imdbRating = parseFloat(movie.imdbRating);
        } else {
            imdbRating = "-"
        }
        if (movie.imdbVotes) {
            imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ''));
        } else {
            imdbVotes = "-"
        }
        if (movie.Ratings.length == 0) {
            ratings1 = "-";
            ratings2 = "-";
        } else if (movie.Ratings.length > 1) {
            ratings1 = parseFloat(movie.Ratings[0].Value.substring(0, 3));
            ratings2 = parseInt(movie.Ratings[1].Value.replace(/%/g, ''));
        } else if (movie.Ratings.length > 0) {
            ratings1 = parseFloat(movie.Ratings[0].Value);
            ratings2 = "-"
        };

        console.log(awards, imdbVotes, ratings1)
        return `
        <div class="card">
        <article class="media">
        <figure class="media-left is-centered">
            <p class="image">
                <img src="${movie.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h2>${movie.Title}</h2>
                <h6>Genre - ${movie.Genre}</h6>
                <h6>Released - ${movie.Released}, Duration - ${movie.Runtime}</h6>
                <p>
                    ${movie.Plot}
                </p>
            </div>
        </div>
    </article>
        </div>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movie.Awards === undefined ? "-" : movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movie.BoxOffice === undefined ? "-" : movie.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore}  class="notification is-primary">
            <p class="title">${movie.MetaScore=== undefined ? "-" : movie.MetaScore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movie.imdbRating=== undefined ? "-" : movie.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movie.imdbVotes=== undefined ? "?" : movie.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
        ${(movie.Ratings.length) ? `<article data-value=${ratings1} class="notification is-primary">
        <p class="title">${movie.Ratings[0].Value}</p>
        <p class="subtitle">Rating Source - ${movie.Ratings[0].Source}</p>
    </article>` : ""
        }
        ${(movie.Ratings.length>1) ? `<article data-value=${ratings2} class="notification is-primary">
        <p class="title">${movie.Ratings[1].Value}</p>
        <p class="subtitle">Rating Source - ${movie.Ratings[1].Source}</p>
    </article>` : ""
        }
    `
}

/* Sphagetti Code
const root = document.querySelector(".autocomplete");
root.innerHTML = `
    <label><b>Search for a Movie or TV series with OMdb Api</b></label>
    <div class="control has-icons-left">
        <span class="icon is-left is-primary">
            <i class="uil uil-search"></i>
        </span>
        <input type="text" class="input is-primary" />
    </div> 
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    <div id="target">
    </div>
`;
const dropdown = document.querySelector(".dropdown")
const resultsWrapper = document.querySelector(".results")



const input = document.querySelector('input');

const onInput = async event => {
    const movies = await fetchData(event.target.value);
    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

        option.classList.add('dropdown-item');
        option.innerHTML = `
      <img src="${imgSrc}" />
      ${movie.Title}
    `;
        option.addEventListener("click", (e) => {
            dropdown.classList.remove("is-active")
            console.log(e.target.innerText)
            input.value = e.target.innerText.trim()
            onMovieSelect(input.value)
        })
        resultsWrapper.appendChild(option);
    }
};
input.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

*/