import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MyCollections () {
    const { t } = useTranslation();
    return (
        <Link to="/create-collection" className="btn">
        {t('Create collection')}
      </Link>
    )
}

export default MyCollections