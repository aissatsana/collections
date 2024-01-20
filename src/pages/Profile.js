import { Container, Tab, Tabs } from 'react-bootstrap';
import UserCollections from '../components/UserCollections';
import { useTranslation } from 'react-i18next';


function Profile () {
    const { t } = useTranslation();
    return (
            <Container className="mt-3">
                <h1>Inner page</h1>
                <Tabs defaultActiveKey="collections" id="profile-menu" className="mb-3">
                    <Tab eventKey="collections" title={t('Collections')}>
                        <UserCollections />
                    </Tab>
                    <Tab eventKey="profile" title={t('Profile')}>
                        Tab content for Profile
                    </Tab>
                </Tabs>
            </Container>
    )
}

export default Profile;