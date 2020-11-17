import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import ProductCarousel from '../components/ProductCarousel';

import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch(); //needs to be defined so we can run dispatches
  
  //Populate the global state with products fetched from our server (that fetches them from our database) once the HomeScreen loads
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber)); 
  }, [dispatch, keyword, pageNumber]);

  //Pull all the products in from the global state so we can use them in this component
  const productList = useSelector(state => state.productList);
  const { loading, error, products, page, pages } = productList;

  return (
    <>
    <Meta />
    {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'>Go Back</Link>}
      <h1>Latest Products</h1>
      {loading ? ( <Loader /> 
      ) : error ? ( <Message variant='danger'>{error}</Message> 
      ) : ( 
        <>
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
        </>
      )}
    </>
  )
}

export default HomeScreen;


//Old Loading and Error Messages:
// {loading ? ( <h2>Loading...</h2> 
//   ) : error ? ( <h3>{error}</h3> 
//   ) : ( <Row>
//       {products.map((product) => (
//         <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
//           <Product product={product} />
//         </Col>
//       ))}
//     </Row>
//   )}