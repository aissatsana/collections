import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';


const CreateItem = () => {
  const { t } = useTranslation();
  const [itemName, setItemName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { collectionId, itemId } = useParams(); 
  const collection = location.state?.collection || {};
  const [fieldValues, setFieldValues] = useState({});
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const handleChange = (fieldName, value, fieldType) => {
    setFieldValues((prevFieldValues) => ({
      ...prevFieldValues,
      [fieldName]: {value: value, name: fieldName, type: fieldType},
    }));
  };
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('/api/items/tags'); 
        setTags(response.data.tags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []); 
  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  useEffect(() => {
    if (itemId) {
      const fetchItemData = async () => {
        try {
          const response = await axios.get(`/api/items/${itemId}`);
          const itemData = response.data.item;
          const fieldsData = response.data.fields;
          setItemName(itemData.name);
          fieldsData.forEach(el => {
            handleChange(el.field_name, el.field_value, el.field_type)
          });
        } catch (error) {
          console.error('Error fetching item data:', error);
        }
      };
      fetchItemData();
    }
  }, [collectionId, itemId]);


  const handleCreateItem = async () => {
    let apiUrl = `/api/items/${collection.id}/items`;
    if (itemId) {
      apiUrl = `/api/items/${collection.id}/item/${itemId}/update`;
    }
    try {
      const response = await axios.post(apiUrl, {
        name: itemName,
        tags,
        fieldValues,
      });
      if (response.status === 200) {
        navigate(`/collection/${collection.id}`);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const renderField = (fieldName, fieldType) => {
    switch (fieldType) {
      case 'string':
      case 'integer':
      case 'text':
        return (
          <Form.Group key={fieldName} controlId={fieldName}>
            <Form.Label>{fieldName}</Form.Label>
            <Form.Control
              type={fieldType === 'integer' ? 'number' : 'text'}
              placeholder={`Enter ${fieldName}`}
              value={fieldValues[fieldName]?.value || ''}
              onChange={(e) => handleChange(fieldName, e.target.value, fieldType)}
            />
          </Form.Group>
        );
      case 'date':
        return (
          <Form.Group key={fieldName} controlId={fieldName}>
            <Form.Label>{fieldName}</Form.Label>
            <Form.Control
              type="date"
              value={fieldValues[fieldName]?.value || ''}
              onChange={(e) => handleChange(fieldName, e.target.value, fieldType)}
            />
          </Form.Group>
        );
      case 'boolean':
        return (
          <Form.Group key={fieldName} controlId={fieldName}>
            <Form.Check
              type="checkbox"
              label={fieldName}
              value={fieldValues[fieldName]?.value || false}
              onChange={(e) => handleChange(fieldName, e.target.checked, fieldType)}
            />
          </Form.Group>
        );
      default:
        return null;
    }
  };

    return (
        <Container>
      <h2>Create Item</h2>
      <Form>
        <Form.Group controlId="itemName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </Form.Group>
       
        {/* tags */}




        {Object.keys(collection).map((field) => {
          if (field.startsWith('custom_') && collection[field] && field.endsWith('state')) {
            const fieldType = field.split('_')[1].slice(0,-1);
            const fieldName = collection[field.slice(0,-5)+'name'];
            return renderField(fieldName, fieldType, fieldValues);
          }
          return null;
        })}

        <Button variant="primary" className="mt-2" onClick={handleCreateItem}>
          {itemId ? t('Update item'): t('Create Item')} 
        </Button>
      </Form>
    </Container>
    )
}

export default CreateItem;