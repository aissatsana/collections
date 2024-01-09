import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import CategorySelector from '../components/CategorySelector';

function CreateCollection() {
  const { t } = useTranslation();
  const [collectionInfo, setCollectionInfo] = useState({
    name: '',
    description: '',
    category: null,
    image: null,
    fields: {
      string: ['','',''],
      integer: ['', '', ''],
      text: ['', '', ''],
      boolean: ['', '', ''],
      date: ['', '', ''],
    },
  });

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollectionInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'category' ? Number(value) : value,
    }));
  };

  const handleImageUpload = (e) => {
    setCollectionInfo((prevInfo) => ({
      ...prevInfo,
      image: e.target.files[0],
    }));
  };

  const handleFieldChange = (type, fieldIndex, fieldName) => {
    setCollectionInfo((prevInfo) => ({
      ...prevInfo,
      fields: {
        ...prevInfo.fields,
        [type]: [...prevInfo.fields[type].slice(0, fieldIndex), fieldName, ...prevInfo.fields[type].slice(fieldIndex + 1)],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;
      if (collectionInfo.image) {
        const formData = new FormData();
        formData.append('image', collectionInfo.image);
        const response = await fetch('/collection/uploadImage', {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
        imageUrl = result.imageUrl; 
      }

      const updatedCollectionInfo = {
        ...collectionInfo,
        image: imageUrl,
      };
  
      const createCollectionResponse = await fetch('/collection/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCollectionInfo),
      });
  
      const createCollectionResult = await createCollectionResponse.json();
      console.log(createCollectionResult);
    } catch (error) {
      console.error('Error uploading collection:', error);
    }
  };
  

  const renderFieldSelector = (type, label) => {
    return (
      <Form.Group controlId={`fields.${type}`}>
        <Form.Label className="text-uppercase">{t(label)}</Form.Label>
        {collectionInfo.fields[type].map((field, index) => (
          <div key={index} className="mb-3 d-flex align-items-end">
          <Form.Label className="w-25">{`${t('Name for Field')} ${index + 1}:`}</Form.Label>
          <Form.Control
            type='string'
            name={type}
            value={field}
            placeholder={`${t(`Enter name for ${type.toLowerCase()} field`)} ${index + 1}`}
            onChange={(e) => handleFieldChange(type, index, e.target.value)}
          />
        </div>
        ))}
      </Form.Group>
    );
  };

  return (
    <Container className="mt-3">
      <h1>Create Collection</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>{t('Name')}:</Form.Label>
          <Form.Control type="text" name="name" value={collectionInfo.name} onChange={handleInputChange} required />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>{t('Description')}:</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={collectionInfo.description} onChange={handleInputChange} required />
        </Form.Group>
        <div className="d-flex my-4">
          <Form.Group controlId="category" className="d-flex align-items-end">
            <Form.Label className="me-2">{t('Category')}:</Form.Label>
            <CategorySelector currentCategory={collectionInfo.category} onSelect={(selectedCategory) => handleInputChange({ target: { name: 'category', value: selectedCategory }})} />
          </Form.Group>

          <Form.Group controlId="image" className="d-flex align-items-end">
            <Form.Label className="me-2">{t('Image')}:</Form.Label>
            <Form.Control className="me-4" type="file" name="image" onChange={handleImageUpload} />
          </Form.Group>
        </div>

        {renderFieldSelector('string', 'String fields')}
        {renderFieldSelector('integer', 'Number fields')}
        {renderFieldSelector('text', 'Text fields')}
        {renderFieldSelector('boolean', `Yes/No fields`)}
        {renderFieldSelector('date', 'Date fields')}
        <Button variant="primary" type="submit">
          {t('Create collection')}
        </Button>
      </Form>
    </Container>
  );
}

export default CreateCollection;
