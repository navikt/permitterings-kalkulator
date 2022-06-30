import { FunctionComponent, useEffect } from 'react';
import {
    onBreadcrumbClick,
    setBreadcrumbs,
} from '@navikt/nav-dekoratoren-moduler';
import { useNavigate } from 'react-router';

export interface Brodsmule {
    url: string;
    title: string;
    handleInApp: boolean;
}

interface BrodsmuleProps {
    brodsmuler: Brodsmule[];
}

export const Brodsmulesti = ({ brodsmuler }: BrodsmuleProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        setBreadcrumbs(brodsmuler);
        onBreadcrumbClick((breadcrumb) => {
            if(breadcrumb.handleInApp) {
                navigate(breadcrumb.url)
            } else {
                window.location.href = breadcrumb.url
            }
        } );
    }, [brodsmuler]);

    return null;
};
