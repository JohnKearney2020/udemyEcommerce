import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';


const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector(state => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector(state => state.userDelete);
  const { success:successDelete } = userDelete;

  //Replace this local variable used to show a user was deleted with a dispatch that updates the global state later
  // let userDeleteSuccessToggle = false;
  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to delete this user?')){
      dispatch(deleteUser(id));
      // if(successDelete){
      //   userDeleteSuccessToggle = true;
      //   setTimeout(() => {
      //     userDeleteSuccessToggle = false;
      //   }, 4000);
      // }
    }
  }

  useEffect(() => {
    //if the user is logged in and is an admin, show the list of users
    if(userInfo && userInfo.isAdmin){
      dispatch(listUsers());
    } else { //otherwise redirect them to the login page. Our login screen is set to redirect users to the home screen if they are already
      //logged in, so this if a user is logged in, but not authorized, they will be dumped to the home screen
      history.push('/login');
    }
  }, [dispatch, history, userInfo, successDelete])

  return (
    <>
      <h1>Users</h1>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mail:to${user.email}`}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (<i className='fas fa-check' style={{color: 'green'}}></i>) : (
                    <i className='fas fa-times' style={{color: 'red'}}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user._id)}>
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {successDelete && <Message variant='success'>User successfully deleted</Message>}
    </>
  )
}

export default UserListScreen;
