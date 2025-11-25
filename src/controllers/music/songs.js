// TODO: Implement virtualized infinite scroll list for songs
import libraryBrowser from '../../scripts/libraryBrowser';
import imageLoader from '../../components/images/imageLoader';
import listView from '../../components/listview/listview';
import loading from '../../components/loading/loading';
import { playbackManager } from '../../components/playback/playbackmanager';
import * as userSettings from '../../scripts/settings/userSettings';
import globalize from '../../lib/globalize';
import Dashboard from '../../utils/dashboard';
import { setFilterStatus } from 'components/filterdialog/filterIndicator';

import '../../elements/emby-itemscontainer/emby-itemscontainer';

export default function (view, params, tabContent) {
    function getPageData() {
        const key = getSavedQueryKey();
        let pageData = data[key];

        if (!pageData) {
            pageData = data[key] = {
                query: {
                    SortBy: 'Album,SortName',
                    SortOrder: 'Ascending',
                    IncludeItemTypes: 'Audio',
                    Recursive: true,
                    Fields: 'ParentId',
                    StartIndex: 0,
                    ImageTypeLimit: 1,
                    EnableImageTypes: 'Primary'
                }
            };

            pageData.query.ParentId = params.topParentId;
            userSettings.loadQuerySettings(key, pageData.query);
        }

        return pageData;
    }

    function getQuery() {
        return getPageData().query;
    }

    function getSavedQueryKey() {
        return `${params.topParentId}-songs`;
    }

    function reloadItems(page) {
        loading.show();
        isLoading = true;
        const query = getQuery();
        setFilterStatus(tabContent, query);

        ApiClient.getItems(Dashboard.getCurrentUserId(), query).then(function (result) {
            const html = listView.getListViewHtml({
                items: result.Items,
                action: 'playallfromhere',
                smallIcon: true,
                artist: true,
                addToListButton: true
            });

            const itemsContainer = tabContent.querySelector('.itemsContainer');
            itemsContainer.innerHTML = html;
            imageLoader.lazyChildren(itemsContainer);
            userSettings.saveQuerySettings(getSavedQueryKey(), query);

            tabContent.querySelector('.btnShuffle').classList.toggle('hide', result.TotalRecordCount < 1);

            loading.hide();
            isLoading = false;

            import('../../components/autoFocuser').then(({ default: autoFocuser }) => {
                autoFocuser.autoFocus(page);
            });
        });
    }

    const self = this;
    const data = {};
    let isLoading = false;

    function shuffle() {
        const userId = ApiClient.getCurrentUserId();
        const parentId = params.topParentId;

        if (parentId) {
            ApiClient.getItem(userId, parentId).then(function (item) {
                playbackManager.shuffle(item);
            });
        } else {
            ApiClient.getUserViews({}, userId).then(function (result) {
                const musicView = result.Items.filter(function (i) {
                    return i.CollectionType == 'music';
                })[0];

                if (musicView) {
                    playbackManager.shuffle(musicView);
                }
            });
        }
    }

    self.getCurrentViewStyle = function () {
        return getPageData().view;
    };

    function initPage(tabElement) {
        tabElement.querySelector('.btnSort').addEventListener('click', function (e) {
            libraryBrowser.showSortMenu({
                items: [{
                    name: globalize.translate('OptionTrackName'),
                    id: 'Name'
                }, {
                    name: globalize.translate('Album'),
                    id: 'Album,AlbumArtist,SortName'
                }, {
                    name: globalize.translate('AlbumArtist'),
                    id: 'AlbumArtist,Album,SortName'
                }, {
                    name: globalize.translate('Artist'),
                    id: 'Artist,Album,SortName'
                }, {
                    name: globalize.translate('OptionDateAdded'),
                    id: 'DateCreated,SortName'
                }, {
                    name: globalize.translate('OptionDatePlayed'),
                    id: 'DatePlayed,SortName'
                }, {
                    name: globalize.translate('OptionPlayCount'),
                    id: 'PlayCount,SortName'
                }, {
                    name: globalize.translate('OptionReleaseDate'),
                    id: 'PremiereDate,AlbumArtist,Album,SortName'
                }, {
                    name: globalize.translate('Runtime'),
                    id: 'Runtime,AlbumArtist,Album,SortName'
                }, {
                    name: globalize.translate('OptionRandom'),
                    id: 'Random,SortName'
                }],
                callback: function () {
                    getQuery().StartIndex = 0;
                    reloadItems();
                },
                query: getQuery(),
                button: e.target
            });
        });
        tabElement.querySelector('.btnShuffle').addEventListener('click', shuffle);
    }

    initPage(tabContent);

    self.renderTab = function () {
        reloadItems(tabContent);
    };
}
