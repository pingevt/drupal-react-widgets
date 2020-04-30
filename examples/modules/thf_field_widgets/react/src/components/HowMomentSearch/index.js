import React, { useState, useEffect } from 'react';

import SearchInput from '../SearchInput';
import HowMomentList from '../HowMomentList';

const HowMomentSearch = ({
  list,
  maxSelection,
  currentSelectionIndex,
  currentSelectionType,
  nodeExists,
  hasData,
  showErrorMessage,
  conceptKeys,
  artifactKeys,
}) => {
  const [filteredList, setFilteredList] = useState([]);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectionId] = useState(currentSelectionIndex);
  const [selectionType] = useState(currentSelectionType);
  const [searchTerm, setSearchTerm] = useState(null);

  useEffect(() => {
    // On mount, add the filtered list to state if node data doesn't exist
    if (filteredList.length === 0 && !nodeExists) {
      setFilteredList(list);
    }
  }, [filteredList, list, nodeExists]);

  return (
    <>
      <SearchInput
        list={list}
        selectionType={selectionType}
        setFilteredList={setFilteredList}
        setSearchTerm={setSearchTerm}
        disabled={selectionMade}
      />

      <HowMomentList
        list={list}
        maxSelection={maxSelection}
        selectionId={selectionId}
        selectionType={selectionType}
        selectionMade={selectionMade}
        setSelectionMade={setSelectionMade}
        currentSelectionIndex={currentSelectionIndex}
        currentSelectionType={currentSelectionType}
        filteredList={filteredList}
        setFilteredList={setFilteredList}
        nodeExists={nodeExists}
        hasData={hasData}
        showErrorMessage={showErrorMessage}
        conceptKeys={conceptKeys}
        artifactKeys={artifactKeys}
        searchTerm={searchTerm}
      />
    </>
  );
};

export default HowMomentSearch;
