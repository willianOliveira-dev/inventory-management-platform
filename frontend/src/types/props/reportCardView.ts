import { type JSX } from 'react';

export interface ReportCardView <T>{
    label: string;
    data: T;
    description: string;
    icon: JSX.Element;
}
