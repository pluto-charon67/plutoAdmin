import { type App } from 'vue';
import LocalIcon from './components/LocalIcon';

export { LocalIcon };

export function useCustomIcon(app: App) {
    app.component('LocalIcon', LocalIcon);
}