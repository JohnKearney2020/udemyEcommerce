import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import './ProductListScreen.css'


const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector(state => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete;
  
  const productCreate = useSelector(state => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = productCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const createProductHandler = () => {
    console.log(`create product clicked`);
    dispatch(createProduct());
  }

  //Replace this local variable used to show a user was deleted with a dispatch that updates the global state later
  // let userDeleteSuccessToggle = false;
  const deleteHandler = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')){
      //DELETE PRODUCTS
      dispatch(deleteProduct(id));
    }
  }

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if(!userInfo.isAdmin) {
      history.push('/login');
    }
    //if the user is logged in and is an admin, show the list of users
    // if(userInfo && userInfo.isAdmin){
    //   dispatch(listProducts());
    // } else { //otherwise redirect them to the login page. Our login screen is set to redirect users to the home screen if they are already
    //   //logged in, so this if a user is logged in, but not authorized, they will be dumped to the home screen
    //   history.push('/login');
    // }

    if(successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      // the '' represents an empty keyword
      dispatch(listProducts('', pageNumber));
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <>
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><Image src={product.image} alt={product.name} className="img-rounded adminProductListImage"/></td>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <LinkContainer to={`/admin/user/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <i className='fas fa-edit'></i>
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Paginate pages={pages} page={page} isAdmin={true}/>
        </>
      )}
      {/* {successDelete && <Message variant='success'>User successfully deleted</Message>} */}
    </>
  )
}

export default ProductListScreen;
