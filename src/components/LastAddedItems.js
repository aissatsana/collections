import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LastAddedItems = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    useEffect(() => {
        const fetchItems = async() => {
          try {
            const response = await axios.get('/api/items/lastadded');
            setItems(response.data.latestItems);
          } catch (error) {
            console.error(error);
          }  
        }
        fetchItems();
    }, [])
    return (
        <>
        <h3>{t('5 last added collections')}</h3>
        {items.length > 0 ? (
            <div className='w-100'>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>{t('Name')}</th>
                    <th>{t('Collection')}</th>
                    <th>{t('Username')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/item/${item.id}`}>
                          {item.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/collection/${item.collections.id}`}>
                          {item.collections.name}
                        </Link>
                      </td>
                      <td>
                        {item.users.username}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>Пока здесь ничего нет</p>
          )} 
    </>
    )
}
export default LastAddedItems;