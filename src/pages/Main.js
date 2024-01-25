import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LastAddedItems from '../components/LastAddedItems';
import BiggestCollections from '../components/BiggestCollections';
import TagsCloud from '../components/TagsCloud';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Main() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [tagsData, setTagsData] = useState([]);
  const [biggestCollectionsData, setBiggestCollectionsData] = useState([]);
  const [lastAddedItemsData, setLastAddedItemsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagsResponse = await axios.get('/api/items/tags');
        const biggestCollectionsResponse = await axios.get('/api/collection/getTop');
        const lastAddedItemsResponse = await axios.get('/api/items/lastadded');

        setTagsData(tagsResponse.data.tags);
        console.log(biggestCollectionsResponse.data);
        setBiggestCollectionsData(biggestCollectionsResponse.data.collections);
        setLastAddedItemsData(lastAddedItemsResponse.data.latestItems);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="mt-3">
      {loading ? (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="d-flex flex-column flex-md-row justify-content-between">
            <div className="col-md-6 mb-3 mb-md-0">
              <h1>{t('Welcome to My Collection!')}</h1>
              <p>{t('Create your unique collections with ease and style.')}</p>
              <p>{t('My Collection is your personal assistant for organizing and visualizing your favorite items, artifacts, and memories. We provide you with an intuitive and appealing interface to manage your collections.')}</p>
              <Link to="/collections"className="my-2 btn">
                {t('Browse collections')}
              </Link>
            </div>
            <div className="col-md-5">
              <BiggestCollections collections={biggestCollectionsData} />
            </div>
          </div>
          <LastAddedItems items={lastAddedItemsData} />
          <TagsCloud tags={tagsData.map(tag => ({ value: tag.name, count: 1 }))} />
        </>
      )}
    </Container>
  );
}

export default Main;
