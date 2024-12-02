import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Global from "../../Common/Global";
import WechatApi from "../../Common/manage/API/WechatApi";
import Tools from "../../Common/Tools";
import GameLog from "../../Common/manage/GameLogMgr";
import ActionMgr from "../../Common/manage/ActionMgr";
import PanelMgr from "../../Common/manage/PanelMgr";

const {ccclass} = cc._decorator;

@ccclass
export default class ThreeBox extends LayerPanel {

    public static getUrl(): UrlInfo {
        return {
            bundle: "threeBox",
            name: "threeBox",
        };
    }

    private _param = null;

    private _nodeContinueBtn: cc.Node = null;

    private _nodeGameBoxItem: cc.Node = null;

    private _targetPosition: cc.Vec3 = null;

    private _scrollView: cc.ScrollView = null;

    private _nodeGameBox: cc.Node = null;

    private _nodeContainer: cc.Node = null;

    private view: cc.Node = null;

    private content: cc.Node = null;

    public initUI() {
        this._nodeContainer = this.getNode('table');
        this._nodeContinueBtn = this.getNode('table/button');
        this._targetPosition = this._nodeContinueBtn.getPosition().clone();
        this._nodeGameBox = this.getNode('table/gameBox');
        this._scrollView = this._nodeGameBox.getComponent(cc.ScrollView);
        this._nodeGameBoxItem = this._scrollView.content.children[0];
        this._nodeGameBoxItem.position = new cc.Vec3(0, 0, 0);
        this._nodeGameBoxItem.active = false;
        this.view = this._nodeGameBox.getChildByName('view');
        this.content = this.view.getChildByName('content');

        let nodeList = [];
        //根据导出总数量， 创建一个导出节点列表
        for (let i = 0; i < Global.exportInfo.length; i++) {
            let node = cc.instantiate(this._nodeGameBoxItem);
            node.active = true;
            nodeList.push(node);
            this._scrollView.content.addChild(node);
        }

        this._gameBox = new WechatApi.gameBox();
        this._gameBox.init(nodeList, 1, 'Three盒子', true, this);
    }

    public show(param: any) {
        try {
            WechatApi.bottomAdv.hide();  //隐藏 banner
            this._param = param;

            if (this._gameBox !== null) {
                this._gameBox.show();
            }
            ActionMgr.moveTop(this.node.getChildByName('table'));

            Tools.changeNodePosition(this._nodeContinueBtn);

            //判断是否需要导出
            let conf1 = Global.config.exportConfig[2];
            if (Tools.checkPer(conf1.force_export)) {
                Tools.forceExport(() => {
                    this.playIn();
                }, () => {
                    this.playIn();
                })
            } else {
                this.playIn();
            }
        } catch (e) {
            GameLog.error('显示异常', e);
        }
    }

    public hide() {
        this.unscheduleAllCallbacks();
        this.offTouch(this._nodeContinueBtn)
        if (this._gameBox !== null) {
            this._gameBox.hide();
        }
        this.playOut();
        this._param.boxPromise(true);
    }

    public playIn() {
        let conf1 = Global.config.exportConfig[2]
        if (Tools.checkCheat(conf1.cheat_probability)) {
            //设置 btn 位置 在 banner 位置
            this._nodeContinueBtn.active = true
            //指定一段时间 显示banner
            this.scheduleOnce(() => {
                WechatApi.bottomAdv.show()  //显示banner
                this.scheduleOnce(() => {
                    WechatApi.bottomAdv.hide()  // banner 在显示一段时间之后关闭
                    //注册事件
                    this.onTouch(this._nodeContinueBtn, () => {
                        // UIMgr.closeUI(ThreeBox, false);
                        PanelMgr.INS.closePanel(ThreeBox)
                        // Tools.viewExport(this._param.data, ThreeBox);
                    });

                    //这个时候 ，触发 随机
                    //随机获取一个出现次数
                    let showCount = Tools.getRandom(conf1.cheat.randShowBannerCountSection.min, conf1.cheat.randShowBannerCountSection.max)
                    let timeSum = 0
                    for (let i = 0; i < showCount; i++) {
                        //banner  显示的时间
                        let showTime = Tools.getRealRandom(conf1.cheat.randShowBannerTimeSection.min, conf1.cheat.randShowBannerTimeSection.max)
                        //下一次  随机显示banner 的间隔
                        let interval = Tools.getRealRandom(conf1.cheat.randShowBannerIntervalSection.min, conf1.cheat.randShowBannerIntervalSection.max)
                        timeSum += interval


                        if (showCount == i + 1) {  //最后一次 随机骗点 不关闭 banner
                            this.scheduleOnce(() => {
                                WechatApi.bottomAdv.show()
                                this.scheduleOnce(() => {
                                    Tools.setExportPos_Animation(conf1.buttonMoveUp, this._nodeContinueBtn)
                                }, showTime)
                            }, timeSum)

                        } else {
                            this.scheduleOnce(() => {
                                WechatApi.bottomAdv.show()
                                this.scheduleOnce(() => {
                                    WechatApi.bottomAdv.hide()
                                }, showTime)
                            }, timeSum)
                        }
                        timeSum += showTime
                    }

                }, conf1.cheat.showBannerTime)

            }, conf1.cheat.btnShowTime)

        } else {
            this._nodeContinueBtn.active = false;
            WechatApi.bottomAdv.show();   //显示banner
            //设置btn 位置 为banner 上方
            Tools.setExportPos(this._nodeContinueBtn);
            //注册事件
            this.onTouch(this._nodeContinueBtn, () => {
                // Tools.viewExport(this._param.data, ThreeBox);
                PanelMgr.INS.closePanel(ThreeBox)
            });
            //一段时间之后才会显示 btn
            this.scheduleOnce(() => {
                this._nodeContinueBtn.active = true;
            }, conf1.noCheat.btnShowTime);
        }

        let way = () => {
            Tools.scrollView_auto_vertical(this._scrollView, 1);
            this.scheduleOnce(() => {
                way();
            }, 1)
        }
        way()
    }

    public playOut() {
    }

    public onDestroy() {
    }

    update(dt) {
        let viewPos = this.view.parent.convertToWorldSpaceAR(this.view.getPosition());
        let viewBox = cc.rect(viewPos.x - this.view.width / 2, viewPos.y - this.view.height / 2, this.view.width, this.view.height);
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
