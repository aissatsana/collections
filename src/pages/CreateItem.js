import React, { useState } from 'react';
import { Container, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const CreateItem = () => {
  const [itemName, setItemName] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const collection = location.state?.collection || {};
  const [fieldValues, setFieldValues] = useState({});

  const handleChange = (fieldName, value, fieldType) => {
    setFieldValues((prevFieldValues) => ({
      ...prevFieldValues,
      [fieldName]: {value: value, name: fieldName, type: fieldType},
    }));
  };


  const handleCreateItem = async () => {
    try {
      console.log(itemName);
      console.log(fieldValues);
      const response = await axios.post(`/api/collection/${collection.id}/items`, {
        name: itemName,
        tags,
        fieldValues,
      });
      console.log(response.data); 
      navigate(`/collection/${collection.id}`);
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

        <Form.Group controlId="tags">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>

        {Object.keys(collection).map((field) => {
          if (field.startsWith('custom_') && collection[field] && field.endsWith('state')) {
            const fieldType = field.split('_')[1].slice(0,-1);
            const fieldName = collection[field.slice(0,-5)+'name'];
            return renderField(fieldName, fieldType);
          }
          return null;
        })}
        <Button variant="primary" onClick={handleCreateItem}>
          Create Item
        </Button>
      </Form>
    </Container>
    )
}

export default CreateItem;