import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import CollectionItem from "./CollectionItem";
import CollectionFilter from "./CollectionFilter";
import { DropdownButton, Dropdown } from "react-bootstrap";

function MyCollections () {
  const { t } = useTranslation();
  const [userCollections, setUserCollections] = useState([]);
  const [originalCollections, seOriginalCollections] = useState([]);
  const [sortMethod, setSortMethod] = useState('name'); 

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
        seOriginalCollections(response.data.collections);
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
    console.log("Applying filter with options:", filterOptions);
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

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>{t('Your collections')}:</h2>
        <div className="d-flex">
          <DropdownButton className="me-4" id="sort-collection" title={`Sort by ${sortMethod}`} onSelect={onSelect}>
            <Dropdown.Item key="name" eventKey='name'>
              {t('By name')}
            </Dropdown.Item>
            <Dropdown.Item key="create-date" eventKey="create-date">
              {t('By created date')}
            </Dropdown.Item>
            <Dropdown.Item key="update-date" eventKey="update-date">
              {t('By updated date')}
            </Dropdown.Item>
          </DropdownButton>
          <Link to="/collection/create" className="btn mb-4">
            {t('Create collection')}
          </Link>
        </div>
      </div>
      <div className="d-flex justify-content-space-between">
        <div className="col-md-9">
          {userCollections && userCollections.map(collection => (
            <CollectionItem
            key={collection.id}
            collection={collection}
            updateCollections={updateCollections}
            />
          ))}
        </div>
        <div className="col-md-3">
            <CollectionFilter onApplyFilter={onApplyFilter}/>
        </div>
      </div>
    </>
  )
}

export default MyCollections