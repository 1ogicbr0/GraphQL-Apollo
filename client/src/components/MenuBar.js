import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

import { AuthContext } from '../context/auth'

const MenuBar = () => {
  const {user, logout} = useContext(AuthContext);
    const [activeItem,setActiveItem] = useState('home')
    const menuBar = user ? (<Menu pointing secondary size="massive" color="blue">
    <Menu.Item
      name={user.username}
      active
      as={Link}
      to="/"
    />

    <Menu.Menu position='right'>
    <Menu.Item
      name='logout'
      onClick={logout}
      as={Link}
      to="/"
    />
 
    </Menu.Menu>
  </Menu>) : (
      <Menu pointing secondary size="massive" color="blue">
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={() => setActiveItem('home')}
            as={Link}
            to="/"
          />

          <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={() => setActiveItem('login')}
            as={Link}
            to="/login"
          />
            <Menu.Item
              name='register'
              active={activeItem === 'register'}
              onClick={() => setActiveItem('register')}
              as={Link}
              to="/register"
            />
          </Menu.Menu>
        </Menu>
    )
    return menuBar;
  }

export default MenuBar