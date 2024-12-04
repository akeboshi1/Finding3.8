import Global from "db://assets/script/Common/Global";
import WechatGameBox from "db://assets/script/Common/manage/ADV/Wechat/WechatGameBox";
import WechatApi from "db://assets/script/Common/manage/API/WechatApi";
import Tools from "db://assets/script/Common/Tools";
import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Constant from "../../Common/Constant";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SliderBox extends LayerPanel {

    public static getUrl(): UrlInfo {
        return {
            bundle: "sliderBox",
            name: "sliderBox",
        }
    }

    @property(cc.Integer)
    private moveTime: number = 0
    private btn: cc.Node = null
    private scrollView: cc.ScrollView = null
    private content: cc.Node = null
    private gameBox: WechatGameBox = null
    private openFlag: boolean = false //默认没有打开
    private moveFlag: boolean = false

    initUI() {
        this.node.active = false
        this.btn = this.getNode("qian")
        this.scrollView = this.getNode("scrollView").getComponent(cc.ScrollView)
        this.content = this.scrollView.content
        let itemExam = this.content.children[0]
        let nodeList: cc.Node [] = []
        for (let i = 0; i < Global.exportInfo.length; i++) {
            let node = cc.instantiate(itemExam)
            node.active = true
            this.content.addChild(node)
            nodeList.push(node)
        }
        itemExam.active = false
        this.gameBox = new WechatApi.gameBox()
        this.gameBox.init(nodeList, null, Constant.EXPORT_TYPE.GAME_BOX_SLIDER, true, this)

        this.onTouch(this.btn, this.do)

    }

    do() {
        if (this.moveFlag) {
            return
        }

        this.moveFlag = true
        if (!this.openFlag) { //没打开需要打开
            cc.tween(this.node)
                .by(this.moveTime, {x: this.node.width})
                .call(() => {
                    this.moveFlag = false
                })
                .start()
        } else {
            cc.tween(this.node)
                .by(this.moveTime, {x: -this.node.width})
                .call(() => {
                    this.moveFlag = false
                })
                .start()
        }
        this.openFlag = !this.openFlag
        this.updateArrows()
    }

    updateArrows() {
        this.btn.children[0].scaleX = -this.btn.children[0].scaleX
    }

    hide() {
        if (this.openFlag) {
            this.node.x = -this.node.width
        }
        this.node.active = false
    }

    show(param: any): void {
        this.node.active = true
        if (param.code > 1) {
            //如果code  = 2 的时候，就自动打开
            this.scheduleOnce(() => {
                this.do()
            }, 0)
        }
        this.schedule(() => {
            Tools.scrollViewOneItem(this.scrollView, "v")
        }, Global.config.gameBoxMoveInterval, cc.macro.REPEAT_FOREVER)
    }
}
