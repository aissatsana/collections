import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CollectionItem from "./CollectionItem";
import CollectionFilter from "./CollectionFilter";
import SortDropdown from "./SortDropdown";
import { Button } from "react-bootstrap";

function UserCollections () {
  const { t } = useTranslation();
  const [userCollections, setUserCollections] = useState([]);
  const [originalCollections, setOriginalCollections] = useState([]);
  const [sortMethod, setSortMethod] = useState('name'); 
  const isMobile = window.innerWidth <= 768;
  const [showFilters, setShowFilters] = useState(!isMobile);

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
        setOriginalCollections(response.data.collections);
        setUserCollections(sortCollections(response.data.collections));
      } catch (error) {
        console.error('Error fetching user collections:', error);
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
        (!filterOptions.hasItems || collection.hasitems) &&
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
      <div className="d-flex justify-content-between">
        {/* <h2>{t('Your collections')}:</h2> */}
        <div className="d-flex">
          <SortDropdown onSelect={onSelect} sortMethod={sortMethod}/>
          <Link to="/collection/create" className="btn mb-4">
            {t('Create collection')}
          </Link>
          {isMobile && (
            <Button className="btn" onClick={toggleFilters}>
              {t('Filters')}
            </Button>
          )}
        </div>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between">
        <div>
          {showFilters && <CollectionFilter onApplyFilter={onApplyFilter} />}
        </div>
        <div className={isMobile ? "w-100 mt-3" : "ms-4 w-100"}>
          {userCollections && userCollections.map(collection => (
            <CollectionItem
            key={collection.id}
            collection={collection}
            updateCollections={updateCollections}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default UserCollections