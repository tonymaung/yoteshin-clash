const fetchData = async() => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: '8c682b5d',
            i: 'tt0988824'

        }
    });
    console.log(response.data)
}
fetchData();