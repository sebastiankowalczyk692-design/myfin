import classNames from 'classnames';
import { getDataAttributes } from 'utils/items';
import layoutManager from 'components/layoutManager';
import browser from 'scripts/browser';

import type { ItemDto } from 'types/base/models/item-dto';
import type { ListOptions } from 'types/listOptions';

interface UseListProps {
    item: ItemDto;
    listOptions: ListOptions;
}

function useList({ item, listOptions }: UseListProps) {
    // On mobile touch devices: tap plays, long press opens context menu
    const isMobileTouch = layoutManager.mobile && browser.touch;
    const action = listOptions.action ?? 'link';
    const isLargeStyle = listOptions.imageSize === 'large';
    const enableOverview = listOptions.enableOverview;
    // On mobile touch, we make the row clickable but handle long press separately
    const clickEntireItem = !!layoutManager.tv || isMobileTouch;
    const enableSideMediaInfo = listOptions.enableSideMediaInfo ?? true;
    const enableContentWrapper =
        listOptions.enableOverview && !layoutManager.tv;
    const downloadWidth = isLargeStyle ? 500 : 80;

    const dataAttributes = getDataAttributes(
        {
            action,
            itemServerId: item.ServerId,
            itemId: item.Id,
            collectionId: listOptions.collectionId,
            playlistId: listOptions.playlistId,
            itemChannelId: item.ChannelId,
            itemType: item.Type,
            itemMediaType: item.MediaType,
            itemCollectionType: item.CollectionType,
            itemIsFolder: item.IsFolder,
            itemPlaylistItemId: item.PlaylistItemId
        }
    );

    const listWrapperClass = classNames(
        'listItem',
        {
            'listItem-border':
                listOptions.border
                ?? (listOptions.highlight !== false && !layoutManager.tv)
        },
        { 'itemAction listItem-button': clickEntireItem },
        { 'listItem-focusscale': layoutManager.tv },
        { 'listItem-largeImage': isLargeStyle },
        { 'listItem-withContentWrapper': enableContentWrapper }
    );

    const getListdWrapperProps = () => ({
        className: listWrapperClass,
        title: item.Name,
        action,
        dataAttributes,
        item
    });

    const getListContentProps = () => ({
        item,
        listOptions,
        enableContentWrapper,
        enableOverview,
        enableSideMediaInfo,
        clickEntireItem,
        action,
        isLargeStyle,
        downloadWidth
    });

    return {
        getListdWrapperProps,
        getListContentProps
    };
}

export default useList;
