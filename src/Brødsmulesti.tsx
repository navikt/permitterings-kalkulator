import { FunctionComponent, useEffect } from 'react';
import {
    Breadcrumb,
    onBreadcrumbClick,
    setBreadcrumbs,
} from '@navikt/nav-dekoratoren-moduler';
import { useNavigate } from 'react-router';

interface Props {
    brødsmuler: Breadcrumb[];
}

export const Brødsmulesti: FunctionComponent<Props> = ({ brødsmuler }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setBreadcrumbs(brødsmuler);
        onBreadcrumbClick((breadcrumb) => {
            if(breadcrumb.handleInApp) {
                navigate(breadcrumb.url)
            } else {
                window.location.href = breadcrumb.url
            }
        } );
    }, [brødsmuler]);

    return null;
};
