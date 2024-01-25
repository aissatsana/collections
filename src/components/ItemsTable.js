import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SortDropdown from './SortDropdown';
import ItemFilter from './ItemFilter';
import { useTheme } from '../contexts/ThemeContext';

const ItemsTable = ({ originalItems, isOwner, collection, collectionId, fieldNames }) => {
  const [sortMethod, setSortMethod] = useState('name');
  const { theme } = useTheme();
  const [userItems, setUserItems] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    setUserItems(sortItems(originalItems, sortMethod));
  }, [originalItems, sortMethod]);
  
  const updateItems = (items) => {
    setUserItems(items);
  }

  const handleDelete = async (itemId) => {
        try {
          const response = await fetch(`/api/items/${itemId}`, {
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
  };
  const sortItems = (items, method) => {
    console.log(items);
    const sortFunctions = {
      name: (a, b) => a.name.localeCompare(b.name),
      'create-date': (a, b) => new Date(a.created_at) - new Date(b.created_at),
      'update-date': (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    };
    return [...items].sort(sortFunctions[method]);
  };

  const onApplyFilter = (filterOptions) => {
    const filteredItems = filterItems(originalItems, filterOptions);
    updateItems(filteredItems);
  };

  const filterItems = (items, filterOptions) => {
    const filteredItems = items.filter(item => {
      return (
        (!filterOptions.hasComments || item.comments.length > 0) &&
        (!filterOptions.countLikes || item._count.likes >= filterOptions.countLikes) 
      );
    });
    return filteredItems;
  };
  return (
    <Row className="mt-4">
      <Col>
        <div className='d-flex justify-content-between mb-4'>
          <h3>{t('Items')}</h3>
          <div className='d-flex align-items-start'>
            <SortDropdown onSelect={onSelectSort} sortMethod={sortMethod} />
            {isOwner && (
              <Link to={`/collection/${collectionId}/item`} state={{collection}}  className="btn btn-secondary">
                {t('Add new item')}
              </Link>
            )}
          </div>
        </div>
        <div className='d-flex justify-content-between'>
        <ItemFilter onApplyFilter={onApplyFilter}/>
        {userItems.length > 0 ? (
          <div className='w-100'>
            <Table striped bordered hover responsive variant={theme}>
              <thead>
                <tr>
                  <th>{t('Name')}</th>
                  {fieldNames.length > 0 && fieldNames.map((field) => (
                    <th>{field}</th>
                  ))}
                  {isOwner && ( 
                    <>
                      <th></th>
                      <th></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {userItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/item/${item.id}`} className="link">
                        {item.name}
                      </Link>
                    </td>
                    {fieldNames.length > 0 && fieldNames.map((fieldName) => (
                    <td key={fieldName}>
                      {item.items_custom_fields.find(field => field.field_name === fieldName)?.field_value || ''}
                    </td>
                    ))}
                    {isOwner && (
                      <>
                      <td>
                        <Link to={`/collection/${collectionId}/edit/${item.id}`} state={{collection}} className="btn btn-secondary">
                          <span className="visually-hidden">{t('Edit')}</span>
                          <i class="bi bi-pencil"></i>
                        </Link>
                      </td>
                      <td>
                        <Button onClick={() => handleDelete(item.id)} className="btn btn-secondary ml-2">
                          <span className='visually-hidden'>{t('Delete')}</span>
                          <i class="bi bi-trash"></i>
                        </Button>
                      </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p className="h3" style={{fontSize: "3rem", opacity: '0.5', textAlign: "center"}}>
            {t('There is nothing here yet')}<br />
            <i class="bi bi-emoji-frown"></i>
          </p>
        )} 
        </div>
      </Col>
    </Row>
  );
};

export default ItemsTable;
