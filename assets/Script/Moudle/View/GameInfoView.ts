import CacheMgr from "../../Common/manage/CacheMgr";
import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Global from "../../Common/Global";
import ShortageView from "./ShortageView";
import PanelMgr, {Layer} from "../../Common/manage/PanelMgr";

const {ccclass} = cc._decorator;

@ccclass
export default class GameInfoView extends LayerPanel {

    public static getUrl(): UrlInfo {
        return {
            bundle: "gameInfoView",
            name: "gameInfoView"
        }
    }

    private gold: cc.Node = null;

    private stamina: cc.Node = null;

    private diamond: cc.Node = null;

    private gold_add_button: cc.Node = null;
    private stamina_add_button: cc.Node = null;

    private residue_node: cc.Node = null;
    private residue_sprite: cc.Node = null;

    private animationTime: number = null;
    private gold_num: number = null;
    private stamina_num: number = 0;
    private diamond_num: number = 0;
    private timeouts: Map<string, number[]> = new Map<string, number[]>();

    private stamina_minute: number = 0;
    private stamina_second: number = 0;

    private static gameInfoViewIns: GameInfoView = null;

    public static INS(): GameInfoView {
        return this.gameInfoViewIns;
    }

    initUI(): void {
        GameInfoView.gameInfoViewIns = this;
        this.gold_num = CacheMgr.gold;
        this.stamina_num = CacheMgr.stamina;
        this.diamond_num = CacheMgr.diamond;
        this.animationTime = Global.config.gameInfo.animation;
        this.gold = this.getNode("gold/num");
        this.stamina = this.getNode("stamina/num");
        this.gold_add_button = this.getNode("gold/add");
        this.stamina_add_button = this.getNode("stamina/add");
        this.residue_node = this.getNode("stamina/time");
        this.residue_sprite = this.getNode("stamina/man");
        this.timeouts.set("gold", []);
        this.timeouts.set("stamina", []);
        this.timeouts.set("diamond", []);
    }

    show(param: any): void {
        this.gold.getComponent(cc.Label).string = this.gold_num.toString();

        this.stamina.getComponent(cc.Label).string = this.stamina_num.toString();

        this.onTouch(this.gold_add_button, () => {
            PanelMgr.INS.openPanel({
                panel: ShortageView,
                layer: Layer.gameLayer,
                param: {
                    type: "gold",
                }
            })
        });

        this.onTouch(this.stamina_add_button, () => {
            PanelMgr.INS.openPanel({
                panel: ShortageView,
                layer: Layer.gameLayer,
                param: {
                    type: "stamina",
                }
            })
        });
    }

    hide() {

    }

    /**
     * 监听金币是否改变
     * @param dt
     * @protected
     */
    protected update(dt: number) {
        let newGold = CacheMgr.gold;
        if (this.gold_num != newGold) {
            this.changeAnimation("gold", newGold - this.gold_num);
        }

        let newStamina = CacheMgr.stamina;
        if (this.stamina_num != newStamina) {
            this.changeAnimation("stamina", newStamina - this.stamina_num);
        }

        if (CacheMgr.stamina >= Global.config.gameInfo.maxStamina) {
            this.residue_node.active = false;
            this.residue_sprite.active = true;
            this.stamina_minute = 0;
            this.stamina_second = 0;
            return;
        }
        this.residue_sprite.active = false;
        this.residue_node.active = true;
        this.residue_node.getComponent(cc.Label).string = this.stamina_minute.toString().padStart(2, "0") + ":" + this.stamina_second.toString().padStart(2, "0");
    }

    public changeResidue(minute: number, second: number) {
        this.stamina_minute = minute;
        this.stamina_second = second;
    }

    /**
     * 修改金币动画
     * @param type
     * @param num
     * @private
     */
    private changeAnimation(type: string, num: number) {
        this.clearTimeOut(type);
        let num_bas = Math.abs(num);
        let time = this.animationTime / num_bas;
        let allTime = 0;   //累计耗时间
        let num_ = this[type + "_num"];
        this[type + "_num"] += num;
        for (let i = 1; i <= num_bas; i++) {
            if (num < 0) {
                let arr = this.timeouts.get(type);
                arr[i] = window.setTimeout(() => {
                    this[type].getComponent(cc.Label).string = (num_ - i).toString();
                }, allTime * 1000);
                allTime += time;
            } else {
                let arr = this.timeouts.get(type);
                arr[i] = window.setTimeout(() => {
                    this[type].getComponent(cc.Label).string = (num_ + i).toString();
                }, allTime * 1000);
                allTime += time;
            }
        }
    }

    /**
     * 清空所有动画
     * @param type
     * @private
     */
    private clearTimeOut(type: string) {
        //停止所有关于 该类型改变的值
        let timeouts = this.timeouts.get(type);
        for (let i = 0; i < timeouts.length; i++) {
            if (this.timeouts[i]) {
                window.clearTimeout(timeouts[i]);
            }
        }
        this[type].getComponent(cc.Label).string = this[type + "_num"].toString();   //直接赋值
        this.timeouts.set(type, []);
    }
}
