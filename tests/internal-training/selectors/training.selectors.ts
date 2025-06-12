export const TRAINING_SELECTORS = {

    CELL: {
        NAME: 'name-cell',
        CAPACITY: 'capacity-cell',
        ONLINE: 'online-cell',
        DATE: 'date-cell',
        TRAINER: 'trainer-cell',
        DEPARTMENT: 'department-cell',
        CATEGORY: 'category-cell',
        EDIT: 'edit-cell',
        SIGN: 'sign-cell',
    },

    XPATH_SELECTOR: {
        FILTER: {
            CATEGORY: '//*[@id="training_course_filter_courseCategories"]',
            TRAINER: '//*[@id="training_course_filter_teachers"]',
            DEPARTMENT: '//*[@id="training_course_filter_departments"]',
            NAME: '//*[@id="training_course_filter_trainingName"]',
            ONLINE: '//*[@id="training_course_filter_online"]',
            INCLUDE_PAST: '//*[@id="training_course_filter_showPrevious"]',
            PARTICIPANT: '//*[@id="training_course_filter_participants"]'
        },
        CATEGORY: '//*[@id="training_course_courseCategories"]',
        TRAINER: '//*[@id="training_course_teacher"]',
        DEPARTMENT: '//*[@id="training_course_departments"]'
    }
} as const;
