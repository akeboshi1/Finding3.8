// import AdvBase from "../AdvBase";
// import WechatApi from "../../API/WechatApi";
// import Tools from "../../../Tools";
// import Global from "../../../Global";
// import Emit from "../../Emit/Emit";
// import {EventCode} from "../../Emit/EmitData";
// import GameLogMgr from "../../GameLogMgr";
// import Game from "../../../../Scene/Game";
// import JiuWuSDK from "../../../../SDK/JiuWuSDK";
// import Constant from "../../../Constant";
//
// export default class WechatBanner extends AdvBase {
//     private bannerINS: any = null  //初始化的banner
//     private isNew: boolean = false
//     private initOk: boolean = false
//
//     /**
//      * 初始化 banner
//      */
//     public static instance(): WechatBanner {
//         if (this._instance === null) {
//             this._instance = new WechatBanner();
//         }
//         return this._instance;
//     }
//
//     public init() {
//         if (!this.isWechat()) {
//             GameLogMgr.warn("当前不是微信环境 , banner 无法初始化")
//             return;
//         }
//
//         if (!Game.Ins.banner) {
//             GameLogMgr.warn("bannerBox尚未初始化完成!")
//             Emit.instance().on(EventCode.BannerBoxInitOver, this.init, this)
//             return
//         }
//
//         //如果通过上面这一关 , 就可以取消监听了..
//         Emit.instance().off(EventCode.BannerBoxInitOver, this.init, this)
//
//         if (this.isInit()) {
//             GameLogMgr.warn('banner 已经初始化完成 ... ');
//             return;
//         }
//
//         if (Global.config.adv_unit_conf.banner.length == 0) {
//             GameLogMgr.warn('未配置 banner id ... ')
//             return
//         }
//
//         //创建ann
//         this.buildBanner();
//         this._isInit = true;
//     }
//
//     /**
//      * 重新创建 一个banner   index : 创建的下标
//      * @param index
//      * @private
//      */
//
//     private buildBanner() {
//         let banner = this._createBanner()
//         banner.onLoad(() => {
//             this.initOk = true
//             this.bannerINS = banner
//             this.isNew = true
//             Emit.instance().emit(EventCode.BannerOrGridInitOK, 0);
//             this.refreshBanner()
//             banner.offLoad()
//         });
//         banner.onError((err) => {
//             GameLogMgr.warn('banner初始化 广告错误: ', err);
//             window.setTimeout(() => {
//                 this.buildBanner()
//             }, 1000 * Global.config.adv_unit_conf.bottomReconnectInterval)
//             banner.offError()
//             banner.destroy()
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
//         if (Global.config.adv_unit_conf.banner.length == 0) {
//             return false
//         }
//         if (!this.isInit() || !this.initOk) {
//             return false
//         }
//         if (this.isShow()) {
//             return true
//         }
//         this._isShow = true
//         this.bannerINS.show().then((res) => {
//             if (this.isNew) {
//                 JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.NEW_BANNER_SHOW).then()
//                 this.isNew = false
//             } else {
//                 JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.OLD_BANNER_SHOW).then()
//             }
//         }, (error) => {
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
//     private _createBanner(): any {
//         let banner_exm = Game.Ins.banner
//         let size = Tools.getRealSize(banner_exm)
//         // 创建 Banner 广告实例，提前初始化
//         let adId = Tools.getRandomByArray(Global.config.adv_unit_conf.banner)
//
//         let bannerParam = {
//             adUnitId: adId,
//             style: {
//                 left: size.left,
//                 top: size.top,
//                 width: size.width,
//                 height: size.height
//             }
//         };
//
//         let banner: any = null
//         WechatApi.systemInterface_do("createBannerAd", (res) => {
//             banner = res
//         }, null, bannerParam)
//
//         banner.onResize((res) => {
//             let size1 = Tools.getRealSize(banner_exm, res.width, res.height)
//             banner.style.left = size1.left
//             banner.style.top = size1.top
//             banner.offResize()
//         })
//         return banner
//     }
//
//     private refreshBanner(): any {
//         window.setInterval(() => {
//             let banner = this._createBanner()
//             banner.onLoad(() => {
//                 this.replaceBanner(banner)
//                 banner.offLoad()
//             })
//             banner.onError((error) => {
//                 GameLogMgr.warn("刷新banner失败", error)
//                 banner.offError()
//                 banner.destroy()
//             })
//         }, 1000 * Global.config.adv_unit_conf.banner_freshTime)
//     }
//
//     public activeRefreshBanner(): any {
//         let banner = this._createBanner()
//         banner.onLoad(() => {
//             this.replaceBanner(banner)
//             banner.offLoad()
//         })
//         banner.onError((error) => {
//             GameLogMgr.warn("主动刷新banner失败", error)
//             banner.offError()
//             banner.destroy()
//         })
//     }
//
//     //判断banner是否可以用
//     public active(): boolean {
//         if (this.bannerINS) {
//             return true
//         } else {
//             return false
//         }
//     }
//
//     private replaceBanner(banner: any) {
//         if (this.isShow()) {
//             this.bannerINS.hide()
//             this.bannerINS.destroy()
//             this.bannerINS = banner
//             this.bannerINS.show()
//             JiuWuSDK.pushAction(4, Constant.BOTTOM_TYPE.NEW_BANNER_SHOW).then()
//         } else {
//             this.isNew = true
//             this.bannerINS.destroy()
//             this.bannerINS = banner
//         }
//     }
// }
