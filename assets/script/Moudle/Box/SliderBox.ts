import {_decorator,ScrollView,tween,Node,instantiate,UITransform,Vec3,macro} from "cc";
import Global from "db://assets/script/Common/Global";
import Tools from "db://assets/script/Common/Tools";
import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Constant from "../../Common/Constant";

const {ccclass, property,integer} = _decorator;

@ccclass
export default class SliderBox extends LayerPanel {

    public static getUrl(): UrlInfo {
        return {
            bundle: "sliderBox",
            name: "sliderBox",
        }
    }

    @property(integer)
    private moveTime: number = 0

    private btn: Node = null;
    private scrollView: ScrollView = null;
    private content: Node = null;
    // private gameBox: WechatGameBox = null
    private openFlag: boolean = false; //默认没有打开
    private moveFlag: boolean = false;

    initUI() {
        this.node.active = false;
        this.btn = this.getNode("qian")
        this.scrollView = this.getNode("scrollView").getComponent(ScrollView)
        this.content = this.scrollView.content;
        let itemExam = this.content.children[0]
        let nodeList: Node [] = []
        for (let i = 0; i < Global.exportInfo.length; i++) {
            let node = instantiate(itemExam)
            node.active = true
            this.content.addChild(node)
            nodeList.push(node)
        }
        itemExam.active = false
        // this.gameBox = new WechatApi.gameBox()
        // this.gameBox.init(nodeList, null, Constant.EXPORT_TYPE.GAME_BOX_SLIDER, true, this)

        this.onTouch(this.btn, this.do)

    }

    do() {
        if (this.moveFlag) {
            return
        }

        this.moveFlag = true;
        let uiTransform = this.node.getComponent(UITransform);
        if (!this.openFlag) { //没打开需要打开
            tween(this.node)
                .by(this.moveTime, {position: new Vec3(uiTransform.width,this.node.position.y)})
                .call(() => {
                    this.moveFlag = false
                })
                .start()
        } else {
            tween(this.node)
                .by(this.moveTime, {position: new Vec3(-uiTransform.width,this.node.position.y)})
                .call(() => {
                    this.moveFlag = false
                })
                .start()
        }
        this.openFlag = !this.openFlag
        this.updateArrows()
    }

    updateArrows() {
        let node = this.btn.children[0];
        node.scale = new Vec3(-node.scale.x,node.scale.y);
    }

    hide() {
        if (this.openFlag) {
            let uiTransform = this.node.getComponent(UITransform);
            this.node.setPosition(new Vec3(-uiTransform.width,this.node.position.y));
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
        }, Global.config.gameBoxMoveInterval, macro.REPEAT_FOREVER)
    }
}
