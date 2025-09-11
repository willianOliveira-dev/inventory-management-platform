import { Link } from 'react-router-dom';
import { type ButtonLink } from '../../types';

export default function ButtonLink({
    to,
    text,
    className = '',
    onClick = undefined,
    icon = undefined,
}: ButtonLink) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={className}
            aria-current="page"
        >
            {icon && icon}
            <span>{text}</span>
        </Link>
    );
}
