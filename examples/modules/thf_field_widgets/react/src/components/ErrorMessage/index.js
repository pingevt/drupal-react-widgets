import React from 'react';

import './error-message.scss';

const ErrorMessage = ({ errorMsg, existingNode }) => {
  return (
    <div class="error-message u-mar-bottom-l">
      <span class="error-message__msg">{errorMsg} </span>

      {existingNode !== undefined && (
        <a class="error-message__link" href={`/node/${existingNode}`}>
          View Node
        </a>
      )}
    </div>
  );
};

export default ErrorMessage;
