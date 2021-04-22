import {FunctionComponent, useEffect} from 'react';
import {Breadcrumb, onBreadcrumbClick, setBreadcrumbs,} from '@navikt/nav-dekoratoren-moduler';
import {useHistory} from 'react-router';

interface Props {
    brødsmuler: Breadcrumb[];
}

export const Brødsmulesti: FunctionComponent<Props> = ({ brødsmuler }) => {
    const history = useHistory();

    useEffect(() => {
        setBreadcrumbs(brødsmuler);
        onBreadcrumbClick((breadcrumb) => history.push(breadcrumb.url));
    }, [brødsmuler]);

    return null;
};
