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

const fetchData = async(searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '8c682b5d',
            s: searchTerm
        },
        proxy: {
            protocol: 'https'
        }
    });
    console.log(response.data);
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;

}

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
const summary = document.querySelector("#summary");
const onMovieSelect = async(movie) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '8c682b5d',
            t: movie
        },
        proxy: {
            protocol: 'https'
        }
    });
    if (response.data.Error) {
        return [];
    }
    console.log(response.data);
    summary.innerHTML = renderMovie(response.data)
}

const renderMovie = (movie) => {
        return `
        <article class="media">
            <figure class="media-left is-centered">
                <p class="image">
                    <img src="${movie.Poster}"/>
                </p>
                <p class="subtitle">Year: ${movie.Year}</p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movie.Title}</h1>
                    <h6>Genre - ${movie.Genre}</h6>
                    <h6>Released - ${movie.Released}</h6>
                    <h6>Duration - ${movie.Runtime}</h6>
                    <p>
                        ${movie.Plot}
                    </p>
                </div>
            </div>
        </article>
        <article class="notification is-primary">
            <p class="title">${movie.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movie.BoxOffice === undefined ? "-" : movie.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movie.MetaScore=== undefined ? "-" : movie.MetaScore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movie.imdbRating=== undefined ? "-" : movie.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movie.imdbVotes=== undefined ? "?" : movie.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
        ${(movie.Ratings.length) ? `<article class="notification is-primary">
        <p class="title">${movie.Ratings[0].Value}</p>
        <p class="subtitle">Rating Source - ${movie.Ratings[0].Source}</p>
    </article>` : ""
        }
        ${(movie.Ratings.length>1) ? `<article class="notification is-primary">
        <p class="title">${movie.Ratings[1].Value}</p>
        <p class="subtitle">Rating Source - ${movie.Ratings[1].Source}</p>
    </article>` : ""
        }
    `
}