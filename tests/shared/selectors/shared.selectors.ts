export const SHARED_SELECTORS = {
    // Object.assign used here to allow LIST to act as both a string and namespace
    LIST: Object.assign('list' as const, {
        LIST_AND_FILTER_WRAPPER: 'list-and-filter-wrapper',
        FILTER: 'filter',
        TITLES: {
            EDIT: 'Upravit'
        },
        ITEM: Object.assign('list-item' as const, {
            CONTENT: 'list-item-content',
            TEXT: 'list-item-text',
            LABEL: 'list-item-label'
        })
    }),
    NAVIGATION: {
        NAVTAB: 'navtab',
        TOGGLE_TRAINING: 'nav-toggle-training',
        TOGGLE_LUNCH: 'nav-toggle-lunch'
    },
    ACTIONS: {
        TRASH: 'trash'
    }
} as const;
