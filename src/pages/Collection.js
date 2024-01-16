import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import ItemsTable from '../components/ItemsTable';

const Collection = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState([]);
  const { isAuthenticated, userId } = useAuth();

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

  const updateItems = (updatedItems) => {
    setItems(updatedItems);
  };
  

  const isOwner = isAuthenticated && userId === collection.user_id;
  return (
    <Container>
      <Row>
        <Col md={6}>
          <Image src={collection.image_url} alt={collection.name} fluid width={300} height={300}/>
        </Col>
        <Col md={6}>
          <h2>{collection.name}</h2>
          <p>{collection.description}</p>
          {isOwner && (
            <Button variant="primary" className="btn">Edit Collection</Button>
          )}
        </Col>
      </Row>
      <ItemsTable items={items} isOwner={isOwner} updateItems={updateItems} collection={collection} collectionId={collectionId} />
    </Container>
  );
};

export default Collection;
