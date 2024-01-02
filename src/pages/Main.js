import { Container } from 'react-bootstrap';
import Header from '../components/Header';

function Main () {
    return (
        <div className="App">
        <Header />
        <Container className="mt-3">
            <h1>My Collection</h1>
            <p>Some content</p>
        </Container>
        </div>
    )
}

export default Main;