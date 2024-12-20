// /**
//  * ios 和Android的interface
//  */
// import {sys} from "cc";
// import StorageMgr from "../StorageMgr";
// import GameLogMgr from "../GameLogMgr";
// import PanelMgr, {Layer} from "../PanelMgr";
// import ToastTips from "../Tips/ToastTips";
//
// export default class AppApi {
//     private static _hasInitAdSdk = false;
//
//     public static isInitAdSdk() {
//         return this._hasInitAdSdk;
//     }
//
//     public static showModal(param) {
//     }
//
//     public static showToast(param) {
//         PanelMgr.INS.closePanel(ToastTips, false)
//         PanelMgr.INS.openPanel({
//             layer: Layer.bannerLayer,
//             panel: ToastTips,
//             param: param
//         })
//     }
//
//     public static getStorageSync(key) {
//         return StorageMgr.read(key);
//     }
//
//     public static setStorage(param) {
//         return StorageMgr.save(param.key, param.data);
//     }
//
//     public static setStorageSync(key, data) {
//         return StorageMgr.save(key, data);
//     }
//
//     public static removeStorageSync(key) {
//         StorageMgr.rm(key);
//     }
//
//     /**
//      *
//      * @param options
//      * {
//      *     url ： string    //  请求路径
//      *     timeout : number //  超时时间
//      *     data : any       //  数据
//      *     fail : function //  失败回调
//      *     success: function  //成功回调
//      *     method : string    //请求方式
//      *     header : Object     //请求头
//      * }
//      */
//     public static request(options: any) {
//         if (!options.hasOwnProperty("url")) {
//             GameLogMgr.warn("request param  url is  null")
//             return
//         }
//         let url = options.url
//         let data: any = null
//         let param: any = {}
//         if (!options.hasOwnProperty("method")) {
//             param.method = "GET"
//         } else {
//             param.method = options.method
//         }
//
//         if (options.hasOwnProperty("data")) {
//             data = options.data
//         }
//
//         if (options.hasOwnProperty("timeOut")) {
//             param.timeout = options.timeout
//         }
//
//         if (options.hasOwnProperty("header")) {
//             param.hearders = options.header
//         }
//         param.pareseJson = true
//         // fly.request(url, data, param).then(data => {
//         //     if (options.hasOwnProperty("success")) {
//         //         options.success(data)
//         //     }
//         // }).catch(e => {
//         //     if (options.hasOwnProperty("fail")) {
//         //         options.fail(data)
//         //     }
//         // })
//     }
//
//     public static test(a: number): number {
//         return a * 2
//     }
//
//     public static getSystemInfoSync(): { version: string, benchmarkLevel: number } {
//         return {
//             benchmarkLevel: 10,
//             version: sys.osVersion
//         };
//     }
// }
//
