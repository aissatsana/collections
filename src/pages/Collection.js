import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Button, ListGroup } from 'react-bootstrap';

const Collection = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collection/${collectionId}`);
        setCollection(response.data.collection);
      } catch (error) {
        console.error('Error fetching collection:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/collection/${collectionId}/items`);
        setItems(response.data.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchCollection();
    fetchItems();
  }, [collectionId]);

  if (!collection) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Image src={collection.image_url} alt={collection.name} fluid width={300} height={300}/>
        </Col>
        <Col md={6}>
          <h2>{collection.name}</h2>
          <p>{collection.description}</p>
          <Button variant="primary" className="btn">Edit Collection</Button>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col>
          <h3>Items</h3>
          <ListGroup>
            {items.length > 0 ? (
            items.map((item) => (
              <ListGroup.Item key={item.id}>
                {item.name} - {item.description}
                <Link to={`/collections/${collectionId}/items/${item.id}/edit`} className="btn ml-2">
                  Edit
                </Link>
                <Button variant="danger" className="btn ml-2">
                  Delete
                </Button>
              </ListGroup.Item>
            ))) : (    
              <ListGroup.Item>Пока здесь ничего нет</ListGroup.Item>
            )}
          </ListGroup>
          <Link to={`/collection/${collectionId}/create-item`} state={{ collection }} className="btn mt-2">
            Add New Item
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Collection;
