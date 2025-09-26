import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CiSearch } from "react-icons/ci";

function SearchBar({onSearch, doSearch, text}) {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onSearch(event.target.value);
    };

    const makeSearch = () => {
        doSearch(inputValue)
    };

    return (
        <div style={{width: '100%'}}>
            <div className="input-group rounded">
                <input id='searchBar'
                       type="search"
                       className="form-control rounded"
                       placeholder={text}
                       aria-label="Search"
                       aria-describedby="search-addon"
                       onChange={handleInputChange}/>
                <button type='button'
                        className="input-group-text border-0"
                        id="search-addon"
                        onClick={makeSearch}>
                    <CiSearch />
                </button>
            </div>
        </div>
    );
}

export default SearchBar;
