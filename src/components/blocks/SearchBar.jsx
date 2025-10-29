import React, {useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {CiSearch} from "react-icons/ci";

export const SearchBar = ({onSearch, doSearch, text}) => {
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
        <div className="input-group rounded align-items-center searchBar">
            <input id='NoteHubSearchBar'
                   type="search"
                   className="form-control rounded me-2"
                   placeholder={text}
                   aria-label="Search"
                   aria-describedby="search-addon"
                   onChange={handleInputChange}
                   onKeyDown={(e) => {
                       if (e.key === "Enter") {
                           makeSearch();
                       }
                   }}/>
            <CiSearch className={"icon active"}
                      onClick={makeSearch}/>
        </div>
    );
}
