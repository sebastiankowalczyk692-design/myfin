import { AsyncRoute } from 'components/router/AsyncRoute';
import { AppType } from 'constants/appType';

export const ASYNC_USER_ROUTES: AsyncRoute[] = [
    { path: 'home', type: AppType.Experimental },
    { path: 'homevideos', type: AppType.Experimental },
    { path: 'movies', type: AppType.Experimental },
    { path: 'music', type: AppType.Experimental },
    { path: 'mypreferencesdisplay', page: 'user/display', type: AppType.Experimental },
    { path: 'mypreferencesmenu', page: 'user/settings' },
    { path: 'quickconnect', page: 'quickConnect' },
    { path: 'search' },
    { path: 'userprofile', page: 'user/userprofile' }
];
