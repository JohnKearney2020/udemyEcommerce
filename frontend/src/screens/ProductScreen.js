import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

//match below is another destructure of the props object. Match is a default method on the object
const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  //Get the product from our global state so we can use it here in this component
  const productDetails = useSelector(state => state.productDetails);
  const { loading, error, product } = productDetails;

  //Get the product review info from the global state to use when user's add reviews to products.
  const productReviewCreate = useSelector(state => state.productReviewCreate);
  //the global state has loading, which we could also use
  const { success: successProductReview, error: errorProductReview } = productReviewCreate;

  //Get the logged in userInfo from the global state
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;


  //Populate the global state with the product in our database that has a matching id
  useEffect(() => {
    //If we just submitted a product review
    if(successProductReview){
      alert('Review Submitted!');
      //reset the local state pertaining to product reviews
      setRating(0);
      setComment('');
      //rest the global state pertaining to product reviews
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, successProductReview]);
  
  const addToCartHandler = () => {
    //Redirect the user to the cart page
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault();
    //create the product review
    dispatch(createProductReview(match.params.id, { rating, comment }));
  }

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
        <>
        <Meta title={product.name}/>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                {/* =============== */}
                {/*      Price      */}
                {/* =============== */}
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* =============== */}
                {/* In/Out of stock */}
                {/* =============== */}
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </Col>
                  </Row>
                {/* =============== */}
                {/*       Qty       */}
                {/* =============== */}
                </ListGroup.Item>
                {/* && shortcut is a shortcut since there is no else */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control as='select' value={qty} onChange={(e) => 
                        setQty(e.target.value)}>
                          {[...Array(product.countInStock).keys()].map(x => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {/* =============== */}
                {/*   Add to Cart   */}
                {/* =============== */}
                <ListGroup.Item>
                  <Button
                    className='btn-block'
                    type='button'
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Add To Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {product.reviews.length === 0 && <Message>No Reviews</Message>}
            <ListGroup variant='flush'>
              {product.reviews.map(review => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Write a Customer Review</h2>
                {errorProductReview && (<Message variant='danger'>{errorProductReview}</Message>)}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    {/* Rating */}
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    {/* Comment */}
                    <Form.Group controlId='comment'>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>Please <Link to='/login'>sign in</Link> to write a review</Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen;


//Old way of fetching a product from the backend by passing match into the component function {{ match }}:
// useEffect(() => {
//   const fetchProduct = async () => {
//     //whatever variable we set equal to our await.axios would have a data object assigned to it by default. We can skip having to do something
//     // like 'response.data' to access the data by instead using array destructuring - { data }
//     const { data } = await axios.get(`/api/products/${match.params.id}`)
//     // see our corresponding route in the backend to see how it returns just one product
//     setProduct(data) //update the local state with the data we just fetched
//   }

//   fetchProduct()
// }, [match])
