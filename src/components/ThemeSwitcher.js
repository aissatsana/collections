import { Button } from "react-bootstrap";
import { useTheme } from '../contexts/ThemeContext';

function ThemeSwitcher () {
    const { theme, toggleTheme } = useTheme();
    const onToggleTheme = () => {
        toggleTheme(theme === 'light' ? 'dark' : 'light');
    }
    return (
        <div className="me-lg-4">
          <Button className="ms-2" variant="secondary" onClick={onToggleTheme}>
            {theme === 'light' ? (
                <i className="bi bi-moon"></i>
            ) : (
                <i className="bi bi-brightness-high"></i>
            )}
          </Button>
      </div>
    )
}

export default ThemeSwitcher;