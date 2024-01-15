import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CollectionItem from "./CollectionItem";

function MyCollections () {
  const { t } = useTranslation();
  const [userCollections, setUserCollections] = useState([]);

  useEffect(() => {
    const fetchUserCollections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/collection/userCollections', {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUserCollections(response.data.userCollections);
      } catch (error) {
        console.error('Error fetching user collections:', error);
      }
    };
    fetchUserCollections();
  }, []);

  const updateCollections = (updatedCollections) => {
    setUserCollections(updatedCollections);
  };

  return (
    <>
      <Link to="/create-collection" className="btn mb-4">
        {t('Create collection')}
      </Link>
      <ul>
        {userCollections && userCollections.map(collection => (
          <CollectionItem
          key={collection.id}
          collection={collection}
          updateCollections={updateCollections}
          />
        ))}
      </ul>
    </>
  )
}

export default MyCollections