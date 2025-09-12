import { type JSX } from 'react';

export interface ButtonLink {
    to: string;
    text?: string;
    className?: string;
    onClick?: () => void;
    icon?: JSX.Element;
}
