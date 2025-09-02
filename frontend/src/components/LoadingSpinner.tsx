import { type LoadingSpinnerProps } from '../types';

export default function LoadingSpinner({
    size = 'md',
    className = '',
}: LoadingSpinnerProps) {
    const sizeMap = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${sizeMap[size]} border-4 border-violet-800 border-t-violet-400 rounded-full animate-spin`}
            ></div>
        </div>
    );
}
