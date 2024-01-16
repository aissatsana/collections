import { Container, Tab, Tabs } from 'react-bootstrap';
import MyCollections from '../components/MyCollections';


function Profile () {
    return (
            <Container className="mt-3">
                <h1>Inner page</h1>
                <Tabs defaultActiveKey="collections" id="profile-menu" className="mb-3">
                    <Tab eventKey="collections" title="Collections">
                        <MyCollections />
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        Tab content for Profile
                    </Tab>
                </Tabs>
            </Container>
    )
}

export default Profile;