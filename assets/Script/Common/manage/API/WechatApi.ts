// import AdvBase from "../ADV/AdvBase";
// import AdvFree from "../ADV/AdvFree";
// import WechatGameBox from "../ADV/Wechat/WechatGameBox";
// import WechatVideo from "../ADV/Wechat/WechatVideo";
// import WechatScreen from "../ADV/Wechat/WechatScreen";
// import WechatBottomAd from "../ADV/Wechat/WechatBottomAd";
// import AppApi from "./AppApi";
// import GameLogMgr from "../GameLogMgr";
// import spawn = cc.spawn;
// import TTAPI from "./TTAPI";
// import Global from "../../Global";
//
//
// export default class WechatApi {
//     // banner
//     public static bottomAdv: WechatBottomAd = WechatBottomAd.instance();
//
//     public static gameBox: new() => WechatGameBox = WechatGameBox;  //这边修改了原来的 any ，去除了没有提示的坏处
//
//     public static screenAdv: AdvBase = WechatScreen.instance();
//
//     public static rewardedVideo: AdvBase = WechatVideo.instance();
//
//     // 开屏广告
//     // public static splashAd: AdvBase = AdvFree.instance();
//
//     // 信息流广告
//     // public static nativeExpressAd: AdvBase = AdvFree.instance();
//
//     // 存储，分享等interface，具体参数参考微信小游戏接口
//     public static systemInterface: any = null;
//
//     public static systemInterface_do(way: string, call: Function, fall: Function, ...args) {
//         if (typeof WechatApi.systemInterface[way] !== "function") {
//             GameLogMgr.warn("systemInterface is no has the way ", way)
//             if (fall) {
//                 fall()
//             }
//             return
//         }
//         let f = WechatApi.systemInterface[way]
//         let nf = f.bind(null, ...args)
//         if (call) {
//             call(nf())
//         } else {
//             nf()
//         }
//     }
//
//     public static init() {
//         switch (cc.sys.platform) {
//             case cc.sys.WECHAT_GAME: {
//                 this.systemInterface = wx;
//                 break;
//             }
//             case cc.sys.BYTEDANCE_GAME : {
//                 this.systemInterface = TTAPI
//                 this.systemInterface.init()
//                 break;
//             }
//             default: {
//                 this.systemInterface = AppApi;
//                 break;
//             }
//         }
//     }
// }
