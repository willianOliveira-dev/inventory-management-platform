import { Link } from 'react-router-dom';
import { type ButtonLink } from '../../types';

export default function ButtonLink({ to, text }: ButtonLink) {
    return <Link className='border-2 border-purple-600 text-purple-600 text-center px-8 py-3 rounded-lg font-medium transition-all duration-700 hover:bg-violet-600 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50' to={to}>{text}</Link>;
}
