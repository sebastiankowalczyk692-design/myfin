import { appHost } from '../components/apphost';
import { AppFeature } from '../constants/appFeature';

interface Player {
    isLocalPlayer?: boolean;
    getVolume?(): number;
    setVolume?(val: number): void;
    volumeUp?(): void;
    volumeDown?(): void;
    isMuted?(): boolean;
    setMute?(mute: boolean): void;
    toggleMute?(): void;
}

function supportsPhysicalVolumeControl(player: Player): boolean {
    return player.isLocalPlayer && appHost.supports(AppFeature.PhysicalVolumeControl);
}

export const volumeUtils = {
    getVolume: (player?: Player): number => {
        if (!player) return 1;

        if (!supportsPhysicalVolumeControl(player)) {
            return player.getVolume?.() ?? 1;
        }

        return 1;
    },

    setVolume: (val: number, player?: Player): void => {
        if (!player) return;

        if (!supportsPhysicalVolumeControl(player)) {
            player.setVolume?.(val);
        }
    },

    volumeUp: (player?: Player): void => {
        if (!player) return;

        if (!supportsPhysicalVolumeControl(player)) {
            player.volumeUp?.();
        }
    },

    volumeDown: (player?: Player): void => {
        if (!player) return;

        if (!supportsPhysicalVolumeControl(player)) {
            player.volumeDown?.();
        }
    },

    isMuted: (player?: Player): boolean => {
        if (!player) return false;

        return player.isMuted?.() ?? false;
    },

    setMute: (mute: boolean, player?: Player): void => {
        if (!player) return;

        player.setMute?.(mute);
    },

    toggleMute: (player?: Player): void => {
        if (!player) return;

        if (player.toggleMute) {
            player.toggleMute();
        } else {
            player.setMute?.(!player.isMuted?.());
        }
    }
};

// React hook version for components that need reactive volume state
export function useVolume(player?: Player) {
    return {
        getVolume: () => volumeUtils.getVolume(player),
        setVolume: (val: number) => volumeUtils.setVolume(val, player),
        volumeUp: () => volumeUtils.volumeUp(player),
        volumeDown: () => volumeUtils.volumeDown(player),
        isMuted: () => volumeUtils.isMuted(player),
        setMute: (mute: boolean) => volumeUtils.setMute(mute, player),
        toggleMute: () => volumeUtils.toggleMute(player)
    };
}
