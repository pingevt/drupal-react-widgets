import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import posed, { PoseGroup } from 'react-pose';

import HeroNetworkSearch from './components/HeroNetworkSearch';
import HeroNetworkTextArea from './components/HeroNetworkTextArea';

import './assets/scss/app.scss';

const drupalInput = document.querySelector('.hero-network-input');
const nodeValue =
  !!drupalInput && drupalInput.getAttribute('value') !== ''
    ? JSON.parse(drupalInput.getAttribute('value'))
    : { concept: [] };
let nodeValueArray;
const mergeArr = (a, b) => a.map((x, i) => [x, b[i]]);

const FadeInUp = posed.div({
  enter: {
    opacity: 1,
    y: 0,
    transition: { ease: 'easeInOut', delay: 0, duration: 400 },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { ease: 'easeInOut', duration: 200 },
  },
});

// Create a new context to pass callbacks to all children in tree
export const HeroNetworkDispatch = React.createContext(null);

// Set initial state object
const initialState = {
  nodeExists: false,
  currentSelectionIndex: 1,
  currentSelectionType: 'artifact',
  statementText: '',
  artifactKeys: [],
  conceptKeys: [],
  connectedConceptsList: [],
  connectedArtifactsList: [],
};

// Create a reducer function to handle callback events
const reducer = (state, action) => {
  switch (action.type) {
    case 'setNodeExists':
      return {
        ...state,
        nodeExists: action.exists,
      };
    case 'setCurrentSelectionIndex':
      return {
        ...state,
        currentSelectionIndex: action.currentSelectionIndex,
      };
    case 'setCurrentSelectionType':
      return {
        ...state,
        currentSelectionType: action.selectionType,
      };
    case 'setConceptKey':
      return {
        ...state,
        conceptKeys: [...state.conceptKeys, action.concept],
        currentSelectionIndex: state.currentSelectionIndex + 1,
      };
    case 'removeConceptKey':
      // Remove last item added to concept array
      state.conceptKeys.pop();

      return {
        ...state,
        conceptKeys: [...state.conceptKeys],
      };
    case 'setArtifactKey':
      return {
        ...state,
        artifactKeys: [...state.artifactKeys, action.artifact],
        currentSelectionIndex: state.currentSelectionIndex + 1,
      };
    case 'removeArtifactKey':
      state.artifactKeys.pop();

      return {
        ...state,
        artifactKeys: [...state.artifactKeys],
      };
    case 'setStatementText':
      return {
        ...state,
        statementText: action.text,
      };
    case 'setConnectedConceptsList':
      return {
        ...state,
        connectedConceptsList: action.list,
      };
    case 'setConnectedArtifactsList':
      return {
        ...state,
        connectedArtifactsList: action.list,
      };
    default:
      return state;
  }
};

