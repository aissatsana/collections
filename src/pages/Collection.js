import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Image } from 'react-bootstrap';
import ItemsTable from '../components/ItemsTable';
import { useTranslation } from 'react-i18next';

const Collection = () => {
  const { t } = useTranslation();
  let { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [originalItems, setOriginalItems] = useState([]);
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
        const response = await axios.get(`/api/items/${collectionId}/items`);
        setOriginalItems(response.data.items);
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


  const isOwner = isAuthenticated && userId === collection.user_id;
  return (
    <Container>
      <Row>
        <Col md={6}>
          {collection.image_url && 
          <Image src={collection.image_url} alt={collection.name} fluid width={300} height={300}/>
          }
        </Col>
        <Col md={6}>
          <h2>{collection.name}</h2>
          <p>{collection.description}</p>
          {isOwner && (
            <Link to={`/collection/edit/${collection.id}`} className="btn btn-primary ms-auto">
              {t('Edit')}
            </Link>
          )}
        </Col>
      </Row>
      <ItemsTable originalItems={originalItems} isOwner={isOwner} collection={collection} collectionId={collectionId} />
    </Container>
  );
};

export default Collection;
