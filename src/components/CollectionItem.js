import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from 'react-bootstrap';


function CollectionItem ({ collection, updateCollections }) {
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
    <div className="d-flex align-items-center">
      <img
        src={collection.image_url}
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
      <Link to={`/create-collection/${collection.id}`} className="btn btn-primary ms-auto">
          {t('Edit')}
      </Link>
      <Button className="btn btn-primary ms-2" onClick={handleDelete}>
          {t('Delete')}
      </Button>
    </div>
)};


export default CollectionItem;
