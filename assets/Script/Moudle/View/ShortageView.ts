import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Global from "../../Common/Global";
import LoadMgr from "../../Common/manage/LoadMgr";
import WechatApi from "../../Common/manage/API/WechatApi";
import Constant from "../../Common/Constant";
import GameLog from "../../Common/manage/GameLogMgr";
import CacheMgr from "../../Common/manage/CacheMgr";
import Tools from "../../Common/Tools";
import url = cc.url;
import PanelMgr from "../../Common/manage/PanelMgr";

const {ccclass, property} = cc._decorator;
@ccclass
export default class ShortageView extends LayerPanel {
    public static getUrl(): UrlInfo {
        return {
            bundle: "shortageView",
            name: "shortageView"
        }
    }

    //node
    private _image: cc.Node = null;
    private _button: cc.Node = null;
    private _skipButton: cc.Node = null;
    private _addNum: cc.Node = null

    private callBack: Function = null;  // 玩家领取成功对应的道具 回调
    private price: number = 0; //当前逻辑所需要的消耗数量

    public initUI() {
        this._image = this.getNode("image");
        this._button = this.getNode("button");
        this._skipButton = this.getNode("skip");
        this._addNum = this.getNode("add_num")
    }

    /**
     * @param param  {
     *     type  :   string   不足类型  例如   gold : 金币  st
     *     callBack : Function  //回调
     *     price :   number   本次展示观看视频成功之后，回调执行条件价格
     * }
     */
    public show(param: any) {
        try {
            let type: string = ""
            if (param) {
                this.callBack = param.callBack;
                this.price = param.price;
                type = param.type;
            }

            this._image.active = false;
            this._skipButton.active = false;
            this._button.active = false;

            this.replaceSprite(this._image, type);
            this.replaceSprite(this._skipButton, type);
            this.replaceSprite(this._button, type);

            let addNum = Global.config.addInfo[type]
            this._addNum.getComponent(cc.Label).string = "+" + addNum

            this.onTouch(this._button, () => {
                Tools.handleVideo(Constant.VIDEO_TYPE.GET_GOLD).then((res) => {
                    if (res) {
                        if (type == "gold") {
                            CacheMgr.gold = CacheMgr.gold + addNum
                            PanelMgr.INS.closePanel(ShortageView)
                            if (this.callBack && CacheMgr.gold >= this.price) {
                                CacheMgr.gold = CacheMgr.gold - this.price
                                this.callBack()
                            }
                        } else if (type == "diamond") {
                            CacheMgr.diamond = CacheMgr.diamond + addNum
                            PanelMgr.INS.closePanel(ShortageView)
                            if (this.callBack && CacheMgr.diamond >= this.price) {
                                CacheMgr.diamond = CacheMgr.diamond - this.price
                                this.callBack()
                            }
                        } else if (type == "stamina") {
                            CacheMgr.stamina = CacheMgr.stamina + addNum
                            PanelMgr.INS.closePanel(ShortageView)
                            if (this.callBack && CacheMgr.stamina >= this.price) {
                                CacheMgr.stamina = CacheMgr.stamina - this.price
                                this.callBack()
                            }
                        }
                    }
                });
            });

            this.onTouch(this._skipButton, () => {
                PanelMgr.INS.closePanel(ShortageView)
            });

            this.node.active = true;
        } catch (e) {
            GameLog.error('home show error ');
        }
    }

    //替换图片
    public replaceSprite(node: cc.Node, type: string) {
        if (!node || !type) {
            return;
        }
        let sprite = node.getComponent(cc.Sprite)
        if (!sprite) {
            return;
        }
        LoadMgr.loadSprite(sprite, "view/shortage/" + type + "/" + node.name).then();
    }

    public hide() {
    }
}
