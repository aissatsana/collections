import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LastAddedItems from '../components/LastAddedItems';
import BiggestCollections from '../components/BiggestCollections';
import TagsCloud from '../components/TagsCloud';


function Main () {
    const { t } = useTranslation();
    return (
        <Container className="mt-3">
            <div className='d-flex flex-column flex-md-row justify-content-between'>
                <div className='col-md-6 mb-3 mb-md-0"'>
                    <h1>{t('Welcome to My Collection!')}</h1>
                    <p>{t('Create your unique collections with ease and style.')}</p>
                    <p>{t('My Collection is your personal assistant for organizing and visualizing your favorite items, artifacts, and memories. We provide you with an intuitive and appealing interface to manage your collections.')}</p>
                </div>
                <div className='col-md-5'>
                    <BiggestCollections />
                </div>
            </div>
            <LastAddedItems />
            <TagsCloud />
        </Container>
    )
}

export default Main;