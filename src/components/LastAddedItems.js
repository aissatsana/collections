import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LastAddedItems = ({items}) => {
    const { t } = useTranslation();
    return (
        <>
        <h3>{t('Recently added collections')}</h3>
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
                        <Link to={`/item/${item.id}`} className='link'>
                          {item.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/collection/${item.collections.id}`} className='link'>
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