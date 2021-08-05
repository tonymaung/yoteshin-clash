const createAutocomplete = ({ root, label, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
    <label><b>${label}</b></label>
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
    const dropdown = root.querySelector(".dropdown")
    const resultsWrapper = root.querySelector(".results")
    const input = root.querySelector('input');
    const onInput = async event => {
        const items = await fetchData(event.target.value);
        if (!items.length) {
            dropdown.classList.remove("is-active");
            return;
        }
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');
        for (let item of items) {
            const option = document.createElement('a');

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener("click", (e) => {
                dropdown.classList.remove("is-active")
                console.log(item)
                input.value = inputValue(item)
                onOptionSelect(item)
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
}