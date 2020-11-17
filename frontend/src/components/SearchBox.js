import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
// We need useHistory since we don't have direct access to history as a prop for SearchBox since we embedded it into our header
// This method is an easier one than shown in the lecture below:
// https://www.udemy.com/course/mern-ecommerce/learn/lecture/22499086#questions/12813439
import { useHistory } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const history = useHistory();
  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword.trim()) {
      history.push(`/search/${keyword}`) //need a route for this in the backend!
    } else {
      history.push('/')
    }
  }
  //inline form b/c this will go in the header
  return (
    <Form onSubmit={submitHandler} inline> 
      <Form.Control 
      type='text' 
      name='q' 
      onChange={(e) => setKeyword(e.target.value)} 
      placeholder='Search Products...' 
      className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>Search</Button>
    </Form>
  )
}

export default SearchBox;
