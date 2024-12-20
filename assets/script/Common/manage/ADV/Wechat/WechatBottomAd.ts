// /**
//  * 展示底部广告的一个封装
//  * 底部广告包括， 格子  底部导出  banner  ，这3个直接封装在一起
//  */
// import WechatBanner from "./WechatBanner";
// import Global from "../../../Global";
// import Emit from "../../Emit/Emit";
// import BannerBox from "../../../../Moudle/Box/BannerBox";
// import GameLogMgr from "../../GameLogMgr";
// import CacheMgr from "../../CacheMgr";
// import {EventCode} from "../../Emit/EmitData";
// import WechatCustom from "./WechatGrid";
// import Game from "../../../../Scene/Game";
// import Tools from "../../../Tools";
//
// export default class WechatBottomAd {
//     public bannerIns: WechatBanner = WechatBanner.instance()
//     private customIns: WechatCustom = WechatCustom.instance()
//
//     // banner 节点
//     private _bannerAdvView: BannerBox = null;
//     private showIndex: number = -1
//     private order: number [] = [] //底部广告执行顺序
//
//     private refreshIntervalId: number = 0 //刷新定时器id
//     private refreshTime: number = 30 // 刷新时间
//     private bottomType: number = 0  //类型   1 普通不是  2曝光量模式
//
//
//     private static _instance: WechatBottomAd = null
//
//     public static instance(): WechatBottomAd {
//         if (!this._instance) {
//             this._instance = new WechatBottomAd()
//         }
//         return this._instance
//     }
//
//     /**
//      * 获取 banner 节点
//      */
//     public getNode() {
//         if (this._bannerAdvView !== null) {
//             return this._bannerAdvView.banner;
//         }
//         return null;
//     }
//
//     public init() {
//         this.order = Global.config.adv_unit_conf.showBottomAdOrder;    //获取配置
//         this.bannerIns.init();
//         this.customIns.init()
//         // this.bottomType = Global.config.adv_unit_conf.bottomAdType
//         Emit.instance().on(EventCode.BannerOrGridInitOK, this.judgeIsNeedResetShow, this)
//         this.refreshTime = Global.config.adv_unit_conf.banner_freshTime
//     }
//
//     public show() {
//         if (this.showIndex >= 0) {
//             GameLogMgr.warn("不可重复show  bottomAd")
//             return
//         }
//         LOOP: for (let i = 0; i < this.order.length; i++) {
//             //判断执行类型
//             switch (this.order[i]) {
//                 case 0 :  //显示banner
//                     if (this.bannerIns.show()) {
//                         Global.isShowBanner = true
//                         this.showIndex = 0
//                         break LOOP
//                     } else {
//                         break
//                     }
//                 case 1 :  //显示格子
//                     if (this.customIns.show()) {
//                         this.showIndex = 1
//                         break LOOP
//                     } else {
//                         break
//                     }
//                     break
//                 case 2 :  //显示自身导出
//                     Game.Ins.showBottomAdv()
//                     this.showIndex = 2
//                     break
//                 default:
//                     break
//             }
//         }
//         // this.refresh()
//     }
//
//     public hide() {
//         if (this.showIndex < 0) {
//             GameLogMgr.warn("不可重复 hide bottomAd")
//             return
//         }
//         switch (this.showIndex) {
//             case 0 :
//                 this.bannerIns.hide()
//                 Global.isShowBanner = true
//                 break
//             case 1 :
//                 this.customIns.hide()
//                 break
//             case 2 :
//                 Game.Ins.hideBottomAdv()
//                 break
//         }
//         this.showIndex = -1
//     }
//
//     //判断是不是在 banner 或者是格子广告加载成功的时候 重新show()
//     public judgeIsNeedResetShow(code: number) {
//         if (this.showIndex < 0) {
//             return;
//         }
//         let codeIndex = Global.config.adv_unit_conf.showBottomAdOrder.indexOf(code)
//         let index = Global.config.adv_unit_conf.showBottomAdOrder.indexOf(this.showIndex)
//         if (index <= codeIndex || codeIndex < 0) {
//             return
//         }
//         this.hide()
//         this.show()
//     }
// }
