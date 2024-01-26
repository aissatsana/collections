import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CollectionItem from "./CollectionItem";
import CollectionFilter from "./CollectionFilter";
import SortDropdown from "./SortDropdown";
import { Spinner, Button } from "react-bootstrap";
import { useAuth } from '../contexts/AuthContext';

const UserCollections = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [userCollections, setUserCollections] = useState([]);
  const [originalCollections, setOriginalCollections] = useState([]);
  const [sortMethod, setSortMethod] = useState('name'); 
  const isMobile = window.innerWidth <= 768;
  const [showFilters, setShowFilters] = useState(!isMobile);
  const { userId, isAuthenticated } = useAuth();


  useEffect(() => {
    const fetchUserCollections = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const response = await axios.get('/api/collection/userCollections', {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data.collections);
        setOriginalCollections(response.data.collections);
        setUserCollections(sortCollections(response.data.collections));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user collections:', error);
        setLoading(false);
      }
    };
    fetchUserCollections();
  }, []);


  const updateCollections = (updatedCollections) => {
    setUserCollections(updatedCollections);
  };

  const onSelect = (eventKey) => {
    setSortMethod(eventKey);
    updateCollections((prevCollections) => sortCollections(prevCollections, eventKey));
  };

  const sortCollections = (collections, method) => {
    const sortFunctions = {
      name: (a, b) => a.name.localeCompare(b.name),
      'create-date': (a, b) => new Date(a.created_at) - new Date(b.created_at),
      'update-date': (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    };
    return collections.sort(sortFunctions[method]);
  };

  const onApplyFilter = (filterOptions) => {
    const filteredCollections = filterCollections(originalCollections, filterOptions);
    updateCollections(filteredCollections);
  };

  const filterCollections = (collections, filterOptions) => {
    const filteredCollections = collections.filter(collection => {
      return (
        (!filterOptions.selectedCategory || collection.category_id === filterOptions.selectedCategory) &&
        (!filterOptions.hasImage || collection.image_url !== null) &&
        (!filterOptions.hasItems || collection.items.length > 0) &&
        (!filterOptions.hasCustomFields || isCollectionHasCustomFields(collection))
      );
    });
    return filteredCollections;
  };

  const isCollectionHasCustomFields = (collection) => {
    return Object.keys(collection).some((field) => {
      return field.startsWith('custom') && field.endsWith('name') && collection[field] !== '';
    });
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
    {loading ? ( 
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" />
      </div>
    ) : ( 
    <>
      <div className="d-flex justify-content-md-between flex-column flex-md-row align-items-start gap-1 gap-md-0">
          <SortDropdown onSelect={onSelect} sortMethod={sortMethod}/>
          {isAuthenticated && 
            <Link to="/collection/create" className="btn mb-4">
              {t('Create collection')}
            </Link>
          }
          {isMobile && (
            <Button className="btn" variant="secondary" onClick={toggleFilters}>
              {t('Filters')}
            </Button>
          )}
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between">
        {showFilters && <CollectionFilter onApplyFilter={onApplyFilter} />}
        <div className={isMobile ? "w-100 mt-3" : "ms-4 w-100"}>
          {userCollections.length > 0 ? userCollections.map(collection => (
            <CollectionItem
            key={collection.id}
            collection={collection}
            updateCollections={updateCollections}
            isOwner={isAuthenticated && userId === collection.user_id}
            />
          )): (
            <p className="h3" style={{fontSize: "3rem", opacity: '0.5', textAlign: "center"}}>
              {t('There is nothing here yet')}<br />
              <i class="bi bi-emoji-frown"></i>
            </p>
          )}
        </div>
      </div>
    </>
    )}
    </>
  )
}

export default UserCollections