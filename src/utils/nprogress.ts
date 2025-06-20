import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
    // 动画方式
    easing: 'ease',
    // 进度条的增加速度
    speed: 500,
    // 是否显示加载的icon
    showSpinner: false,
    // 自动递增的间隔
    trickleSpeed: 200,
    // 初始化的最小百分比
    minimum: 0.3,
});

export default NProgress;
