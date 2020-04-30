import React, { useRef, useState, useEffect, useContext } from 'react';
import posed from 'react-pose';
import Mark from 'mark.js';

import { HeroNetworkDispatch } from '../../HeroNetwork';

import '../HowMomentList/dropdown-list.scss';
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

const HeroNetworkList = ({
  list,
  connectionsList,
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
  conceptsList,
  artifactsList,
  searchTerm,
  nodeExistsLast,
}) => {
  const [selected, setSelected] = useState(-1);
  const [focused, setFocused] = useState(-1);
  const [showRemoveButton, setShowRemoveButton] = useState(true);
  const dispatch = useContext(HeroNetworkDispatch);
  const listItem = useRef([]);

  useEffect(() => {
    // Check if node data already exists and set fields to proper values
    if (nodeExists) {
      if (!nodeExistsLast) {
        setSelected(0);
        setSelectionMade(true);
      }
      else {
        setSelected(-1);
        setSelectionMade(false);
      }
    }
  }, [nodeExists, setSelectionMade, nodeExistsLast]);

  useEffect(() => {
    // Show remove button if element is last one selected
    if (
      selectionId === currentSelectionIndex ||
      selectionId + 1 === currentSelectionIndex
    ) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
  }, [currentSelectionIndex, selectionId]);

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

    // Grab set key value from button
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

        const relatedArtifacts = artifactsList.filter(
          el => item.Artifacts[el.ArtifactKey]
        );

        dispatch({
          type: 'setConnectedArtifactsList',
          list: relatedArtifacts,
        });

        // If not the last selection available, update the selection type
        if (currentSelectionIndex < maxSelection + 1) {
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

        const relatedConcepts = conceptsList.filter(el =>
          item.Concepts.includes(el.Key)
        );

        dispatch({
          type: 'setConnectedConceptsList',
          list: relatedConcepts,
        });

        // If not the last selection available, update the selection type
        if (currentSelectionIndex < maxSelection + 1) {
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

    // Remove all selections back to clicked component
    dispatch({
      type: 'setCurrentSelectionIndex',
      currentSelectionIndex: selectionId,
    });

    // Get component selection type and set to global selection type on removal
    if (selectionType === 'concept') {
      dispatch({
        type: 'setCurrentSelectionType',
        selectionType: 'concept',
      });
    } else if (selectionType === 'artifact') {
      dispatch({
        type: 'setCurrentSelectionType',
        selectionType: 'artifact',
      });
    }

    if (selectionType === 'artifact') {
      dispatch({ type: 'removeArtifactKey' });
    } else if (selectionType === 'concept') {
      dispatch({ type: 'removeConceptKey' });
    }

    setFilteredList(connectionsList);
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
                    {Object.keys(item.Artifacts).length}
                  </p>
                )}
                {item.Concepts && (
                  <p className="dropdown-list__count widget-label u-c-gray-dark u-mar-top-s">
                    <strong>Associated Concepts:</strong>{' '}
                    {Object.keys(item.Concepts).length}
                  </p>
                )}
              </div>

              {showRemoveButton && (
                <div
                  className="dropdown-list__cta widget-label widget-label--bold u-c-blue"
                  onClick={handleItemRemove}
                >
                  {i === selected ? 'Remove' : 'Select'}
                </div>
              )}
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

export default HeroNetworkList;
