import React, { useRef, useState, useEffect, useContext } from 'react';
import posed from 'react-pose';
import Mark from 'mark.js';

import { HowMomentDispatch } from '../../HowMoment';

import './dropdown-list.scss';
import loader from '../../assets/image/3.gif';

const List = posed.ul({
  selected: {
    y: -50,
    transition: { ease: 'easeInOut', duration: 300 },
  },
  unselected: {
    y: 0,
    transition: { ease: 'easeInOut', duration: 300 },
  },
});

const HowMomentList = ({
  list,
  currentSelectionIndex,
  maxSelection,
  currentSelectionType,
  selectionMade,
  setSelectionMade,
  filteredList,
  setFilteredList,
  selectionId,
  selectionType,
  nodeExists,
  hasData,
  showErrorMessage,
  conceptKeys,
  artifactKeys,
  searchTerm,
}) => {
  const [selected, setSelected] = useState(-1);
  const [focused, setFocused] = useState(-1);
  const dispatch = useContext(HowMomentDispatch);
  const listItem = useRef([]);

  useEffect(() => {
    // Check if node data already exists and set fields to proper values
    if (nodeExists) {
      setSelected(0);
      setSelectionMade(true);

      if (conceptKeys !== undefined) {
        const item = list.find(el => el.Key === conceptKeys[0]);

        setFilteredList(
          list.filter(selected => selected.Key === conceptKeys[0])
        );

        if (item !== undefined) {
          dispatch({
            type: 'setArtifactsList',
            // Convert Artifacts object to an array
            list: Object.values(item.Artifacts),
          });
        }
      } else if (artifactKeys !== undefined) {
        setFilteredList(
          list.filter(selected => selected.ArtifactKey === artifactKeys[0])
        );
      }
    }
  }, [
    conceptKeys,
    artifactKeys,
    list,
    nodeExists,
    setFilteredList,
    setSelectionMade,
    dispatch,
  ]);

  useEffect(() => {
    // Highlight search term while typing
    for (let title of listItem.current) {
      const titleEl = new Mark(title);
      const markOptions = {
        className: '',
        exclude: ['.dropdown-list__cta', '.dropdown-list__count *'],
        separateWordSearch: true,
        acrossElements: false,
      };

      titleEl.unmark({
        done: function() {
          titleEl.mark(searchTerm, markOptions);
        },
      });
    }
  }, [searchTerm]);

  function handleItemSelect(e) {
    // Prevent click event from bubbling
    e.preventDefault();

    const key = Number(e.currentTarget.value);
    const item = list.find(el => el.Key === key || el.ArtifactKey === key);

    if (key !== undefined) {
      // Prevent multiple selections
      if (selectionMade) return;

      if (currentSelectionType === 'concept') {
        // Set concept & associated artifacts lists to state
        dispatch({
          type: 'setConceptKey',
          concept: key,
        });
        dispatch({
          type: 'setArtifactsList',
          // Convert Artifacts object to an array
          list: Object.values(item.Artifacts),
        });

        // If not the last selection available, update the selection type
        if (currentSelectionIndex < maxSelection) {
          dispatch({
            type: 'setCurrentSelectionType',
            selectionType: 'artifact',
          });
        }
      } else if (currentSelectionType === 'artifact') {
        // Set concept & associated artifacts lists to state
        dispatch({
          type: 'setArtifactKey',
          artifact: key,
        });

        // If not the last selection available, update the selection type
        if (currentSelectionIndex < maxSelection) {
          dispatch({
            type: 'setCurrentSelectionType',
            selectionType: 'concept',
          });
        }
      }

      // Reset selected visual state
      setSelected(0);
      setSelectionMade(true);

      // Filter list down to selected item
      setFilteredList(
        list.filter(
          selected => selected.Key === key || selected.ArtifactKey === key
        )
      );
    }
  }

  function handleItemRemove() {
    // Update node state if editing an existing node
    if (nodeExists) {
      dispatch({
        type: 'setNodeExists',
        exists: false,
      });
    }

    if (showErrorMessage) {
      dispatch({
        type: 'setErrorMessageVisibility',
        exists: false,
      });
    }

    // Remove all selections back to clicked component
    dispatch({
      type: 'setCurrentSelectionIndex',
      currentSelectionIndex: selectionId,
    });

    // Get search type and set to global selection type on removal
    if (selectionType === 'artifact') {
      dispatch({ type: 'removeArtifactKey' });
      dispatch({
        type: 'setCurrentSelectionType',
        selectionType: 'artifact',
      });
    } else if (selectionType === 'concept') {
      dispatch({ type: 'removeConceptKey' });
      dispatch({ type: 'removeArtifactKey' });
      dispatch({
        type: 'setCurrentSelectionType',
        selectionType: 'concept',
      });
    }

    setFilteredList(list);
    setSelectionMade(false);
    setSelected(-1);
  }

  function handleItemFocus(i) {
    // Select item by index
    setFocused(i);
  }

  function handleItemState(i) {
    return i === focused && i !== selected
      ? 'is-focused'
      : i === selected
      ? 'is-selected'
      : '';
  }

  return (
    <List
      className={`dropdown-list u-pad-xxs`}
      pose={selectionMade ? 'selected' : 'unselected'}
    >
      {!!filteredList &&
        filteredList !== 'no results' &&
        filteredList.map((item, i) => (
          <li
            className={`dropdown-list__item ${handleItemState(i)}`}
            key={item.Key || item.ArtifactKey}
            ref={el => (listItem.current[i] = el)}
          >
            <button
              className="dropdown-list__button u-pad-s"
              value={item.Key || item.ArtifactKey}
              onClick={e => {
                handleItemSelect(e, i);
              }}
              onPointerEnter={() => {
                handleItemFocus(i);
              }}
              onPointerLeave={() => {
                handleItemFocus(-1);
              }}
              onFocus={() => {
                handleItemFocus(i);
              }}
            >
              <div className="dropdown-list__info">
                <p className="widget-label widget-label--bold widget-label--upper u-c-gray-dark u-mar-bottom-xxxs">
                  {item.Key || item.ArtifactKey}
                </p>
                <h3 className="title title--small u-pad-right-l">
                  {item.Title || item.ArtifactSummary}
                </h3>
                {item.Artifacts && (
                  <p className="dropdown-list__count widget-label u-c-gray-dark u-mar-top-s">
                    <strong>Associated Artifacts:</strong>{' '}
                    {Object.values(item.Artifacts).length}
                  </p>
                )}
              </div>

              <div
                className="dropdown-list__cta widget-label widget-label--bold u-c-blue"
                onClick={handleItemRemove}
              >
                {i === selected ? 'Remove' : 'Select'}
              </div>
            </button>
          </li>
        ))}

      {filteredList === 'no results' && (
        <li className="dropdown-list__empty">No Results</li>
      )}

      {!hasData && (
        <li className="dropdown-list__loader">
          <img src={loader} alt="Spinning loader" />
        </li>
      )}
    </List>
  );
};

export default HowMomentList;
