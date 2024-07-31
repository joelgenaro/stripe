import { useState, useEffect, useRef } from 'react'
import LetteredAvatar from 'react-lettered-avatar'

import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { deleteUser } from '../../store/reducers/userReducer'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import LogoSvg from '../../assets/images/logo.svg'
import './AppHeader.css'
import { toast } from 'react-toastify'

const AppHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [navbarBgStatus] = useState(0)

  const loginNavBarRef = useRef(null);
  const loginNavBarToggleRef = useRef(null);
  const navBarRef = useRef(null);
  const navBarToggleRef = useRef(null);
  const navbarType = 0

  const logout = () => {
    dispatch(deleteUser())
    toast.success('Logged out successfully.')
    loginNavBarToggleRef.current.click();
    navigate('/')
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("unloggedNavbarExpand", "N");
    window.localStorage.setItem("loggedNavbarExpand", "N");
  }, [location])

  const handleClickOutside = event => {
    let unloggedNavbarExpand = window.localStorage.getItem("unloggedNavbarExpand");
    let loggedNavbarExpand = window.localStorage.getItem("loggedNavbarExpand");

    if (!unloggedNavbarExpand) {
      window.localStorage.setItem("unloggedNavbarExpand", "N");
      unloggedNavbarExpand = "N";
    }

    if (!loggedNavbarExpand) {
      window.localStorage.setItem("loggedNavbarExpand", "N");
      loggedNavbarExpand = "N";
    }

    if (navBarToggleRef.current && navBarToggleRef.current.contains(event.target)) {

      if (unloggedNavbarExpand === 'N')
        window.localStorage.setItem("unloggedNavbarExpand", "Y");
      else
        window.localStorage.setItem("unloggedNavbarExpand", "N");
      return;
    }

    if (loginNavBarToggleRef.current && loginNavBarToggleRef.current.contains(event.target)) {

      if (loggedNavbarExpand === 'N')
        window.localStorage.setItem("loggedNavbarExpand", "Y");
      else
        window.localStorage.setItem("loggedNavbarExpand", "N");
      return;
    }

    if (navBarRef.current && !navBarRef.current.contains(event.target) && unloggedNavbarExpand === "Y") {
      navBarToggleRef.current.click();
      window.localStorage.setItem("unloggedNavbarExpand", "N");
    }

    if (loginNavBarRef.current && !loginNavBarRef.current.contains(event.target) && loggedNavbarExpand === "Y") {
      loginNavBarToggleRef.current.click();
      window.localStorage.setItem("loggedNavbarExpand", "N");
    }
  }

  const loginNavItems = [
    {
      path: '/subjects',
      name: 'Subjects'
    },
    {
      path: '/current-membership',
      name: 'Membership'
    },
    {
      path: '/profile',
      name: 'Account Settings'
    },
  ]

  const logoutNavItems = [
    {
      path: '/subjects',
      name: 'Subjects'
    },
    {
      path: '/about-us',
      name: 'About us'
    },
    {
      path: '/membership',
      name: 'Membership'
    },
    {
      path: '/signup',
      name: 'Sign up'
    },
    {
      path: '/login',
      name: 'Login'
    }
  ]

  const arrayWithColors = [
    '#33691e',
    '#2a6214',
    '#48ec08',
    '#bac3d0',
    '#ed6b75',
    '#F1C40F',
    '#36c6d3',
    '#659be0',
    '#E4A254',
    '#8e44ad',
    '#e67e22',
    '#e74c3c',
    '#1abc9c',
    '#2c3e50',
    '#3498db',
  ];

  return (
    <div style={{ height: 109 }}>
      {user.token ? (
        <Navbar
          expand='lg'
          style={{
            backgroundColor: navbarType
              ? navbarBgStatus
                ? '#D6E4F1'
                : '#f4f7fa'
              : '#D6E4F1'
          }}
          collapseOnSelect
        >
          <Container ref={loginNavBarRef}>
            <LinkContainer to='/'>
              <Nav.Link className='navbar-brand'>
                <LazyLoadImage src={LogoSvg} alt='logo' width={207} height={59} />
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls='navbar' ref={loginNavBarToggleRef} style={{ border: 'none', marginTop: 8 }}>
              <LetteredAvatar
                name={user.user.firstName}
                size={40}
                radius={8}
                color="#fff"
                backgroundColor={arrayWithColors[user.user.avatarColor]}
              />
            </Navbar.Toggle>
            <Navbar.Collapse id='navbar'>
              <Nav className='ms-auto' activeKey={location.pathname}>
                {loginNavItems.map((navItem, idx) => (
                  <Nav.Item key={idx}>
                    <LinkContainer to={navItem.path}>
                      <Nav.Link>{navItem.name}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
                {
                  user.user.role === 2 && <Nav.Item>
                    <LinkContainer to='/admin'>
                      <Nav.Link>Admin panel</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                }
                {
                  user.user.role === 1 && <Nav.Item>
                    <LinkContainer to='/admin'>
                      <Nav.Link>Staff panel</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                }
                <Nav.Item onClick={() => logout()}>
                  <Nav.Link>Logout</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
            <span className="login-letter-avatar">
              <LetteredAvatar
                name={user.user.firstName}
                size={40}
                radius={8}
                color="#fff"
                backgroundColor={arrayWithColors[user.user.avatarColor]}
              />
            </span>
          </Container>
        </Navbar>
      ) : (
        <Navbar
          expand='lg'
          style={{
            backgroundColor: navbarType
              ? navbarBgStatus
                ? '#D6E4F1'
                : '#f4f7fa'
              : '#D6E4F1'
          }}
          collapseOnSelect
        >
          <Container ref={navBarRef}>
            <LinkContainer to='/'>
              <Nav.Link className='navbar-brand'>
                <LazyLoadImage src={LogoSvg} alt='logo' width={207} height={59} />
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls='navbar' ref={navBarToggleRef} />
            <Navbar.Collapse id='navbar'>
              <Nav className='ms-auto' activeKey={location.pathname}>
                {logoutNavItems.map((navItem, idx) => (
                  <Nav.Item key={idx}>
                    <LinkContainer to={navItem.path}>
                      <Nav.Link>{navItem.name}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )
      }
    </div >
  )
}

export default AppHeader
