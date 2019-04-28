import React from 'react';

import Menu from './Menu';

const Header = () => {
  return (
    <header>
      <i id="main-logo" className="fas fa-project-diagram fa-2x" />
      <Menu />
    </header>
  );
}

export default Header;