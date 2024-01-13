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
        const response = await axios.get(`/collection/userCollections`);
        setUserCollections(response.data.userCollections);
      } catch (error) {
        console.error('Error fetching user collections:', error);
      }
    };
    fetchUserCollections();
  }, []);

  return (
    <>
      <Link to="/create-collection" className="btn mb-4">
        {t('Create collection')}
      </Link>
      <ul>
        {userCollections.map(collection => (
        <CollectionItem collection={collection}/>
        ))}
      </ul>
    </>
  )
}

export default MyCollections