import React from 'react';

import MenuGroup from './MenuGroup';

const Menu = () => {
  return(
    <ul class="menu">
      <MenuGroup name="File" />
      <MenuGroup name="Edit" />
      <MenuGroup name="View" />
      <MenuGroup name="Help" />
    </ul>
  );
}

export default Menu;