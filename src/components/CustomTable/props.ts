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
    rowHoverBgColor: {
        type: String,
        default: '',
    },
    pagination: {
        type: Object,
        default: {
            total: 0,
            pageSize: 5,
            align: 'right',
            size: 'default',
            background: false,
            pageSizes: [5, 10, 15, 20],
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
