// //抖音sdk
// import Scene = cc.Scene;
//
// export default class TTAPI {
//
//     public static init() {
//         this.getSetting()
//     }
//
//     private static _setting: any = null
//
//     //获取用户授权设置
//     private static getSetting() {
//         // @ts-ignore
//         tt.getSetting({
//             success: (res) => {
//                 this._setting = res.authSetting
//             },
//             fail: (res) => {
//             },
//         });
//     }
//
//     /**
//      * @param object
//      * success : function
//      * fail : function
//      * complete: function
//      */
//     public static login(object: any) {
//         // @ts-ignore
//         tt.login({
//             force: true, //未登录时，是否强制调起登录框
//             success: object.success,
//             fail: object.fail,
//             complete: object.complete,
//         })
//     }
//
//     //获取系统信息
//     public static getSystemInfoSync(): any {
//         // @ts-ignore
//         return tt.getSystemInfoSync();
//     }
//
//     //请求
//     /**
//      * @param param
//      *
//      属性名    类型    默认值    必填    说明    最低支持版本
//      url    string    --    是    请求地址    1.0.0
//      header    object    {"content-type": "application/json"}    否    请求 Header    1.0.0
//      method    string    GET    否    网络请求方法，支持 GET/POST/OPTIONS/PUT/HEAD/DELETE    1.0.0
//      data    object/array/arraybuffer    --    否    请求的参数    1.0.0
//      dataType    string    json    否    期望返回的数据类型，支持 json、string    1.0.0
//      responseType    string    text    否    期望响应的数据类型，支持 text 或 arraybuffer    1.0.0
//      success    function    --    否    接口调用成功后的回调函数    1.0.0
//      fail    function    --    否    接口调用失败后的回调函数    1.0.0
//      complete    function    --    否    接口调用结束后的回调函数（调用成功、失败都会执行）    1.0.0
//      */
//     public static request(param: any) {
//         // @ts-ignore
//         tt.request(param)
//     }
//
//     /**
//      * 跳转
//      * @param param
//      属性名    类型    默认值    必填    说明    最低支持版本
//      appId    string        是    要跳转的小程序 id    1.15.0
//      path    string        否    要跳转的小程序页面路径（不传则默认打开首页），允许携带 query 参数，格式详见示例    1.15.0
//      extraData    object        否    需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow，tt.getLaunchOptionsSync 中获取到这份数据。如果跳转的是小游戏，可以在 tt.onShow，tt.getLaunchOptionsSync 中可以获取到这份数据数据    1.15.0
//      envVersion    string    current    否    要打开的小程序版本。合法的值有 current--线上版；latest--测试版。仅在当前小程序为开发版或测试版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版    1.15.0
//      success    Function        否    接口调用成功的回调函数    1.15.0
//      complete    Function        否    接口调用结束的回调函数（调用成功、失败都会执行）    1.15.0
//      fail    Function        否    接口调用失败的回调函数    1.15.0
//      *
//      */
//     public static navigateToMiniProgram(param: any) {
//         // @ts-ignore
//         tt.navigateToMiniProgram(param)
//     }
//
//     /**
//      * 激励视频
//      * @param param
//      属性名    类型    默认值    必填    说明
//      adUnitId    string        是    广告位 id
//      multiton    boolean        否    是否启用多例模式，默认为 false,多例模式下观看广告次数通过 onClose 中的 count 返回。
//      multitonRewardedMsg    string        否    更多奖励提醒信息，多例模式下必传。
//      */
//     public static createRewardedVideoAd(param: any) {
//         param.multiton = false
//         // @ts-ignore
//         tt.createRewardedVideoAd(param)
//     }
//
//     /**
//      * 创建插屏广告
//      * @param param
//      属性名    类型    默认值    必填    说明
//      adUnitId    string        是    广告单元 id
//      */
//     public static createInterstitialAd(param: any) {
//         // @ts-ignore
//         tt.createInterstitialAd(param)
//     }
//
//     /**
//      *
//      * 获取用户信息
//      * @param param
//      属性名    类型    默认值    必填    说明    最低支持版本
//      success    Function        否    接口调用成功的回调函数    1.0.0
//      complete    Function        否    接口调用结束的回调函数（调用成功、失败都会执行）    1.0.0
//      fail    Function        否    接口调用失败的回调函数    1.0.0
//      withCredentials    boolean    false    否    是否需要返回敏感数据    1.0.0
//      withRealNameAuthenticationInfo    boolean    false    否    是否需要返回用户实名认证状态    1.80.0
//      */
//     public static getUserProfile(param: any) {
//         // @ts-ignore
//         tt.getUserInfo({
//             success: (data) => {
//                 param.success(data)
//             },
//             fail: (e) => {
//                 param.fail(e.errMsg)
//             }
//         })
//     }
//
//     /**
//      *  返回小游戏启动参数
//      */
//     public static getLaunchOptionsSync(): any {
//         // @ts-ignore
//         let res = tt.getLaunchOptionsSync()
//         return res
//     }
// }
