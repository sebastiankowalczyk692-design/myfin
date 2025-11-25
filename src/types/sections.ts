import type { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import type { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import type { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';

import { CardOptions } from './cardOptions';
import { SectionsView } from './libraryTabContent';

export interface ParametersOptions {
    sortBy?: ItemSortBy[];
    sortOrder?: SortOrder[];
    includeItemTypes?: BaseItemKind[];
    isAiring?: boolean;
    hasAired?: boolean;
    isMovie?: boolean;
    isSports?: boolean;
    isKids?: boolean;
    isNews?: boolean;
    isSeries?: boolean;
    isInProgress?: boolean;
    IsActive?: boolean;
    IsScheduled?: boolean;
    limit?: number;
    imageTypeLimit?: number;
}

export enum SectionApiMethod {
    ResumeItems = 'resumeItems',
    LatestMedia = 'latestMedia',
    NextUp = 'nextUp'
}

export enum SectionType {
    ContinueWatchingMovies = 'continuewatchingmovies',
    LatestMovies = 'latestmovies',
    ContinueWatchingEpisode = 'continuewatchingepisode',
    LatestEpisode = 'latestepisode',
    NextUp = 'nextUp',
    LatestMusic = 'latestmusic',
    RecentlyPlayedMusic = 'recentlyplayedmusic',
    FrequentlyPlayedMusic = 'frequentlyplayedmusic'
}

export interface Section {
    name: string;
    type: SectionType;
    apiMethod?: SectionApiMethod;
    itemTypes: string;
    parametersOptions?: ParametersOptions;
    cardOptions: CardOptions;
}

export const MovieSuggestionsSectionsView: SectionsView = {
    suggestionSections: [
        SectionType.ContinueWatchingMovies,
        SectionType.LatestMovies
    ],
    isMovieRecommendations: true
};

export const TvShowSuggestionsSectionsView: SectionsView = {
    suggestionSections: [
        SectionType.ContinueWatchingEpisode,
        SectionType.LatestEpisode,
        SectionType.NextUp
    ]
};

export const MusicSuggestionsSectionsView: SectionsView = {
    suggestionSections: [
        SectionType.LatestMusic,
        SectionType.FrequentlyPlayedMusic,
        SectionType.RecentlyPlayedMusic
    ]
};