function HeroNetwork({ wrapperAttrs }) {
  // Set initial tables to state
  const [conceptsList, setConceptsList] = useState([]);
  const [artifactsList, setArtifactsList] = useState([]);
  const [maxSelection, setMaxSelection] = useState(6);
  const [drupalValues, setDrupalValues] = useState({});
  const [hasData, setHasData] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Set max connections to Drupal config settings
    setMaxSelection(Number(wrapperAttrs['data-max-connections']));

    function getLists() {
      const artifactsURL = '/api/table/artifacts';
      const conceptsURL = '/api/table/concepts';

      axios.all([axios.get(artifactsURL), axios.get(conceptsURL)]).then(
        axios.spread((artifactsRes, conceptsRes) => {
          const artifactsObj = artifactsRes.data.Data.Artifacts;
          const conceptsObj = conceptsRes.data.Data.Concepts;

          // Convert object into an array of concepts
          const artifactsArr = Object.values(artifactsObj);
          const conceptsArr = Object.values(conceptsObj);

          setArtifactsList(artifactsArr);
          setConceptsList(conceptsArr);

          dispatch({ type: 'setConnectedArtifactsList', list: artifactsArr });
          setHasData(true);
        })
      );
    }

    getLists();
  }, [wrapperAttrs]);

  useEffect(() => {
    // console.log(nodeValue);
    // Set default settings if node already exists
    if ((nodeValue.concept.length > 0) & hasData) {
      const conceptArr = [];
      const artifactArr = [];

      nodeValue.concept.forEach(node => {
        conceptArr.push({ type: 'concept', key: node });
      });
      // We are trusting that the incoming data is one less or equal.
      if (nodeValue.concept.length < nodeValue.artifact.length) {
        conceptArr.push({ type: 'concept' });
      }
      nodeValue.artifact.forEach(node => {
        artifactArr.push({ type: 'artifact', key: node });
      });

      // console.log(conceptArr, artifactArr);

      const combinedNodeArray = mergeArr(artifactArr, conceptArr);
      // console.log("cna", combinedNodeArray);

      nodeValueArray = combinedNodeArray.reduce((a, b) => a.concat(b), []);
      // console.log("nva", nodeValueArray);

      dispatch({ type: 'setNodeExists', exists: true });
      dispatch({
        type: 'setStatementText',
        text: nodeValue.text,
      });

      for (let [i, node] of nodeValueArray.entries()) {
        setTimeout(() => {
          if (node.type === 'artifact') {
            if (node.key) {
              dispatch({
                type: 'setArtifactKey',
                artifact: node.key,
              });
            }
            dispatch({
              type: 'setCurrentSelectionType',
              selectionType: 'concept',
            });
          } else if (node.type === 'concept') {
            if (node.key) {
              dispatch({
                type: 'setConceptKey',
                concept: node.key,
              });
            }
            dispatch({
              type: 'setCurrentSelectionType',
              selectionType: 'artifact',
            });
          }
        }, (i + 1) * 100);
      }
    }
  }, [hasData]);

  useEffect(() => {
    // Set connected artifacts and concepts to each existing item
    if (state.nodeExists && hasData) {
      let count;

      for (let [i, node] of nodeValueArray.entries()) {
        if (count === maxSelection - 1) return;
        count = i + 1 < maxSelection ? i + 1 : maxSelection - 1;

        if (node.type === 'artifact') {
          const item = artifactsList.find(el => el.ArtifactKey === node.key);
          const relatedConcepts = conceptsList.filter(el =>
            item.Concepts.includes(el.Key)
          );

          if (nodeValueArray[count]) nodeValueArray[count].connected = relatedConcepts;
        } else if (node.type === 'concept') {
          const item = conceptsList.find(el => el.Key === node.key);

          if (item !== undefined) {
            const relatedArtifacts = artifactsList.filter(
              el => item.Artifacts[el.ArtifactKey]
            );

            nodeValueArray[count].connected = relatedArtifacts;
          }
        }
      }
    }
  }, [state.nodeExists, artifactsList, conceptsList, maxSelection, hasData]);

  useEffect(() => {
    // Set node data to Drupal input
    setDrupalValues(
      JSON.stringify({
        concept: state.conceptKeys,
        artifact: state.artifactKeys,
        text: state.statementText,
      })
    );
  }, [state.conceptKeys, state.artifactKeys, state.statementText]);

  return (
    <main className="app">
      <HeroNetworkDispatch.Provider value={dispatch}>
        <div className="widget-wrapper u-mar-top-l">
          <HeroNetworkTextArea statementText={state.statementText} />

          <PoseGroup>
            {// Increase Array to map through as selections are made
            [
              ...Array(
                state.currentSelectionIndex < maxSelection
                  ? state.currentSelectionIndex
                  : maxSelection
              ),
            ].map((e, i) => (
              <FadeInUp key={i}>
                <HeroNetworkSearch
                  key={i}
                  list={
                    state.currentSelectionType === 'artifact'
                      ? artifactsList
                      : conceptsList
                  }
                  conceptsList={conceptsList}
                  artifactsList={artifactsList}
                  connectedList={
                    state.currentSelectionType === 'artifact'
                      ? state.connectedArtifactsList
                      : state.connectedConceptsList
                  }
                  maxSelection={maxSelection}
                  currentSelectionIndex={state.currentSelectionIndex}
                  currentSelectionType={state.currentSelectionType}
                  nodeExists={state.nodeExists}
                  hasData={hasData}
                  nodeValueArray={state.nodeExists && nodeValueArray[i]}
                />
              </FadeInUp>
            ))}
          </PoseGroup>
        </div>
      </HeroNetworkDispatch.Provider>

      <div>
        <input
          type="text"
          value={drupalValues}
          readOnly
          style={{ display: 'none' }}
          id={wrapperAttrs.id && wrapperAttrs.id}
          name={wrapperAttrs.name && wrapperAttrs.name}
        />
      </div>
    </main>
  );
}

export default HeroNetwork;
