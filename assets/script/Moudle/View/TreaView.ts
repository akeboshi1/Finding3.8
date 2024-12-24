//
// import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
// import Tools from "../../Common/Tools";
// import Global from "../../Common/Global";
// import ActionMgr from "../../Common/manage/ActionMgr";
// import PanelMgr from "../../Common/manage/PanelMgr";
// import {_decorator,Node,UITransform,Vec3,game,Game,TweenSystem} from "cc";
//
//
// const {ccclass} = _decorator;
// @ccclass
// export default class TreaView extends LayerPanel {
//     public static getUrl(): UrlInfo {
//         return {
//             bundle: "treaView",
//             name: "treaView",
//         }
//     }
//
//     private _processBar: Node = null;
//
//     private _nodeBtn: Node = null;
//
//     private _nodeHalo: Node = null;
//
//     private _hand: Node = null;
//
//     private _continueNum: number = 0; //当前连续点击次数
//     private _updateNum: number = 0;   // 已经忽略的 update 次数
//     private _handData = {
//         width: 0,  ///总共宽度
//         num: 0  //连续点击次数
//     };
//
//     private _param: any;
//
//     public initUI() {
//         // 按钮
//         this._nodeBtn = this.getNode('table/button');
//         // 进度条
//         this._processBar = this.getNode('table/bar/mask');
//         let processBarParentUITransform = this._processBar.parent.getComponent(UITransform);
//         let processBarUITransform = this._processBar.getComponent(UITransform);
//         this._processBar.setPosition(new Vec3(-processBarParentUITransform.width / 2,this._processBar.position.y));
//         processBarUITransform.width = 0;
//         // 背景光
//         this._nodeHalo = this.getNode("table/halo");
//
//         // Tools.changeNodePosition(this._nodeBtn);
//
//         ActionMgr.shakeStop(this.getNode('table/title'), 0.1, 5);
//         ActionMgr.shakeStop(this.getNode('table/button'), 0.1, 2);
//         ActionMgr.shakeStop(this.getNode('table/box'), 0.1, 1);
//     }
//
//
//     public show(param) {
//         this._param = param;
//         let data = Global.config.chest_Config;
//
//         ActionMgr.moveIn(this._nodeHalo);
//
//         // WechatApi.bottomAdv.hide();
//         //
//         // this.scheduleOnce(() => {
//         //     WechatApi.bottomAdv.hide();
//         // }, 0.5);
//
//         this._handData.num = Tools.getRandom(data.continue_click.min, data.continue_click.max);
//         let processBarParentUITransform = this._processBar.parent.getComponent(UITransform);
//         let processBarUITransform = this._processBar.getComponent(UITransform);
//         this._handData.width = Math.ceil(processBarParentUITransform.width) * Global.config.chest_Config.width;
//
//         this.onTouch(this._nodeBtn, () => {
//             //获取当前宽度 距离目标宽度 的间隔
//             processBarUITransform.width += (this._handData.width - processBarUITransform.width) / 3
//             this._continueNum++
//             if (this._continueNum >= this._handData.num) {
//                 this._continueNum = 0;
//                 PanelMgr.INS.closePanel(TreaView)
//             }
//             if (Tools.checkPer(50)) {
//                 this.getNode('table/box1').active = true;
//                 this.getNode('table/box').active = false;
//             } else {
//                 this.getNode('table/box').active = true;
//                 this.getNode('table/box1').active = false;
//             }
//         });
//
//         // 是否强制骗点
//         if (Global.config.chest_Config.force) {
//             game.on(Game.EVENT_HIDE, () => {
//                 PanelMgr.INS.closePanel(TreaView)
//             });
//         }
//     }
//
//     protected update(dt: number): void {
//         if (this._updateNum >= 60) {
//             //清空
//             this._updateNum = 0
//             this._continueNum = 0
//         } else {
//             this._updateNum++
//         }
//         let processBarUITransform = this._processBar.getComponent(UITransform);
//         if (processBarUITransform.width > 0.1) {
//             processBarUITransform.width -= this._handData.width * 0.01;
//         }
//
//     }
//
//     public hide() {
//         TweenSystem.instance.ActionManager.removeAllActionsFromTarget(this._nodeHalo);
//         this._param.promise(true);
//     }
// }
