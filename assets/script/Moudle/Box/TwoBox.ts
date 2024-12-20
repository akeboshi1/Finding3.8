import {_decorator,Node,SpriteFrame,ScrollView,instantiate,Sprite,macro} from "cc";
import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Global from "../../Common/Global";
import Tools from "../../Common/Tools";
import ActionMgr from "../../Common/manage/ActionMgr";
import Constant from "../../Common/Constant";
import PanelMgr, {Layer} from "../../Common/manage/PanelMgr";
import property = _decorator.property;

const {ccclass} = _decorator;

@ccclass
export default class TwoBox extends LayerPanel {

    public static getUrl(): UrlInfo {
        return {
            bundle: "twoBox",
            name: "twoBox",
        }
    }

    @property([SpriteFrame])
    btn_Sprite: SpriteFrame [] = []

    _param: any = null
    _config: any = null
    view: Node = null
    content: Node = null
    scrollView: ScrollView = null
    upContent: Node = null
    down: Node = null
    continue_btn: Node = null

    public initUI() {
        this._config = Global.config.exportConfig[1]
        this.upContent = this.getNode("up/content")
        this.down = this.getNode("down")
        this.continue_btn = this.getNode("close")
        this.onTouch(this.continue_btn, () => {
            PanelMgr.INS.closePanel(TwoBox)
        })
        this.view = this.down.getChildByName("view")
        //new WechatApi.gameBox().init(this.upContent.children, 2, Constant.EXPORT_TYPE.GAME_BOX_TWO, true, this)
        let scrollView = this.down.getComponent(ScrollView)
        this.scrollView = scrollView
        let content = scrollView.content
        this.content = content
        let downList: Node [] = []
        for (let i = 0; i < Global.exportInfo.length; i++) {
            let node = instantiate(content.children[0])
            node.getChildByName("btn").getComponent(Sprite).spriteFrame = Tools.getRandomByArray(this.btn_Sprite)
            content.addChild(node)
            downList.push(node)
        }
        content.children[0].active = false
        //new WechatApi.gameBox().init(downList, null, Constant.EXPORT_TYPE.GAME_BOX_TWO, true, this)
    }

    public show(param: any) {
        //WechatApi.bottomAdv.hide()
        this._param = param
        Tools.changeNodePosition(this.continue_btn)
        this.schedule(() => {
            Tools.scrollViewOneItem(this.scrollView, "v")
        }, Global.config.gameBoxMoveInterval, macro.REPEAT_FOREVER)
        this.schedule(this._scrollBox, Global.config.gameBoxMoveInterval, macro.REPEAT_FOREVER)
        //判断是否强制导出
        let willDo = () => {
            if (Tools.checkCheat(this._config.cheat_probability)) {
                this.scheduleOnce(() => {
                    Tools.setExportPos(this.continue_btn)
                    //WechatApi.bottomAdv.show()
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
        this._param.boxPromise(true);
    }

    private _scrollBox() {
        Tools.scrollViewOneItem(this.scrollView)
    }

    update(dt) {





        let viewPos = this.view.parent.convertToWorldSpaceAR(this.view.getPosition());
        let viewBox = rect(viewPos.x - this.view.width / 2, viewPos.y - this.view.height / 2, this.view.width, this.view.height);
        for (let i = 0; i < this.content.children.length; i++) {
            let list = this.content.children;
            if (viewBox.intersects(list[i].getBoundingBoxToWorld())) {
                list[i].opacity = 255;
            } else {
                list[i].opacity = 0;
            }
        }
    }
}
