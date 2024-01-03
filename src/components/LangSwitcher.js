import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useState } from "react";

function LangSwitcher () {
    const [language, setLanguage] = useState('en');
    const toggleLanguage = () => {

    }
    return (
        <Dropdown as={ButtonGroup} className="ms-auto me-4">
        <Dropdown.Toggle variant="secondary" id="language-dropdown">
            {language === 'en' ? 'English' : 'Русский'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={toggleLanguage}>English</Dropdown.Item>
            <Dropdown.Item onClick={toggleLanguage}>Русский</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    )   
}

export default LangSwitcher;