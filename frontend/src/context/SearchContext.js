import React, { createContext, useState } from 'react';

// Create the context
export const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState({}); // Initialize as an empty object

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
};
