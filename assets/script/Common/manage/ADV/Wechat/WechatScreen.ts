// /**
//  * 插屏组件
//  * 1. 每次show后会重新拉取新的内容
//  */
// import AdvBase from "../AdvBase";
// import WechatApi from "../../API/WechatApi";
// import Global from "../../../Global";
// import GameLogMgr from "../../GameLogMgr";
// import winSize = cc.winSize;
//
// export default class WechatScreen extends AdvBase { // 显示广告
//
//     public static instance(): AdvBase {
//         if (this._instance === null) {
//             this._instance = new WechatScreen();
//         }
//         return this._instance;
//     }
//
//     public getNode() {
//         return null;
//     }
//
//     private _insertScreeAd: any = null;
//     private _onclose2: any = null; //关闭时候 函数
//     private _insertScreenLoadOk: boolean = false //插屏广告初始化失败
//
//     // 初始化广告
//     public init() {
//         try {
//             if (this.isInit() || !this.isWechat()) {
//                 GameLogMgr.warn('插屏广告 return ... ');
//                 return;
//             }
//             let aid = Global.config.adv_unit_conf.screen
//             if (aid === '' || aid === null || aid === undefined) {
//                 GameLogMgr.warn(' 无插屏广告 id ... ');
//                 return;
//             }
//
//             WechatApi.systemInterface_do('createInterstitialAd', (value) => {
//                 this._insertScreeAd = value;
//             }, null, ({
//                 adUnitId: aid
//             }));
//
//             this.load()
//
//             this._insertScreeAd.onError((err) => {
//                 this._insertScreeAd.offError()
//             })
//
//             this._insertScreeAd.onClose(() => {
//                 this._onclose()
//                 this._insertScreenLoadOk = false
//                 this.load()
//             })
//         } catch {
//         }
//     }
//
//     private _onclose() {
//         //判断  关闭函数是否可用
//         if (this._onclose2) {
//             if (this._onclose2 instanceof Function) {
//                 this._onclose2()  //执行函数，并且之后清楚 ，避免下次执行同样的回调
//                 this._onclose2 = null
//                 return
//             }
//         }
//     }
//
//     //加载
//     private load() {
//         try {
//             this._insertScreeAd.load().then(() => {
//                 GameLogMgr.log("插屏广告加载成功", cc.director.getScene().name)
//                 if (!this._isInit) {
//                     this._isInit = true
//                 }
//                 this._insertScreenLoadOk = true
//             }, (error) => {
//                 GameLogMgr.warn("插屏广告加载失败", error)
//                 window.setTimeout(() => {
//                     this.load()
//                 }, 1000 * Global.config.adv_unit_conf.screen_reconnect_interval)
//             })
//         } catch (e) {
//             GameLogMgr.warn(".......screen.Load ", e)
//         }
//     }
//
//     /**
//      *
//      * 显示插屏广告 ，如果 不是微信 环境， 默认调用显示成功函数
//      */
//     public show(param ?: any) {
//         return new Promise((resolve, reject) => {
//             if (!this.isInit()) {
//                 reject(false)
//                 return;
//             }
//             if (!this._insertScreenLoadOk) {
//                 GameLogMgr.warn("插屏拉取失败....无法展示")
//                 reject(false)
//                 return;
//             }
//             this._insertScreeAd.show().then(() => {
//             }, (error) => {
//                 reject(true)
//             })
//             this._onclose2 = () => {
//                 resolve(true)
//             }
//         })
//     }
//
//     public hide() {   //插屏广告 不需要使用到 hide
//     }
//
// }
