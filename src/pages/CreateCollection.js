import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CategorySelector from '../components/CategorySelector';
import axios from 'axios';

function CreateCollection() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { collectionId } = useParams();
  const [collectionInfo, setCollectionInfo] = useState({
    name: '',
    description: '',
    category_id: null,
    image: null,
    fields: {
      string: ['','',''],
      int: ['', '', ''],
      text: ['', '', ''],
      boolean: ['', '', ''],
      date: ['', '', ''],
    },
  });

  useEffect(() => {
    if (collectionId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/collection/${collectionId}`);
          const collection = response.data.collection;
          let updatedCollectionInfo = {};
          updatedCollectionInfo.name = collection.name;
          updatedCollectionInfo.description = collection.description;
          updatedCollectionInfo.category_id = collection.category_id;
          updatedCollectionInfo.image = collection.image_url;
          console.log(updatedCollectionInfo.image);
          updatedCollectionInfo.fields = {
            string: ['','',''],
            int: ['', '', ''],
            text: ['', '', ''],
            boolean: ['', '', ''],
            date: ['', '', ''],
          };
          for (let el in collection) {
            if (el.startsWith('custom') && el.endsWith('name') && collection.el !== '') {
              const field = el.split('_')[1];
              const fieldType = field.slice(0, -1);
              const index = parseInt(field.slice(-1)) - 1;
              updatedCollectionInfo.fields[fieldType][index] = collection[el];
              }
          }
          setCollectionInfo((prevInfo) => ({
            ...prevInfo,
            ...updatedCollectionInfo,
          }));
          setLoading(false);
        } catch (error) {
          console.error('Error fetching collection:', error);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [collectionId]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollectionInfo((prevInfo) => ({
      ...prevInfo,
      [name]: name === 'category_id' ? Number(value) : value,
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
      let apiUrl = '/api/collection/create';
      if (collectionId) {
        apiUrl = `/api/collection/update/${collectionId}`;
      }
      console.log(collectionInfo)
      const token = JSON.parse(localStorage.getItem('token'));
      const createCollectionResponse = await axios.post(apiUrl, collectionInfo, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (createCollectionResponse.status === 200) {
        navigate('/profile');
      }
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
    <>
    {loading ? (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Spinner animation="border" />
    </div>
    ) : (
    <Container className="mt-3">
      <h1>{collectionId ? t("Edit Collection") : t("Create Collection")}</h1>
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
          <Form.Group controlId="category_id" className="d-flex align-items-end">
            <Form.Label className="me-2">{t('Category')}:</Form.Label>
            <CategorySelector 
              currentCategory={collectionInfo.category_id} 
              onSelect={(selectedCategory) => handleInputChange({ target: { name: 'category_id', value: selectedCategory }})}
            />
          </Form.Group>

          <Form.Group controlId="image" className="d-flex align-items-end">
            <Form.Label className="me-2">{t('Image')}:</Form.Label>
            <Form.Control className="me-4" type="file" name="image" onChange={handleImageUpload} />
            {collectionInfo.image && (
              <img
                src={typeof collectionInfo.image === 'string' ? collectionInfo.image : URL.createObjectURL(collectionInfo.image)}
                alt="Collection Thumbnail"
                style={{ maxHeight: '100px', maxWidth: '100px', objectFit: 'cover' }}
              />
            )}
          </Form.Group>
        </div>

        {renderFieldSelector('string', 'String fields')}
        {renderFieldSelector('int', 'Number fields')}
        {renderFieldSelector('text', 'Text fields')}
        {renderFieldSelector('boolean', `Yes/No fields`)}
        {renderFieldSelector('date', 'Date fields')}
        <Button variant="secondary" type="submit">
          {collectionId ? t("Update Collection") : t('Create collection')}
        </Button>
      </Form>
    </Container>
    )}
    </>
  );
}

export default CreateCollection;
