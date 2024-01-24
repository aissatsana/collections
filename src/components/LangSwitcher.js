import { Dropdown, ButtonGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function LangSwitcher () {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };
    
    return (
        <Dropdown as={ButtonGroup} className="ms-lg-auto me-lg-4">
        <Dropdown.Toggle variant="secondary" id="language-dropdown">
            {i18n.language === 'en' ? 'English' : 'Русский'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
            <Dropdown.Item onClick={() => changeLanguage('ru')}>Русский</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
    )   
}

export default LangSwitcher;