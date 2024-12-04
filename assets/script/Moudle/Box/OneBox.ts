import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Global from "../../Common/Global";
import WechatApi from "../../Common/manage/API/WechatApi";
import ActionMgr from "../../Common/manage/ActionMgr";
import Tools from "../../Common/Tools";
import PanelMgr from "../../Common/manage/PanelMgr";
import Constant from "../../Common/Constant";
import GameLog from "../../Common/manage/GameLogMgr";

const {ccclass} = cc._decorator;

@ccclass
export default class OneBox extends LayerPanel {
    public static getUrl(): UrlInfo {
        return {
            bundle: "oneBox",
            name: "oneBox"
        }
    }

    private _param: any = null;
    private _config: any = null;
    private up: cc.Node = null
    private down: cc.Node = null
    private return: cc.Node = null
    private continue: cc.Node = null
    private upScrollView: cc.ScrollView = null
    private downScrollView: cc.ScrollView = null

    public initUI() {
        this._config = Global.config.exportConfig[0]
        this.return = this.getNode("return")
        this.continue = this.getNode("continue")
        this.onTouch(this.continue, () => {
            Tools.randomExport()
        })
        this.onTouch(this.return, () => {
            PanelMgr.INS.closePanel(OneBox, false)
        })
        this.up = this.getNode("up")
        this.upScrollView = this.up.getComponent(cc.ScrollView)
        let upContent = this.upScrollView.content
        let upList: cc.Node [] = []
        Global.exportInfo.forEach((value) => {
            let node = cc.instantiate(upContent.children[0])
            upContent.addChild(node)
            upList.push(node)
        })
        upContent.children[0].destroy()

        new WechatApi.gameBox().init(upList, null, Constant.EXPORT_TYPE.GAME_BOX_ONE, true, this)

        this.down = this.getNode("down")
        this.downScrollView = this.down.getComponent(cc.ScrollView)
        let downContent = this.downScrollView.content
        let downList = []
        Global.exportInfo.forEach((value) => {
            let node = cc.instantiate(downContent.children[0])
            downContent.addChild(node)
            downList.push(node)
        })
        downContent.children[0].destroy()
        new WechatApi.gameBox().init(downList, null, Constant.EXPORT_TYPE.GAME_BOX_ONE, true, this)
    }

    public show(param: any) {
        this._param = param
        WechatApi.bottomAdv.hide()
        this.return.active = false
        this.scheduleOnce(() => {
            this.return.active = true
        }, 2)
        this.schedule(this._scrollBox, Global.config.gameBoxMoveInterval, cc.macro.REPEAT_FOREVER)
        //判断是否强制导出
        Tools.changeNodePosition(this.continue)
        let willDo = () => {
            if (Tools.checkCheat(this._config.cheat_probability)) {
                this.scheduleOnce(() => {
                    Tools.setExportPos(this.continue)
                    WechatApi.bottomAdv.show()
                }, this._config.show_banner)
            }
        }
        if (Tools.checkPer(this._config.force_export)) {
            Tools.forceExport().then(() => {
                willDo()
            })
        } else {
            willDo()
        }
    }

    public hide() {
        this.return.active = false
        this._param.boxPromise(true);
    }

    private _scrollBox() {
        Tools.scrollViewOneItem(this.upScrollView, 'h');
        Tools.scrollViewOneItem(this.downScrollView, 'v');
    }
}
