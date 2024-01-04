import { Container, Tab, Tabs } from 'react-bootstrap';
import Collections from '../components/Collections';


function Profile () {
    return (
            <Container className="mt-3">
                <h1>Inner page</h1>
                <Tabs defaultActiveKey="collections" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="collections" title="Collections">
                        <Collections />
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        Tab content for Profile
                    </Tab>
                </Tabs>
            </Container>
    )
}

export default Profile;