import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';


function CollectionItem ({ collection, updateCollections, isOwner }) {
    const { t } = useTranslation();
    const handleDelete = async () => {
      try {
        const deleteCollectionResponse = await fetch(`/api/collection/delete/${collection.id}`, {
          method: 'DELETE',
        });
        if (deleteCollectionResponse.ok) {
          updateCollections((prevCollections) =>
          prevCollections.filter((c) => c.id !== collection.id)
        );
        }
      } catch (error) {
        console.error('Error deleting collection:', error);
      }
    };
    return (
    <div className="d-flex align-items-center mb-4">
      <img
        src={collection.image_url ?  collection.image_url : 'img/default-collection.webp'}
        alt={collection.name}
        style={{ width: '100px', height: '100px', marginRight: '16px', border: '2px solid black', }}
        className="rounded-circle"
      />
      <div>
        <h3>
          <Link to={`/collection/${collection.id}`} className="text-decoration-none">
            {collection.name}
          </Link>
        </h3>
        <p>{collection.description}</p>
      </div>
      {isOwner && (
        <div className="d-flex flex-column ms-auto">
          <Link to={`/collection/edit/${collection.id}`} className="btn  btn-secondary mb-2">
            <span className='visually-hidden'>{t('Edit')}</span>
            <i class="bi bi-pencil"></i>
          </Link>
          <Button className="btn btn-secondary" onClick={handleDelete}>
            <span className='visually-hidden'>{t('Delete')}</span>
            <i class="bi bi-trash"></i>
          </Button>
        </div>

      )}
    </div>
)};


export default CollectionItem;
