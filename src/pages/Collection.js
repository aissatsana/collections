import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import ItemsTable from '../components/ItemsTable';
import { useTranslation } from 'react-i18next';

const Collection = () => {
  const { t } = useTranslation();
  let { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [originalItems, setOriginalItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await axios.get(`/api/collection/${collectionId}`);
        setCollection(response.data.collection);
        console.log(response.data.collection)
        setIsOwner(isAuthenticated && userId === response.data.collection.user_id);
      } catch (error) {
        console.error('Error fetching collection:', error);
        setLoading(false);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/items/${collectionId}/items`);
        setOriginalItems(response.data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching items:', error);
        setLoading(false);
      }
    };

    fetchCollection();
    fetchItems();
  }, [collectionId, isAuthenticated, userId]);

  return (
    <>
    {loading ? (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Spinner animation="border" />
    </div>
    ) : (
      collection && (
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
            <Link to={`/collection/edit/${collection.id}`} className="btn btn-secondary ms-auto">
              {t('Edit')}
            </Link>
          )}
        </Col>
      </Row>
      <ItemsTable originalItems={originalItems} isOwner={isOwner} collection={collection} collectionId={collectionId} />
    </Container>
      )
    )}
    </>
  );
};

export default Collection;
