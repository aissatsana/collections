import { Container, Tab, Tabs } from 'react-bootstrap';


function Profile () {
    return (
            <Container className="mt-3">
                <h1>Inner page</h1>
                <Tabs defaultActiveKey="collections" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="collections" title="Collections">
                        Tab content for Home
                    </Tab>
                    <Tab eventKey="profile" title="Profile">
                        Tab content for Profile
                    </Tab>
                </Tabs>
            </Container>
    )
}

export default Profile;