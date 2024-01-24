import { Container, Tab, Tabs } from 'react-bootstrap';
import UserCollections from '../components/UserCollections';
import { useTranslation } from 'react-i18next';
import ChangeUserInfo from '../components/ChangeUserInfo';


function Profile () {
    const { t } = useTranslation();
    return (
            <Container className="mt-3">
                <h1 className='visually-hidden'>{t('Profile')}</h1>
                <Tabs defaultActiveKey="collections" id="profile-menu" className="mb-3">
                    <Tab eventKey="collections" title={t('Collections')}>
                      <UserCollections />
                    </Tab>
                    <Tab eventKey="profile" title={t('Profile')}>
                      <ChangeUserInfo />
                    </Tab>
                </Tabs>
            </Container>
    )
}

export default Profile;