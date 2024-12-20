// /**
//  * 导出item
//  */
// import WechatApi from "../../API/WechatApi";
// import ActionMgr from "../../ActionMgr";
// import AdvBase from "../AdvBase";
// import Constant from "../../../Constant";
// import Tools from "../../../Tools";
// import Global, {ExportData} from "../../../Global";
// import LoadMgr from "../../LoadMgr";
// import GameLogMgr from "../../GameLogMgr";
// import PondMgr from "../../PondMgr";
//
// export default class WechatGameBox extends AdvBase {
//
//     private _isInterval = false;
//
//     private _parent: cc.Component = null;
//
//     private _refreshTimeOutId: number = -1
//
//     private _nodeTweenType = null;
//
//     private _gameBoxName = 0;
//
//     private _gameIconList: [cc.Node] = null;
//
//     private _currentShowGameBoxList: ExportData[] = [];
//
//     private _handIndex: number = 0;
//
//     private _hand: cc.Node = null;
//
//     private _asset: cc.Asset [] = []
//
//     public getNode() {
//         if (!this._gameIconList) {
//             return [];
//         }
//         return this._gameIconList;
//     }
//
//     /**
//      * @param gameIconList, gameIcon节点list, 每个gameIcon有sprite, title, hot 三个节点，其中sprite必须, title必须是label节点，hot必须挂上hot的图标
//      * 1. 有title节点，会显示title
//      * 2. 有hot节点，并且后台是hot，会把hot节点显示
//      * @param nodeTweenType
//      * @param gameBoxName
//      * @param isInterval | 是否自动刷新
//      * @param parent
//      * @param isShow  加载完之后 图片是否需要显示
//      */
//
//     public init(gameIconList, nodeTweenType = null, gameBoxName: number = 1, isInterval = true, parent: cc.Component = null, isShow = true) {
//         if (this._isInit) {   //如果已经初始化  或者准备初始化 ，就return
//             return;
//         }
//
//         this._handIndex = -1;
//         this._gameBoxName = gameBoxName;
//         this._nodeTweenType = nodeTweenType;
//         this._gameIconList = gameIconList;   //赋值导出项
//
//         this._changeAllIcon(false);  //先全部 隐藏
//
//         this._initSelfGameIcon();
//         this._isInterval = isInterval;
//         this._parent = parent;
//
//         if (this._isInterval && this._parent && this._refreshTimeOutId > 0) {
//             console.log("添加1 ")
//             this._refreshTimeOutId = window.setInterval(() => {
//                 this._updateSelfGameIcon(true);
//             }, 8 * 1000)
//         }
//         this._updateSelfGameIcon(isShow);
//     }
//
//     public show() {
//         if (!this._isInit) {
//             return false;
//         }
//         this._showSelfGameIcon();
//         if (this._isInterval && this._parent && this._refreshTimeOutId > 0) {
//             // this._parent.schedule(() => {
//             //     this._updateSelfGameIcon(true);
//             // }, 8);
//             console.log("添加")
//             this._refreshTimeOutId = window.setInterval(() => {
//                 console.log("执行计时器")
//                 this._updateSelfGameIcon(true);
//             }, 8 * 1000)
//         }
//     }
//
//     public hide() {
//         console.log("清空")
//         window.clearInterval(this._refreshTimeOutId)
//         this._hideSelfGameIcon();
//     }
//
//     private _hideSelfGameIcon() {
//         if (!this._isInit) {
//             return false;
//         }
//         for (let i = 0; i < this._gameIconList.length; i++) {
//             this._gameIconList[i].active = false;
//         }
//     }
//
//     private _showSelfGameIcon() {
//         for (let i = 0; i < this._currentShowGameBoxList.length; i++) {
//             if (i < this._gameIconList.length) {
//                 this._gameIconList[i].active = true;
//             }
//         }
//     }
//
//     private _changeAllIcon(isShow) {
//         let i;
//         let j = 0;
//         for (i = 0; i < this._gameIconList.length; i++) {
//             let node = this._gameIconList[i];
//             if (!node) {
//                 continue
//             }
//             for (j = 0; j < node.childrenCount; j++) {
//                 node.children[j].active = isShow;
//             }
//         }
//     }
//
//     private _updateSelfGameIcon(isShow: boolean) {
//         let gameBoxInfo = Tools.getGameBox();
//         this._currentShowGameBoxList = gameBoxInfo;
//         for (let i = 0; i < this._gameIconList.length; i++) {
//             this._gameIconList[i].active = false;
//             if (this._handIndex === i) {
//                 // let hasNode = this._gameIconList[i];
//                 // let handNode = hasNode.getChildByName('hand');
//                 // PondMgr.putNodeToPool('hand', handNode);
//             }
//         }
//         this._handIndex = Tools.getRandom(0, this._gameIconList.length);
//
//         for (let i = 0; i < gameBoxInfo.length; i++) {
//             if (i >= this._gameIconList.length) {
//                 continue;
//             }
//             let gameIcon = gameBoxInfo[i];
//             let node = this._gameIconList[i];
//             node.active = true;
//             // if (this._handIndex === i) {
//             //     let handNode = PondMgr.getNodeFromPool('hand');
//             //     handNode.parent = node;
//             //     handNode.scale = 0.6;
//             //     handNode.setPosition(cc.v2(0, 0));
//             // }
//             let sprite = node.getChildByName('sprite');
//             if (!sprite && node.getChildByName('mask')) {
//                 sprite = node.getChildByName('mask').getChildByName('sprite');
//             }
//
//             let title = node.getChildByName('title');
//             if (!title && node.getChildByName('title_bg') && node.getChildByName('title_bg').getChildByName("title")) {
//                 node.getChildByName('title_bg').getChildByName("title").getComponent(cc.Label).string = gameIcon.gameTargetName;
//             } else if (title) {
//                 node.getChildByName('title').getComponent(cc.Label).string = gameIcon.gameTargetName;
//             }
//
//             // 是否热门标志
//             let hot = node.getChildByName('hot');
//             if (hot) {
//                 hot.active = gameIcon.isPopular == 1;
//             }
//
//             if (!gameIcon.iconImg) {
//                 continue;
//             }
//
//             //更新导出的图片信息
//             LoadMgr.loadRemoteSprite(gameIcon.iconImg, sprite.getComponent(cc.Sprite), isShow).then((text: cc.Texture2D) => {
//                 this._asset.push(text)
//             });
//         }
//     }
//
//     //初始化自身gameIcon
//     private _initSelfGameIcon() {
//         if (this._isInit) {
//             GameLogMgr.log('self gameIcon已经初始化');
//             return false;
//         }
//
//         // if (!WechatApi.systemInterface.navigateToMiniProgram) {
//         // cc.error('创建自己的gameIcon失败，基础库不能导出');
//         // return false;
//         // }
//
//         // 把子节点全部显示
//         this._changeAllIcon(true);
//         this._isInit = true;  //设置初始化成功标识
//
//         for (let i = 0; i < this._gameIconList.length; i++) {
//             let node = this._gameIconList[i];
//             node.active = false;   //真是无语子
//             switch (this._nodeTweenType) {  //这边是筛选  item 导出格式
//                 case Constant.GAME_BOX_TWEEN_TYPE.SHAKE_STOP: {
//                     ActionMgr.shakeStop(node, 0.1, 2 * (1 + Math.random() * i), 15, 3);
//                     break;
//                 }
//                 case Constant.GAME_BOX_TWEEN_TYPE.SHAKE_FOREVER: {
//                     ActionMgr.shakeNodeForever(node, 3, 8);
//                     break;
//                 }
//                 case Constant.GAME_BOX_TWEEN_TYPE.SCALE_MOVE: {
//                     ActionMgr.scaleMove(node);
//                     break;
//                 }
//             }
//
//             //判断内部有没有button 如果有 ，则设置给按钮
//             let button: cc.Node = node.getChildByName("btn")
//             if (button) {
//                 button.on(cc.Node.EventType.TOUCH_END, () => {
//                     if (this._hand) {
//                         this._hand.stopAllActions();
//                         this._hand.destroy();
//                     }
//                     if (this._currentShowGameBoxList[i]) {
//                         Tools.navigateTo(this._currentShowGameBoxList[i], this._gameBoxName);
//                     }
//                 }, this);
//             } else {
//                 node.on(cc.Node.EventType.TOUCH_END, () => {
//                     if (this._hand) {
//                         this._hand.stopAllActions();
//                         this._hand.destroy();
//                     }
//                     if (this._currentShowGameBoxList[i]) {
//                         Tools.navigateTo(this._currentShowGameBoxList[i], this._gameBoxName);
//                     }
//                 }, this);
//             }
//         }
//     }
//
//     //清空缓存
//     public clear() {
//         this._asset.forEach((value) => {
//             cc.assetManager.releaseAsset(value)
//         })
//     }
// }
