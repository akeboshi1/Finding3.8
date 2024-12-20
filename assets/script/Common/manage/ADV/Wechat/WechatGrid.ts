// import AdvBase from "../AdvBase";
// import WechatApi from "../../API/WechatApi";
// import Tools from "../../../Tools";
// import Global from "../../../Global";
// import Emit from "../../Emit/Emit";
// import {EventCode} from "../../Emit/EmitData";
// import GameLogMgr from "../../GameLogMgr";
// import JiuWuSDK from "../../../../SDK/JiuWuSDK";
// import Constant from "../../../Constant";
//
// export default class WechatCustom extends AdvBase {
//     private bannerINS: any = null  //初始化的banner
//     private isNew: boolean = false
//     private initOk: boolean = false
//
//     /**
//      * 初始化 banner
//      */
//     public static instance(): WechatCustom {
//         if (this._instance === null) {
//             this._instance = new WechatCustom();
//         }
//         return this._instance;
//     }
//
//     public init() {
//         if (!this.isWechat()) {
//             GameLogMgr.warn("当前不是微信环境 , custom  无法初始化")
//             return;
//         }
//
//         if (this.isInit()) {
//             GameLogMgr.warn('custom  已经初始化完成 ... ');
//             return;
//         }
//
//         if (Global.config.adv_unit_conf.custom.length == 0) {
//             GameLogMgr.warn('未配置 custom id ... ')
//             return
//         }
//         this.buildCustom();
//
//         this._isInit = true;
//     }
//
//     /**
//      * 重新创建 一个custom    index : 创建的下标
//      * @param index
//      * @private
//      */
//     private buildCustom() {
//         let custom = this._createCustom()
//         custom.onLoad((res) => {
//             //证明之前是没有初始化成功的，需要去通知bannerBox 隐藏自己的 导出banner ，显示真正的custom
//             this.initOk = true;
//             this.bannerINS = custom
//             this.isNew = true
//             Emit.instance().emit(EventCode.BannerOrGridInitOK, 1);
//             this.refreshCustom()
//             custom.offLoad()
//         });
//         custom.onError((err) => {
//             GameLogMgr.warn('custom初始化 广告错误: ', err);
//             window.setTimeout(() => {
//                 this.buildCustom()
//             }, 1000 * Global.config.adv_unit_conf.bottomReconnectInterval)
//             custom.offError()
//             custom.destroy()
//         });
//     }
//
//     /**
//      * 获取 banner 节点
//      */
//     public getNode() {
//         return null;
//     }
//
//     /**
//      * 显示banner广告
//      */
//     public show() {
//         if (!this.isWechat()) {
//             return false
//         }
//         if (Global.config.adv_unit_conf.custom.length == 0) {
//             return false
//         }
//         if (!this.isInit() || !this.initOk) {
//             return false
//         }
//
//         if (this.isShow()) {
//             return true
//         }
//
//         this._isShow = true
//         this.bannerINS.show().then((res) => {
//             JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.NEW_CUSTOM_SHOW).then()
//         }, (error) => {
//             JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.OLD_CUSTOM_SHOW).then()
//         })
//         return true
//     }
//
//     /**
//      * 隐藏banner广告
//      */
//     public hide() {
//         if (!this.isInit() || !this.isShow()) {
//             return
//         }
//         this._isShow = false;
//         this.bannerINS.hide()
//         return
//     }
//
//     private _createCustom(): any {
//         // 创建 Custom  广告实例，提前初始化
//         let adId = Tools.getRandomByArray(Global.config.adv_unit_conf.custom)
//         let info = Tools.getCustomAd()
//         let bannerParam = {
//             adUnitId: adId,
//             style: {
//                 left: info.left,
//                 top: info.top,
//             }
//         };
//         let custom: any = null
//         WechatApi.systemInterface_do("createCustomAd", (res) => {
//             custom = res
//         }, null, bannerParam)
//         return custom
//     }
//
//     private refreshCustom(): any {
//         window.setInterval(() => {
//             let custom = this._createCustom()
//             custom.onLoad(() => {
//                 this.replaceBanner(custom)
//                 custom.offLoad()
//             })
//             custom.onError((error) => {
//                 GameLogMgr.warn("刷新custom失败", error)
//                 custom.offError()
//                 custom.destroy()
//             })
//         }, 1000 * Global.config.adv_unit_conf.banner_freshTime)
//     }
//
//     private replaceBanner(banner: any) {
//         if (this.isShow()) {
//             this.bannerINS.hide()
//             this.bannerINS.destroy()
//             this.bannerINS = banner
//             this.bannerINS.show()
//             JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.NEW_CUSTOM_SHOW).then()
//         } else {
//             this.isNew = true
//             this.bannerINS.destroy()
//             this.bannerINS = banner
//         }
//     }
// }
//
