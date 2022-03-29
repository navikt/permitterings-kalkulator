import { FunctionComponent, useEffect } from 'react';
import {
    onBreadcrumbClick,
    setBreadcrumbs,
} from '@navikt/nav-dekoratoren-moduler';
import { useHistory } from 'react-router';

interface Props {
    brødsmuler: any[];
}

export const Brødsmulesti: FunctionComponent<Props> = ({ brødsmuler }) => {
    const history = useHistory();

    useEffect(() => {
        setBreadcrumbs(brødsmuler);
        onBreadcrumbClick((breadcrumb) => history.push(breadcrumb.url));
    }, [brødsmuler]);

    return null;
};
