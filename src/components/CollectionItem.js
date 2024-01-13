import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function CollectionItem ({ collection }) {
    const { t } = useTranslation();
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
      <Link to={`/collection/edit/${collection.id}`} className="btn btn-primary ms-auto">
          {t('Edit')}
      </Link>
    </div>
)};


export default CollectionItem;
