import React, { useEffect, useRef } from 'react';

import './search-input.scss';

const SearchInput = ({
  list,
  setFilteredList,
  selectionType,
  setSearchTerm,
  disabled,
}) => {
  const input = useRef(null);

  useEffect(() => {
    // Reset input to empty when a selection is made
    if (disabled) {
      setTimeout(() => {
        input.current.value = '';
      }, 500);
    }
  }, [disabled]);

  function handleInputChange(e) {
    const value = e.target.value;
    let currentList = [];
    let newList = [];

    if (value !== '') {
      currentList = list;

      // Filter through list of concepts as you type,
      //  returning a new array of matching items
      newList = currentList.filter(item => {
        const title = item.hasOwnProperty('Title')
          ? item.Title.toLowerCase()
          : item.ArtifactSummary.toLowerCase();
        const key = item.hasOwnProperty('Key')
          ? item.Key.toString()
          : item.ArtifactKey.toString();
        const filter = value.toLowerCase();

        return title.includes(filter)
          ? title.includes(filter)
          : key.includes(filter);
      });
    } else {
      // If input is empty, reset to full list
      newList = list;
    }

    // On input change, add the filtered list to state
    if (newList.length > 0) {
      setFilteredList(newList);
    } else {
      setFilteredList('no results');
    }

    // Update state with current search term to use with mark.js
    setSearchTerm(value);
  }

  return (
    <div className="search-input">
      <label
        className="search-input__label widget-label widget-label--bold u-pad-bottom-xxxs"
        htmlFor="search-input"
      >
        {selectionType === 'concept'
          ? 'Select a Concept'
          : 'Select an Artifact'}
      </label>
      <input
        ref={input}
        type="search"
        className="search-input__input"
        id="search-input"
        name="search-input"
        placeholder={
          selectionType === 'concept'
            ? 'Filter by Concept Title or ID'
            : 'Filter by Artifact Summary or ID'
        }
        onChange={handleInputChange}
        autoComplete="off"
        disabled={disabled ? 'disabled' : ''}
      />
    </div>
  );
};

export default SearchInput;
