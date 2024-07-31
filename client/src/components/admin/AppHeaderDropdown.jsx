import React from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import LetteredAvatar from 'react-lettered-avatar'
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "../../store/reducers/userReducer";
import { toast } from 'react-toastify';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(deleteUser());
    toast.success("Logged out successfully.");
    navigate("/login");
  }
  const user = useSelector(state => state.user)

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
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <LetteredAvatar
          name={user.user.firstName}
          size={40}
          radius={8}
          color="#fff"
          backgroundColor={arrayWithColors[user.user.avatarColor]}
        />
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end">
        <Link to={`/`} className="dropdown-item" style={{ textDecoration: 'none', cursor: 'pointer' }} >
          Main site
        </Link>
        <Link to={`/profile`} className="dropdown-item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          Profile
        </Link>
        <CDropdownItem onClick={() => logout()} style={{ cursor: 'pointer' }}>
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
