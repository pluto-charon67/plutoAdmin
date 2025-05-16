import type { PropType } from "vue";
import defaultProps from 'element-plus/es/components/table/src/table/defaults';

export default {
    tableKey: {
        type: [String, Number] as PropType<string | number>,
        default: '0',
    },
    columns: {
        type: Array,
        default: [],
    },
    align: {
        type: String,
        default: 'center',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    showPage: {
        type: Boolean,
        default: true,
    },
    rowHoverBgColor: {
        type: String,
        default: '',
    },
    paginationProps: {
        type: Object,
        default: {
            total: 0,
            pageSize: 10,
            align: 'right',
            size: 'default',
            background: false,
            pageSizes: [10, 20, 50, 100],
            layout: 'total, sizes, prev, pager, next, jumper',
        },
    },
    adaptive: {
        type: Boolean,
        default: false,
    },
    adaptiveConfig: {
        type: Object,
        default: {
            offsetBottom: 96,
            fixHeader: true,
            timeout: 60,
            zIndex: 3,
        },
    },
    ...defaultProps,
};
