import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import posed, { PoseGroup } from 'react-pose';

import HowMomentSearch from './components/HowMomentSearch';
import HowMomentTextArea from './components/HowMomentTextArea';
import ErrorMessage from './components/ErrorMessage';

import './assets/scss/app.scss';

const drupalInput = document.querySelector('.how-moment-input');
const nodeValue =
  !!drupalInput && drupalInput.getAttribute('value') !== ''
    ? JSON.parse(drupalInput.getAttribute('value'))
    : { concept: [] };
let currentNodeId = !!drupalInput ? drupalInput.getAttribute('data-nid') : null;

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
export const HowMomentDispatch = React.createContext(null);

// Set initial state object
const initialState = {
  nodeExists: false,
  showErrorMessage: false,
  errorMsg: '',
  existingNode: null,
  maxSelection: 2,
  currentSelectionIndex: 1,
  currentSelectionType: 'concept',
  conceptKeys: [],
  artifactsList: [],
  artifactKeys: [],
  statementText: '',
};

// Create a reducer function to handle callback events
const reducer = (state, action) => {
  switch (action.type) {
    case 'setNodeExists':
      return {
        ...state,
        nodeExists: action.exists,
      };
    case 'setErrorMessageVisibility':
      return {
        ...state,
        showErrorMessage: action.exists,
      };
    case 'setErrorMsg':
      return {
        ...state,
        errorMsg: action.message,
      };
    case 'setExistingNode':
      return {
        ...state,
        existingNode: action.node,
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
    case 'setArtifactsList':
      return {
        ...state,
        artifactsList: action.list,
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
    default:
      return state;
  }
};

function HowMoment({ wrapperAttrs }) {
  const [conceptsList, setConceptsList] = useState([]);
  const [drupalValues, setDrupalValues] = useState({});
  const [hasData, setHasData] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    function getConceptList() {
      const url = '/api/table/concepts';

      axios.get(url).then(res => {
        const conceptsObj = res.data.Data.Concepts;
        // Convert object into an array of concepts
        const conceptsArr = Object.values(conceptsObj);

        setConceptsList(conceptsArr);
        setHasData(true);
      });
    }

    getConceptList();

    // If node exists, populate fields with data
    if (nodeValue.concept.length > 0 && hasData) {
      dispatch({ type: 'setNodeExists', exists: true });
      dispatch({ type: 'setConceptKey', concept: nodeValue.concept[0] });
      dispatch({
        type: 'setCurrentSelectionType',
        selectionType: 'artifact',
      });
      dispatch({ type: 'setArtifactKey', artifact: nodeValue.artifact[0] });
      dispatch({ type: 'setStatementText', text: nodeValue.text });
    }
  }, [hasData]);

  useEffect(() => {
    // Check if connection already exists
    function getValidation() {
      const url = `/api/table/how-moment-verify/${state.conceptKeys[0]}/${
        state.artifactKeys[0]
      }`;

      axios.get(url).then(res => {
        const data = res.data.data;

        if (data.valid === false && currentNodeId !== data.existing_node) {
          dispatch({ type: 'setErrorMessageVisibility', exists: true });
          dispatch({ type: 'setErrorMsg', message: data.msgs[0] });
          dispatch({ type: 'setExistingNode', node: data.existing_node });
        }
      });
    }

    if (state.conceptKeys.length > 0 && state.artifactKeys.length > 0) {
      getValidation();
    }
  }, [state.conceptKeys, state.artifactKeys]);

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
      <HowMomentDispatch.Provider value={dispatch}>
        <div className="widget-wrapper u-mar-top-xl">
          {state.showErrorMessage && (
            <ErrorMessage
              errorMsg={state.errorMsg}
              existingNode={state.existingNode}
            />
          )}

          <HowMomentSearch
            list={conceptsList}
            currentSelectionIndex={1}
            currentSelectionType={state.currentSelectionType}
            maxSelection={state.maxSelection}
            nodeExists={state.nodeExists}
            hasData={hasData}
            conceptKeys={state.conceptKeys}
          />

          <PoseGroup>
            {state.currentSelectionIndex >= 2 && (
              <FadeInUp key="step-2">
                <HowMomentSearch
                  list={state.artifactsList}
                  currentSelectionIndex={2}
                  maxSelection={state.maxSelection}
                  currentSelectionType={state.currentSelectionType}
                  nodeExists={state.nodeExists}
                  hasData={hasData}
                  showErrorMessage={state.showErrorMessage}
                  artifactKeys={state.artifactKeys}
                />
              </FadeInUp>
            )}

            {state.currentSelectionIndex === 3 && (
              <FadeInUp key="step-3">
                <HowMomentTextArea statementText={state.statementText} />
              </FadeInUp>
            )}
          </PoseGroup>
        </div>
      </HowMomentDispatch.Provider>

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

export default HowMoment;
