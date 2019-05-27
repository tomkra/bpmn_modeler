import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MenuGroup = (props) => {
  const [show, setShow] = useState(false);

  return(
    <React.Fragment>
      <li click={() => setShow(!show)}>{props.name}</li>
    </React.Fragment>
  );
}

MenuGroup.propTypes = {
  name: PropTypes.string.isRequired,
}

export default MenuGroup;