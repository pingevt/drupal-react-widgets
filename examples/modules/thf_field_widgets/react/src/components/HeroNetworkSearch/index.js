import React, { useState, useEffect } from 'react';

import SearchInput from '../SearchInput';
import HeroNetworkList from '../HeroNetworkList';

const HeroNetworkSearch = ({
  list,
  maxSelection,
  currentSelectionIndex,
  currentSelectionType,
  nodeExists,
  hasData,
  nodeValueArray,
  connectedList,
  conceptsList,
  artifactsList,
}) => {
  const [filteredList, setFilteredList] = useState([]);
  const [connectionsList, setConnectionsList] = useState([]);
  const [selectionMade, setSelectionMade] = useState(false);
  const [selectionId] = useState(currentSelectionIndex);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectionType, setSelectionType] = useState(currentSelectionType);
  const [nodeExistsLast, setNodeExistsLast] = useState(false);

  useEffect(() => {
    // On update, add the filtered list to state if node data doesn't exist
    if (filteredList.length === 0 && !nodeExists) {
      setFilteredList(connectedList);
      setConnectionsList(connectedList);
    }
  }, [connectedList, filteredList, nodeExists]);

  useEffect(() => {
    if (nodeExists) {

      // console.log(nodeValueArray);
      if (nodeValueArray.type === 'artifact') {
        // console.log(artifactsList.filter(
        //   selected => selected.ArtifactKey === nodeValueArray.key
        // ));
        setSelectionType('artifact');
        if (nodeValueArray.key) {
          setFilteredList(
            artifactsList.filter(
              selected => selected.ArtifactKey === nodeValueArray.key
            )
          );
        } else {
          setNodeExistsLast(true);
          setFilteredList(nodeValueArray.connected);
        }
        setConnectionsList(nodeValueArray.connected);
      } else if (nodeValueArray.type === 'concept') {
        setSelectionType('concept');
        // console.log(conceptsList.filter(
        //   selected => selected.Key === nodeValueArray.key
        // ));

        if (nodeValueArray.key) {
          setFilteredList(
            conceptsList.filter(
              selected => selected.Key === nodeValueArray.key
            )
          );
        } else {
          setNodeExistsLast(true);
          setFilteredList(nodeValueArray.connected);
        }
        setConnectionsList(nodeValueArray.connected);
      }
    }
  }, [
    nodeExists,
    nodeValueArray,
    artifactsList,
    conceptsList,
    connectionsList,
  ]);

  return (
    <>
      <SearchInput
        list={connectionsList}
        selectionType={selectionType}
        setFilteredList={setFilteredList}
        setSearchTerm={setSearchTerm}
        disabled={selectionMade}
      />

      <HeroNetworkList
        list={list}
        hasData={hasData}
        connectionsList={connectionsList}
        conceptsList={conceptsList}
        artifactsList={artifactsList}
        maxSelection={maxSelection}
        selectionId={selectionId}
        selectionType={selectionType}
        selectionMade={selectionMade}
        setSelectionMade={setSelectionMade}
        currentSelectionIndex={currentSelectionIndex}
        currentSelectionType={currentSelectionType}
        setFilteredList={setFilteredList}
        filteredList={filteredList}
        nodeExists={nodeExists}
        nodeValueArray={nodeValueArray}
        searchTerm={searchTerm}
        nodeExistsLast={nodeExistsLast}
      />
    </>
  );
};

export default HeroNetworkSearch;
