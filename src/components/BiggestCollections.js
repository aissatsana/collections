import React, { useState, useEffect} from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Table } from "react-bootstrap";

const BiggestCollections = () => {
    const { t } = useTranslation();
    const [collections, setCollections] = useState([]);
    useEffect(() => {
        const fetchCollections = async () => {
          try {
            const response = await axios.get('/api/collection/getTop');
            setCollections(response.data.collections);
          } catch (error) {
            console.error('Error fetching collections: ', error);
          }
        }
        fetchCollections();
    }, [])
    return (
      <>
        <h3>{t('5 biggest collections')}</h3>
          {collections.length > 0 ? (
            <div className='w-100'>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>{t('Name')}</th>
                    <th>{t('Count Items')}</th>
                    <th>{t('Username')}</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id}>
                      <td>
                        <Link to={`/collection/${collection.id}`}>
                          {collection.name}
                        </Link>
                      </td>
                      <td>
                        {collection.itemCount}
                      </td>
                      <td>
                        {collection.username}
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
export default BiggestCollections;