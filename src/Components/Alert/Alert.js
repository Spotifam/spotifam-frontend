/*
  <Alert/>

  Description:
    - <Alert/> is...

  Props:
    - none yet

  Child Components
    - none yet
*/


import React, { useState } from 'react';
import './Alert.css';

function Alert(props) {

  const [visible, setVisible] = useState(false);

  const showMessage = () => setVisible(true);
  const hideMessage = () => setVisible(false);

  // render --------------------------------------------------------------------

  // Renders <Alert/>
    const classes = props.visible?'popup':'';
    return (
      <>
        <div id="Alert" className={classes}>
          <div id="Icon">✓</div>
          <div id="Text">Song Added!</div>
        </div>
      </>
    );
  }

export default Alert;
