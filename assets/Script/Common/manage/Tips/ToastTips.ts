import LayerPanel, {UrlInfo} from "../Layer/LayerPanel";
import GameLog from "../GameLogMgr";
import url = cc.url;
import PanelMgr from "../PanelMgr";
import HomeView from "../../../Moudle/View/HomeView";

const {ccclass} = cc._decorator;
@ccclass
export default class ToastTips extends LayerPanel {

    private _labelContent: cc.Label = null;

    public static getUrl(): UrlInfo {
        return {
            bundle: "toastView",
            name: "toastView"
        };
    }

    public initUI(): void {
        this._labelContent = this.getNode('container/label').getComponent(cc.Label);
    }

    public show(param: any): void {
        try {
            if (param.title) {
                this._labelContent.string = param.title;
            }
            this.node.active = true;
            let duration = param;
            if (param.duration && param.duration > 100) {
                duration = param.duration / 1000;
            }
            GameLog.log('end show toast', duration);
            this.scheduleOnce(() => {
                PanelMgr.INS.closePanel(ToastTips, false)
            }, duration);
        } catch (e) {
            GameLog.error('显示异常', e);
        }
    }

    public hide(): void {
    }
}
