import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Completion, CompletionToggle, DashboardSummary, HealthStatus, ListTrackerItemsParams, ListTrackersParams, PublicTrackerView, SectionsReorder, ShareLink, ShareLinkInput, Tracker, TrackerAnalytics, TrackerInput, TrackerItem, TrackerItemInput, TrackerItemUpdate, TrackerSection, TrackerSectionInput, TrackerSectionUpdate, TrackerUpdate, UserProfile, UserProfileUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMeUrl: () => string;
/**
 * @summary Get or create current user profile
 */
export declare const getMe: (options?: RequestInit) => Promise<UserProfile>;
export declare const getGetMeQueryKey: () => readonly ["/api/users/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get or create current user profile
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateMeUrl: () => string;
/**
 * @summary Update current user profile
 */
export declare const updateMe: (userProfileUpdate: UserProfileUpdate, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateMeMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UserProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UserProfileUpdate>;
}, TContext>;
export type UpdateMeMutationResult = NonNullable<Awaited<ReturnType<typeof updateMe>>>;
export type UpdateMeMutationBody = BodyType<UserProfileUpdate>;
export type UpdateMeMutationError = ErrorType<unknown>;
/**
* @summary Update current user profile
*/
export declare const useUpdateMe: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMe>>, TError, {
        data: BodyType<UserProfileUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMe>>, TError, {
    data: BodyType<UserProfileUpdate>;
}, TContext>;
export declare const getListTrackersUrl: (params?: ListTrackersParams) => string;
/**
 * @summary List all trackers for the current user
 */
export declare const listTrackers: (params?: ListTrackersParams, options?: RequestInit) => Promise<Tracker[]>;
export declare const getListTrackersQueryKey: (params?: ListTrackersParams) => readonly ["/api/trackers", ...ListTrackersParams[]];
export declare const getListTrackersQueryOptions: <TData = Awaited<ReturnType<typeof listTrackers>>, TError = ErrorType<unknown>>(params?: ListTrackersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrackers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTrackers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTrackersQueryResult = NonNullable<Awaited<ReturnType<typeof listTrackers>>>;
export type ListTrackersQueryError = ErrorType<unknown>;
/**
 * @summary List all trackers for the current user
 */
export declare function useListTrackers<TData = Awaited<ReturnType<typeof listTrackers>>, TError = ErrorType<unknown>>(params?: ListTrackersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrackers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTrackerUrl: () => string;
/**
 * @summary Create a new tracker
 */
export declare const createTracker: (trackerInput: TrackerInput, options?: RequestInit) => Promise<Tracker>;
export declare const getCreateTrackerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTracker>>, TError, {
        data: BodyType<TrackerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTracker>>, TError, {
    data: BodyType<TrackerInput>;
}, TContext>;
export type CreateTrackerMutationResult = NonNullable<Awaited<ReturnType<typeof createTracker>>>;
export type CreateTrackerMutationBody = BodyType<TrackerInput>;
export type CreateTrackerMutationError = ErrorType<unknown>;
/**
* @summary Create a new tracker
*/
export declare const useCreateTracker: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTracker>>, TError, {
        data: BodyType<TrackerInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTracker>>, TError, {
    data: BodyType<TrackerInput>;
}, TContext>;
export declare const getGetTrackerUrl: (id: number) => string;
/**
 * @summary Get a single tracker
 */
export declare const getTracker: (id: number, options?: RequestInit) => Promise<Tracker>;
export declare const getGetTrackerQueryKey: (id: number) => readonly [`/api/trackers/${number}`];
export declare const getGetTrackerQueryOptions: <TData = Awaited<ReturnType<typeof getTracker>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTracker>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTracker>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrackerQueryResult = NonNullable<Awaited<ReturnType<typeof getTracker>>>;
export type GetTrackerQueryError = ErrorType<void>;
/**
 * @summary Get a single tracker
 */
export declare function useGetTracker<TData = Awaited<ReturnType<typeof getTracker>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTracker>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateTrackerUrl: (id: number) => string;
/**
 * @summary Update a tracker
 */
export declare const updateTracker: (id: number, trackerUpdate: TrackerUpdate, options?: RequestInit) => Promise<Tracker>;
export declare const getUpdateTrackerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTracker>>, TError, {
        id: number;
        data: BodyType<TrackerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTracker>>, TError, {
    id: number;
    data: BodyType<TrackerUpdate>;
}, TContext>;
export type UpdateTrackerMutationResult = NonNullable<Awaited<ReturnType<typeof updateTracker>>>;
export type UpdateTrackerMutationBody = BodyType<TrackerUpdate>;
export type UpdateTrackerMutationError = ErrorType<unknown>;
/**
* @summary Update a tracker
*/
export declare const useUpdateTracker: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTracker>>, TError, {
        id: number;
        data: BodyType<TrackerUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTracker>>, TError, {
    id: number;
    data: BodyType<TrackerUpdate>;
}, TContext>;
export declare const getDeleteTrackerUrl: (id: number) => string;
/**
 * @summary Delete a tracker
 */
export declare const deleteTracker: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTrackerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTracker>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTracker>>, TError, {
    id: number;
}, TContext>;
export type DeleteTrackerMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTracker>>>;
export type DeleteTrackerMutationError = ErrorType<unknown>;
/**
* @summary Delete a tracker
*/
export declare const useDeleteTracker: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTracker>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTracker>>, TError, {
    id: number;
}, TContext>;
export declare const getListSectionsUrl: (trackerId: number) => string;
/**
 * @summary List all sections in a tracker
 */
export declare const listSections: (trackerId: number, options?: RequestInit) => Promise<TrackerSection[]>;
export declare const getListSectionsQueryKey: (trackerId: number) => readonly [`/api/trackers/${number}/sections`];
export declare const getListSectionsQueryOptions: <TData = Awaited<ReturnType<typeof listSections>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSections>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listSections>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListSectionsQueryResult = NonNullable<Awaited<ReturnType<typeof listSections>>>;
export type ListSectionsQueryError = ErrorType<unknown>;
/**
 * @summary List all sections in a tracker
 */
export declare function useListSections<TData = Awaited<ReturnType<typeof listSections>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listSections>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateSectionUrl: (trackerId: number) => string;
/**
 * @summary Add a section to a tracker
 */
export declare const createSection: (trackerId: number, trackerSectionInput: TrackerSectionInput, options?: RequestInit) => Promise<TrackerSection>;
export declare const getCreateSectionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSection>>, TError, {
        trackerId: number;
        data: BodyType<TrackerSectionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSection>>, TError, {
    trackerId: number;
    data: BodyType<TrackerSectionInput>;
}, TContext>;
export type CreateSectionMutationResult = NonNullable<Awaited<ReturnType<typeof createSection>>>;
export type CreateSectionMutationBody = BodyType<TrackerSectionInput>;
export type CreateSectionMutationError = ErrorType<unknown>;
/**
* @summary Add a section to a tracker
*/
export declare const useCreateSection: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSection>>, TError, {
        trackerId: number;
        data: BodyType<TrackerSectionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSection>>, TError, {
    trackerId: number;
    data: BodyType<TrackerSectionInput>;
}, TContext>;
export declare const getReorderSectionsUrl: (trackerId: number) => string;
/**
 * @summary Reorder sections within a tracker
 */
export declare const reorderSections: (trackerId: number, sectionsReorder: SectionsReorder, options?: RequestInit) => Promise<TrackerSection[]>;
export declare const getReorderSectionsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reorderSections>>, TError, {
        trackerId: number;
        data: BodyType<SectionsReorder>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reorderSections>>, TError, {
    trackerId: number;
    data: BodyType<SectionsReorder>;
}, TContext>;
export type ReorderSectionsMutationResult = NonNullable<Awaited<ReturnType<typeof reorderSections>>>;
export type ReorderSectionsMutationBody = BodyType<SectionsReorder>;
export type ReorderSectionsMutationError = ErrorType<unknown>;
/**
* @summary Reorder sections within a tracker
*/
export declare const useReorderSections: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reorderSections>>, TError, {
        trackerId: number;
        data: BodyType<SectionsReorder>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reorderSections>>, TError, {
    trackerId: number;
    data: BodyType<SectionsReorder>;
}, TContext>;
export declare const getUpdateSectionUrl: (trackerId: number, sectionId: number) => string;
/**
 * @summary Update a section
 */
export declare const updateSection: (trackerId: number, sectionId: number, trackerSectionUpdate: TrackerSectionUpdate, options?: RequestInit) => Promise<TrackerSection>;
export declare const getUpdateSectionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSection>>, TError, {
        trackerId: number;
        sectionId: number;
        data: BodyType<TrackerSectionUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSection>>, TError, {
    trackerId: number;
    sectionId: number;
    data: BodyType<TrackerSectionUpdate>;
}, TContext>;
export type UpdateSectionMutationResult = NonNullable<Awaited<ReturnType<typeof updateSection>>>;
export type UpdateSectionMutationBody = BodyType<TrackerSectionUpdate>;
export type UpdateSectionMutationError = ErrorType<unknown>;
/**
* @summary Update a section
*/
export declare const useUpdateSection: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSection>>, TError, {
        trackerId: number;
        sectionId: number;
        data: BodyType<TrackerSectionUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSection>>, TError, {
    trackerId: number;
    sectionId: number;
    data: BodyType<TrackerSectionUpdate>;
}, TContext>;
export declare const getDeleteSectionUrl: (trackerId: number, sectionId: number) => string;
/**
 * @summary Delete a section and all its items
 */
export declare const deleteSection: (trackerId: number, sectionId: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteSectionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSection>>, TError, {
        trackerId: number;
        sectionId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSection>>, TError, {
    trackerId: number;
    sectionId: number;
}, TContext>;
export type DeleteSectionMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSection>>>;
export type DeleteSectionMutationError = ErrorType<unknown>;
/**
* @summary Delete a section and all its items
*/
export declare const useDeleteSection: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSection>>, TError, {
        trackerId: number;
        sectionId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSection>>, TError, {
    trackerId: number;
    sectionId: number;
}, TContext>;
export declare const getListTrackerItemsUrl: (trackerId: number, params?: ListTrackerItemsParams) => string;
/**
 * @summary List all items in a tracker (optionally filtered by section)
 */
export declare const listTrackerItems: (trackerId: number, params?: ListTrackerItemsParams, options?: RequestInit) => Promise<TrackerItem[]>;
export declare const getListTrackerItemsQueryKey: (trackerId: number, params?: ListTrackerItemsParams) => readonly [`/api/trackers/${number}/items`, ...ListTrackerItemsParams[]];
export declare const getListTrackerItemsQueryOptions: <TData = Awaited<ReturnType<typeof listTrackerItems>>, TError = ErrorType<unknown>>(trackerId: number, params?: ListTrackerItemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrackerItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTrackerItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTrackerItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listTrackerItems>>>;
export type ListTrackerItemsQueryError = ErrorType<unknown>;
/**
 * @summary List all items in a tracker (optionally filtered by section)
 */
export declare function useListTrackerItems<TData = Awaited<ReturnType<typeof listTrackerItems>>, TError = ErrorType<unknown>>(trackerId: number, params?: ListTrackerItemsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTrackerItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateTrackerItemUrl: (trackerId: number) => string;
/**
 * @summary Add an item to a tracker section
 */
export declare const createTrackerItem: (trackerId: number, trackerItemInput: TrackerItemInput, options?: RequestInit) => Promise<TrackerItem>;
export declare const getCreateTrackerItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTrackerItem>>, TError, {
        trackerId: number;
        data: BodyType<TrackerItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTrackerItem>>, TError, {
    trackerId: number;
    data: BodyType<TrackerItemInput>;
}, TContext>;
export type CreateTrackerItemMutationResult = NonNullable<Awaited<ReturnType<typeof createTrackerItem>>>;
export type CreateTrackerItemMutationBody = BodyType<TrackerItemInput>;
export type CreateTrackerItemMutationError = ErrorType<unknown>;
/**
* @summary Add an item to a tracker section
*/
export declare const useCreateTrackerItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTrackerItem>>, TError, {
        trackerId: number;
        data: BodyType<TrackerItemInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTrackerItem>>, TError, {
    trackerId: number;
    data: BodyType<TrackerItemInput>;
}, TContext>;
export declare const getUpdateTrackerItemUrl: (trackerId: number, itemId: number) => string;
/**
 * @summary Update a tracker item
 */
export declare const updateTrackerItem: (trackerId: number, itemId: number, trackerItemUpdate: TrackerItemUpdate, options?: RequestInit) => Promise<TrackerItem>;
export declare const getUpdateTrackerItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTrackerItem>>, TError, {
        trackerId: number;
        itemId: number;
        data: BodyType<TrackerItemUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTrackerItem>>, TError, {
    trackerId: number;
    itemId: number;
    data: BodyType<TrackerItemUpdate>;
}, TContext>;
export type UpdateTrackerItemMutationResult = NonNullable<Awaited<ReturnType<typeof updateTrackerItem>>>;
export type UpdateTrackerItemMutationBody = BodyType<TrackerItemUpdate>;
export type UpdateTrackerItemMutationError = ErrorType<unknown>;
/**
* @summary Update a tracker item
*/
export declare const useUpdateTrackerItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTrackerItem>>, TError, {
        trackerId: number;
        itemId: number;
        data: BodyType<TrackerItemUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTrackerItem>>, TError, {
    trackerId: number;
    itemId: number;
    data: BodyType<TrackerItemUpdate>;
}, TContext>;
export declare const getDeleteTrackerItemUrl: (trackerId: number, itemId: number) => string;
/**
 * @summary Delete a tracker item
 */
export declare const deleteTrackerItem: (trackerId: number, itemId: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteTrackerItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTrackerItem>>, TError, {
        trackerId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTrackerItem>>, TError, {
    trackerId: number;
    itemId: number;
}, TContext>;
export type DeleteTrackerItemMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTrackerItem>>>;
export type DeleteTrackerItemMutationError = ErrorType<unknown>;
/**
* @summary Delete a tracker item
*/
export declare const useDeleteTrackerItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTrackerItem>>, TError, {
        trackerId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteTrackerItem>>, TError, {
    trackerId: number;
    itemId: number;
}, TContext>;
export declare const getGetCompletionLogUrl: (trackerId: number) => string;
/**
 * @summary List completion records for a tracker
 */
export declare const getCompletionLog: (trackerId: number, options?: RequestInit) => Promise<Completion[]>;
export declare const getGetCompletionLogQueryKey: (trackerId: number) => readonly [`/api/trackers/${number}/completions`];
export declare const getGetCompletionLogQueryOptions: <TData = Awaited<ReturnType<typeof getCompletionLog>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompletionLog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCompletionLog>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCompletionLogQueryResult = NonNullable<Awaited<ReturnType<typeof getCompletionLog>>>;
export type GetCompletionLogQueryError = ErrorType<unknown>;
/**
 * @summary List completion records for a tracker
 */
export declare function useGetCompletionLog<TData = Awaited<ReturnType<typeof getCompletionLog>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCompletionLog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getToggleCompletionUrl: (trackerId: number) => string;
/**
 * @summary Toggle a completion entry for a tracker item on a given date
 */
export declare const toggleCompletion: (trackerId: number, completionToggle: CompletionToggle, options?: RequestInit) => Promise<Completion>;
export declare const getToggleCompletionMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof toggleCompletion>>, TError, {
        trackerId: number;
        data: BodyType<CompletionToggle>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof toggleCompletion>>, TError, {
    trackerId: number;
    data: BodyType<CompletionToggle>;
}, TContext>;
export type ToggleCompletionMutationResult = NonNullable<Awaited<ReturnType<typeof toggleCompletion>>>;
export type ToggleCompletionMutationBody = BodyType<CompletionToggle>;
export type ToggleCompletionMutationError = ErrorType<unknown>;
/**
* @summary Toggle a completion entry for a tracker item on a given date
*/
export declare const useToggleCompletion: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof toggleCompletion>>, TError, {
        trackerId: number;
        data: BodyType<CompletionToggle>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof toggleCompletion>>, TError, {
    trackerId: number;
    data: BodyType<CompletionToggle>;
}, TContext>;
export declare const getGetDashboardSummaryUrl: () => string;
/**
 * @summary Dashboard summary — total trackers, today's progress, streaks, productivity score
 */
export declare const getDashboardSummary: (options?: RequestInit) => Promise<DashboardSummary>;
export declare const getGetDashboardSummaryQueryKey: () => readonly ["/api/analytics/dashboard"];
export declare const getGetDashboardSummaryQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardSummary>>>;
export type GetDashboardSummaryQueryError = ErrorType<unknown>;
/**
 * @summary Dashboard summary — total trackers, today's progress, streaks, productivity score
 */
export declare function useGetDashboardSummary<TData = Awaited<ReturnType<typeof getDashboardSummary>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardSummary>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetTrackerAnalyticsUrl: (trackerId: number) => string;
/**
 * @summary Detailed analytics for a single tracker (weekly/monthly trends, streaks)
 */
export declare const getTrackerAnalytics: (trackerId: number, options?: RequestInit) => Promise<TrackerAnalytics>;
export declare const getGetTrackerAnalyticsQueryKey: (trackerId: number) => readonly [`/api/analytics/trackers/${number}`];
export declare const getGetTrackerAnalyticsQueryOptions: <TData = Awaited<ReturnType<typeof getTrackerAnalytics>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrackerAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTrackerAnalytics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTrackerAnalyticsQueryResult = NonNullable<Awaited<ReturnType<typeof getTrackerAnalytics>>>;
export type GetTrackerAnalyticsQueryError = ErrorType<unknown>;
/**
 * @summary Detailed analytics for a single tracker (weekly/monthly trends, streaks)
 */
export declare function useGetTrackerAnalytics<TData = Awaited<ReturnType<typeof getTrackerAnalytics>>, TError = ErrorType<unknown>>(trackerId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTrackerAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateShareLinkUrl: (trackerId: number) => string;
/**
 * @summary Generate a public share link for a tracker
 */
export declare const createShareLink: (trackerId: number, shareLinkInput: ShareLinkInput, options?: RequestInit) => Promise<ShareLink>;
export declare const getCreateShareLinkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShareLink>>, TError, {
        trackerId: number;
        data: BodyType<ShareLinkInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createShareLink>>, TError, {
    trackerId: number;
    data: BodyType<ShareLinkInput>;
}, TContext>;
export type CreateShareLinkMutationResult = NonNullable<Awaited<ReturnType<typeof createShareLink>>>;
export type CreateShareLinkMutationBody = BodyType<ShareLinkInput>;
export type CreateShareLinkMutationError = ErrorType<unknown>;
/**
* @summary Generate a public share link for a tracker
*/
export declare const useCreateShareLink: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createShareLink>>, TError, {
        trackerId: number;
        data: BodyType<ShareLinkInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createShareLink>>, TError, {
    trackerId: number;
    data: BodyType<ShareLinkInput>;
}, TContext>;
export declare const getDeleteShareLinkUrl: (trackerId: number) => string;
/**
 * @summary Revoke the share link for a tracker
 */
export declare const deleteShareLink: (trackerId: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteShareLinkMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteShareLink>>, TError, {
        trackerId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteShareLink>>, TError, {
    trackerId: number;
}, TContext>;
export type DeleteShareLinkMutationResult = NonNullable<Awaited<ReturnType<typeof deleteShareLink>>>;
export type DeleteShareLinkMutationError = ErrorType<unknown>;
/**
* @summary Revoke the share link for a tracker
*/
export declare const useDeleteShareLink: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteShareLink>>, TError, {
        trackerId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteShareLink>>, TError, {
    trackerId: number;
}, TContext>;
export declare const getGetSharedTrackerUrl: (token: string) => string;
/**
 * @summary Publicly view a shared tracker (no auth required)
 */
export declare const getSharedTracker: (token: string, options?: RequestInit) => Promise<PublicTrackerView>;
export declare const getGetSharedTrackerQueryKey: (token: string) => readonly [`/api/share/${string}`];
export declare const getGetSharedTrackerQueryOptions: <TData = Awaited<ReturnType<typeof getSharedTracker>>, TError = ErrorType<void>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSharedTracker>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSharedTracker>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSharedTrackerQueryResult = NonNullable<Awaited<ReturnType<typeof getSharedTracker>>>;
export type GetSharedTrackerQueryError = ErrorType<void>;
/**
 * @summary Publicly view a shared tracker (no auth required)
 */
export declare function useGetSharedTracker<TData = Awaited<ReturnType<typeof getSharedTracker>>, TError = ErrorType<void>>(token: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSharedTracker>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map