import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CategorySelector = ({ onSelect, currentCategory }) => {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/data/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching themes:', error);
      }
    };
    fetchCategories();
  }, []);

  const getTitle = () => {
    if (currentCategory && categories && categories.length > 0) {
      const categoryObj = categories.find((cat) => cat.id === currentCategory);
      if (categoryObj) {
        return t(categoryObj.name);
      }
    }
    return t('Select category');
  };


  return (
    <DropdownButton className="me-4" id="category-dropdown" variant="secondary" title={getTitle()} onSelect={onSelect}>
      {categories.map((category) => (
        <Dropdown.Item key={category.id} eventKey={category.id}>
          {t(category.name)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default CategorySelector;
