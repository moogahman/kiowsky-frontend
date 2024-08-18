import { Link } from 'react-router-dom';
import type { CategoryTabProps } from '../../../types';

function Tab({ title, link, Icon }: CategoryTabProps) {
    return (
        <Link to={link} className="link1">
            <div>
                <Icon className="icon" size={35} />
                <h1>{title}</h1>
            </div>
        </Link>
    );
}

export default Tab;