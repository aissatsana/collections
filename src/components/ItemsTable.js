import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SortDropdown from './SortDropdown';

const ItemsTable = ({ items, isOwner, updateItems, collection, collectionId }) => {
  const [sortMethod, setSortMethod] = useState('name');
  const { t } = useTranslation();
  const handleDelete = async (itemId) => {
        try {
          const response = await fetch(`/api/collection/${collectionId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            updateItems((prevItems) =>
            prevItems.filter((i) => i.id !== itemId)
          );
            console.log('Item deleted successfully');
          } else {
            console.error('Failed to delete item');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
  };
  const onSelectSort = (eventKey) => {
    setSortMethod(eventKey);
    updateItems((prevCollections) => sortItems(prevCollections, eventKey));
  };
  const sortItems = (items, method) => {
    const sortFunctions = {
      name: (a, b) => a.name.localeCompare(b.name),
      'create-date': (a, b) => new Date(a.created_at) - new Date(b.created_at),
      'update-date': (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    };
    return items.sort(sortFunctions[method]);
  };
  return (
    <Row className="mt-4">
      <Col>
        <div className='d-flex justify-content-between mb-4'>
          <h3>{t('Items')}</h3>
          <div className='d-flex'>
            <SortDropdown onSelect={onSelectSort} sortMethod={sortMethod} />
            {isOwner && (
              <Link to={`/collection/${collectionId}/item`} state={{collection}}  className="btn">
                {t('Add New Item')}
              </Link>
            )}
          </div>
        </div>
        {items.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>{t('Name')}</th>
                {isOwner && <th>{t('Actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  {isOwner && (
                    <td>
                      <Link to={`/collection/${collectionId}/edit/${item.id}`} state={{collection}} className="btn btn-secondary">
                        {t('Edit')}
                      </Link>
                      <Button variant="danger" onClick={() => handleDelete(item.id)} className="btn ml-2">
                        {t('Delete')}
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Пока здесь ничего нет</p>
        )}
      </Col>
    </Row>
  );
};

export default ItemsTable;
