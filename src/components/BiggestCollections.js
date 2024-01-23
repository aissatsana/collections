import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Carousel } from "react-bootstrap";
import '../styles/biggestcollection.css';

const BiggestCollections = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('/api/collection/getTop');
        setCollections(response.data.collections);
      } catch (error) {
        console.error('Error fetching collections: ', error);
      }
    };
    fetchCollections();
  }, []);

  return (
    <>
      {collections.length > 0 ? (
        <div className='w-100'>
          <Carousel>
            {collections.map((collection) => (
              <Carousel.Item key={collection.id}>
                <Card className="w-100 p-3 align-items-center">
                  <h4>
                    <Link to={`/collection/${collection.id}`}>
                      {collection.name}
                    </Link>
                  </h4>
                  <img
                    src={collection.image_url ? collection.image_url : 'img/default-collection.webp'}
                    alt={collection.name}
                    style={{ width: '200px', height: '200px', border: '2px solid black' }}
                    className="rounded"
                  />
                  <p>{t('Count items')}: {collection.itemCount}</p>
                  <p>{t('Created by')}: {collection.username}</p>
                </Card>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      ) : (
        <p>{t('No collections available')}</p>
      )}
    </>
  );
};

export default BiggestCollections;
