import classNames from 'classnames';
import React, { type FC, type PropsWithChildren, useCallback } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import layoutManager from '../../layoutManager';
import browser from '../../../scripts/browser';
import useLongPress from 'hooks/useLongPress';
import itemContextMenu from '../../itemContextMenu';
import type { DataAttributes } from 'types/dataAttributes';
import type { ItemDto } from 'types/base/models/item-dto';

interface ListWrapperProps {
    index: number | undefined;
    title?: string | null;
    action?: string | null;
    dataAttributes?: DataAttributes;
    className?: string;
    item?: ItemDto;
}

const ListWrapper: FC<PropsWithChildren<ListWrapperProps>> = ({
    index,
    action,
    title,
    className,
    dataAttributes,
    children,
    item
}) => {
    const isMobileTouch = layoutManager.mobile && browser.touch;

    const handleLongPress = useCallback(() => {
        if (item?.Id) {
            itemContextMenu.show({
                item,
                play: true,
                queue: true,
                playAllFromHere: true,
                queueAllFromHere: true
            }).catch(() => {
                // User dismissed menu
            });
        }
    }, [item]);

    const handleClick = useCallback(() => {
        // On mobile touch, tap plays the item (default action)
        // The action is handled by the parent via data-action attribute
    }, []);

    const longPressHandlers = useLongPress({
        onLongPress: handleLongPress,
        onClick: handleClick,
        delay: 500
    });

    if (layoutManager.tv) {
        return (
            <Button
                data-index={index}
                className={classNames(
                    className,
                    'itemAction listItem-button listItem-focusscale'
                )}
                data-action={action}
                aria-label={title || ''}
                {...dataAttributes}
            >
                {children}
            </Button>
        );
    } else if (isMobileTouch) {
        // On mobile touch: long press opens context menu, tap uses default action
        return (
            <Box
                data-index={index}
                className={classNames(className, 'itemAction listItem-button')}
                data-action={action}
                aria-label={title || ''}
                {...dataAttributes}
                {...longPressHandlers}
                sx={{ cursor: 'pointer', userSelect: 'none', WebkitTouchCallout: 'none' }}
            >
                {children}
            </Box>
        );
    } else {
        return (
            <Box data-index={index} className={className} {...dataAttributes}>
                {children}
            </Box>
        );
    }
};

export default ListWrapper;
