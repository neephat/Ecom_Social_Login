import { Button } from "@mui/material";
import React from "react";

const Search = ({ handleSearchInput, handleSearchSubmit }) => {
    return (
        <div className="mb-10">
            <form onSubmit={handleSearchSubmit}>
                <input
                    className="border border-black w-2/4 p-2 mb-4"
                    type="text"
                    placeholder="search product"
                    required
                    onChange={handleSearchInput}
                />
                <br />
                <Button variant="contained" color="warning" type="submit">
                    search
                </Button>
            </form>
        </div>
    );
};

export default Search;
