import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

export const SearchBar = ({ onSearch, doSearch, text }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        onSearch(value);
    };

    const makeSearch = () => {
        doSearch(inputValue);
    };

    return (
        <div className="searchbar">
            <input
                id="NoteHubSearchBar"
                type="search"
                className="searchbar-input"
                placeholder={text}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter") makeSearch();
                }}
            />

            <CiSearch
                className="searchbar-icon"
                onClick={makeSearch}
            />
        </div>
    );
};
