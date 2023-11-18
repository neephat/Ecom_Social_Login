import React from "react";

const SortOption = ({ handleSortOption }) => {
    return (
        <div>
            <select className="border border-2 p-2" onChange={handleSortOption}>
                <option value="">--------Options---------</option>
                <option value="price">price</option>
                <option value="sold">sold</option>
                <option value="review">review</option>
            </select>
        </div>
    );
};

export default SortOption;
