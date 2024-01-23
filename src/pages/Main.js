import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LastAddedItems from '../components/LastAddedItems';

function Main () {
    const { t } = useTranslation();
    return (
        <Container className="mt-3">
            <h1>My Collection</h1>
            <p>{t(`Welcome to My Collection!
Create your unique collections with ease and style. My Collection is your personal assistant for organizing and visualizing your favorite items, artifacts, and memories. We provide you with an intuitive and appealing interface to manage your collections.`)}</p>
            <LastAddedItems />
        </Container>
    )
}

export default Main;