// /**
//  * 已经授权情况继续请求接口AIP
//  * 拒绝后下一次登录的错误处理
//  */
// import WechatApi from "../Common/manage/API/WechatApi";
// import Tools from "../Common/Tools";
// import CacheMgr from "../Common/manage/CacheMgr";
// import GameLogMgr from "../Common/manage/GameLogMgr";
// import Global from "../Common/Global";
// import Constant from "../Common/Constant";
//
// /**
//  *  九五互娱 SDK
//  */
// export default class JiuWuSDK {
//
//     public static url = {
//         test: "https://api.jiuwugame.cn",
//         host: "https://api.jiuwugame.cn",
//     }
//
//     public static gameInfo: GameInfo = {
//         gameId: 22,
//         gameVersion: "20210623V1",
//         client: '95e7b3d7beceea9a7b85a3235892e728',
//         token: '$2a$10$gjXXqXHT85QpdRZSsS8QZuu6AnI5hJL/ZzyJ8yzMCit2ii7RhGd.W',
//         code: ''
//     }
//
//     public static launchData: launchData = {
//         scene: '',
//         query: null,
//         shareTicket: '',
//         referrerInfo: {
//             appId: '',
//             extraData: null
//         }
//     }
//
//     public static userInfo: UserInfo = {
//         language: '',
//         nickName: '',
//         avatarUrl: '',
//         gender: 0,
//         country: '',
//         province: '',
//         city: ''
//     };
//
//     public static systemInfo: any = null; // 系统信息
//
//     public static joinTime: number = 0;
//
//     public static initSDK() {
//         return new Promise((resolve) => {
//             // this.login(resolve).then(() => {
//             //     GameLogMgr.log('微信登录成功 ... ');
//             //     return this.register();
//             // }).then(() => {
//             //     GameLogMgr.log('后台登录成功 ... ');
//             //     return this.getConfig();
//             // }).then(() => {
//             //     GameLogMgr.log('获取游戏后台配置成功 ... ');
//             //     WechatApi.systemInterface_do('onShareAppMessage', null, null, () => {
//             //         GameLogMgr.log('用户点击转发按钮 ... ');
//             //         return {
//             //             title: Global.config.share.title,
//             //             imageUrl: Global.config.share.img
//             //         }
//             //     });
//             //     WechatApi.systemInterface_do('onShareTimeline', null, null, () => {
//             //         GameLogMgr.log('用户点击转发到朋友圈 ... ');
//             //         return {
//             //             title: Global.config.share.title,
//             //             imageUrl: Global.config.share.img
//             //         }
//             //     });
//             //     this.getShare().then(() => {
//             //         Tools.subToOpenData({key: 'init', value: ''});
//             //     });
//             //     this.getRanking().then();
//             //     CacheMgr.updateData();
//             //     return this.getGameBox();
//             // }).then(() => {
//             //     resolve(true);
//             //     GameLogMgr.log('获取游戏导出信息成功 ... ');
//             //     Tools.subToOpenData({
//             //         key: 'init',
//             //         value: ''
//             //     });
//             // }).catch((param) => {
//             //     if (param.code === 1) {
//             //         resolve(param);
//             //     } else {
//             //         resolve(false);
//             //         GameLogMgr.error('错误 ... ', Constant.LOGIN_CODE[param.code], param.error);
//             //     }
//             // });
//             this.login(resolve).then(() => {
//                 return this.login_sum()
//             }).then(() => {
//                 WechatApi.systemInterface_do('onShareAppMessage', null, null, () => {
//                     GameLogMgr.log('用户点击转发按钮 ... ');
//                     return {
//                         title: Global.config.share.title,
//                         imageUrl: Global.config.share.img
//                     }
//                 });
//                 WechatApi.systemInterface_do('onShareTimeline', null, null, () => {
//                     GameLogMgr.log('用户点击转发到朋友圈 ... ');
//                     return {
//                         title: Global.config.share.title,
//                         imageUrl: Global.config.share.img
//                     }
//                 });
//                 resolve(true)
//             })
//         });
//     }
//
//     public static headers() {
//         return {
//             'x-client': this.gameInfo.client,
//             'x-token': this.gameInfo.token
//         }
//     }
//
//     /**
//      * 微信登录
//      */
//     public static login(gamePromise) {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("login", null, () => {
//                 gamePromise({code: 1});
//             }, {
//                 success: (res: { code: string }) => {
//                     if (res.code) {
//                         this.gameInfo.code = res.code;
//                         resolve(true);
//                     } else {
//                         GameLogMgr.warn("微信登录失败 : Code 为空", wx);
//                         reject({code: 3});
//                     }
//                 },
//                 fail: (err: Error) => {
//                     reject({code: 2, error: err});
//                 }
//             });
//         });
//     }
//
//     /**
//      * 获取微信用户信息
//      */
//     public static getUserInfo() {
//         return new Promise((resolve) => {
//             WechatApi.systemInterface_do("getUserProfile", null, null, {
//                 desc: '用于排行榜展示用户信息',
//                 lang: 'zh_CN',
//                 success: (data) => {
//                     GameLogMgr.log("获取用户信息成功", data);
//                     this.userInfo = data.userInfo;
//                     CacheMgr.userInfo = this.userInfo;
//                     CacheMgr.newUser = true;
//                     JiuWuSDK.pushUserInfo().then((res) => {
//                         CacheMgr.isAuth = true;
//                         GameLogMgr.log('提交授权用户信息;');
//                     });
//                     resolve(true);
//                 },
//                 fail: (e) => {
//                     GameLogMgr.warn("获取微信用户信息失败", e);
//                     resolve(false);
//                 }
//             });
//         });
//     }
//
//     /**
//      * 发送用户信息
//      */
//     public static pushUserInfo() {
//         return new Promise((resolve) => {
//             let data: any = JiuWuSDK.userInfo;
//             data.userId = CacheMgr.userId;
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.auth,
//                 method: "PUT",
//                 header: this.headers(),
//                 data: data,
//                 success: (data) => {
//                     if (data.data.code != 200) {
//                         resolve(data.data.data);
//                     } else {
//                         resolve(true);
//                     }
//                 },
//                 fail: (e) => {
//                     resolve(true);
//                 },
//             });
//         });
//     }
//
//     /**
//      * 后台 注册或者登录
//      */
//     public static register() {
//         return new Promise((resolve, reject) => {
//             let headers = this.headers();
//             headers['content-type'] = 'application/json';
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.login,
//                 method: 'POST',
//                 header: headers,
//                 data: {
//                     avatarUrl: this.userInfo.avatarUrl,
//                     city: this.userInfo.city,
//                     code: this.gameInfo.code,
//                     country: this.userInfo.country,
//                     gameId: this.gameInfo.gameId,
//                     gender: this.userInfo.gender,
//                     language: 'zh_CN',
//                     loginType: Global.LoginType,
//                     nickName: this.userInfo.nickName,
//                     province: this.userInfo.province,
//                     sceneVal: this.launchData.scene,
//                     exportId: this.launchData.query.exportId,
//                     model: this.systemInfo.model,
//                     platform: this.systemInfo.platform,
//                 },
//                 success: (res) => {
//                     if (res.data.code === 200) {
//                         let data = res.data.data;
//                         let gmsUser = data.gmsUser;
//                         if (gmsUser.setting) {
//                             CacheMgr.setting = JSON.parse(gmsUser.setting);
//                         }
//                         CacheMgr.gold = gmsUser.gold;
//                         CacheMgr.checkpoint = gmsUser.checkpoint;
//                         CacheMgr.diamond = gmsUser.diamond;
//                         // CacheMgr.lastTimeLogin = gmsUser.lastTimeLogin;
//                         CacheMgr.userId = gmsUser.userId;
//                         CacheMgr.openId = gmsUser.openId;
//                         CacheMgr.isAuth = gmsUser.isAuth;
//                         resolve(true);
//                     } else {
//                         reject({code: 4, error: res.data.data});
//                     }
//                 },
//                 fail: (e) => {
//                     reject({code: 5, error: e});
//                 },
//             });
//         });
//     }
//
//     public static login_sum() {
//         return new Promise((resolve, reject) => {
//             let headers = this.headers();
//             headers['content-type'] = 'application/json';
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.loginSum,
//                 method: 'POST',
//                 header: headers,
//                 data: {
//                     code: this.gameInfo.code,
//                     gameId: this.gameInfo.gameId,
//                     loginType: Global.LoginType,
//                     sceneVal: this.launchData.scene,
//                     exportId: this.launchData.query.exportId,
//                     model: this.systemInfo.model,
//                     platform: this.systemInfo.platform,
//                     version: this.gameInfo.gameVersion,
//                 },
//                 success: (res) => {
//                     if (res.data.code === 200) {
//                         let data = res.data.data;
//                         let gmsUser = data.gmsUser;
//                         if (gmsUser) {
//                             GameLogMgr.log("赋值用户信息")
//                             if (gmsUser.setting) {
//                                 CacheMgr.setting = JSON.parse(gmsUser.setting);
//                             }
//                             CacheMgr.gold = gmsUser.gold;
//                             CacheMgr.checkpoint = gmsUser.checkpoint;
//                             CacheMgr.diamond = gmsUser.diamond;
//                             // CacheMgr.lastTimeLogin = gmsUser.lastTimeLogin;
//                             CacheMgr.userId = gmsUser.userId;
//                             CacheMgr.openId = gmsUser.openId;
//                             CacheMgr.isAuth = gmsUser.isAuth;
//                         }
//                         let adImgBox = data.adImgBox
//                         if (adImgBox) {
//                             Global.shareGameBox = adImgBox
//                         }
//                         let iconBox = data.iconBox
//                         if (iconBox) {
//                             Global.exportInfo = iconBox;
//                         }
//
//                         let model = data.versionMode
//                         if (model) {
//                             Global.config = JSON.parse(model);
//                         }
//                         let ranks = data.ranks
//                         if (ranks) {
//                             Global.Ranking = ranks;
//                         }
//                         resolve(true);
//                     } else {
//                         reject({code: 4, error: res.data.data});
//                     }
//                 },
//                 fail: (e) => {
//                     reject({code: 5, error: e});
//                 },
//             });
//         });
//     }
//
//     /**
//      * 更新用户信息
//      */
//     public static userUpdate(data: any) {
//         return new Promise((resolve, reject) => {
//             data.gameId = this.gameInfo.gameId;
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.update_userInfo,
//                 method: "PUT",
//                 header: this.headers(),
//                 data: data,
//                 success: (data) => {
//                     if (data.data.code != 200) {
//                         resolve(true);
//                     } else {
//                         resolve(true);
//                     }
//                 },
//                 fail: (e) => {
//                     resolve(true);
//                 },
//             });
//         });
//     }
//
//     /**
//      * 获取配置
//      */
//     public static getConfig() {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.getConfig,
//                 header: this.headers(),
//                 method: "GET",
//                 data: {
//                     gameId: this.gameInfo.gameId,
//                     version: this.gameInfo.gameVersion,
//                 },
//                 success: (data) => {
//                     if (data.data.code == 200) {
//                         if (data.data.data) {
//                             Global.config = JSON.parse(data.data.data);
//                             resolve(true);
//                         } else {
//                             resolve(true);
//                         }
//                     } else {
//                         reject({code: 8, error: data.data.code});
//                     }
//                 },
//                 fail: (e) => {
//                     reject({code: 9, error: e});
//                 }
//             });
//         });
//     }
//
//     /**
//      * 获取导出数据
//      */
//     public static getGameBox() {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.getExportData + this.gameInfo.gameId,
//                 header: this.headers(),
//                 method: "GET",
//                 success: (data) => {
//                     if (data.data.code == 200) {
//                         Global.exportInfo = data.data.data;
//                         resolve(true);
//                     } else {
//                         reject({code: 10, error: data.data.code});
//                     }
//                 },
//                 fail: (e) => {
//                     reject({code: 11, error: e})
//                 }
//             });
//         });
//     }
//
//     /**
//      * 上报导出信息
//      * @param exportId  导出游戏id
//      */
//     public static exportLog(exportId: number) {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.export_log + "/" + CacheMgr.userId.toString() + "/" + exportId,
//                 header: this.headers(),
//                 method: "POST",
//                 success: (data) => {
//                     if (data.data.code == 200) {
//                         resolve(true);
//                     } else {
//                         reject({code: 12, error: data.data.code});
//                     }
//                 },
//                 fail: (e) => {
//                     reject({code: 13, error: e});
//                 }
//             });
//         });
//     }
//
//     /**
//      * 获取世界排行榜前二十用户信息
//      */
//     public static getRanking() {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.ranking + this.gameInfo.gameId,
//                 header: this.headers(),
//                 method: "GET",
//                 success: (data) => {
//                     if (data.data.code == 200) {
//                         Global.Ranking = data.data.data;
//                         GameLogMgr.log(" 世界前二十 ... ", data);
//                         resolve(true);
//                     } else {
//                         reject(false);
//                     }
//                 },
//                 fail: (e) => {
//                     reject(false);
//                 }
//             });
//         });
//     }
//
//     /**
//      * 获取好友推荐gameBox信息
//      */
//     public static getShare() {
//         return new Promise((resolve, reject) => {
//             WechatApi.systemInterface_do("request", null, null, {
//                 url: Tools.getHost() + this.router.friendShow + this.gameInfo.gameId,
//                 header: this.headers(),
//                 method: "GET",
//                 success: (data) => {
//                     if (data.data.code == 200) {
//                         Global.shareGameBox = data.data.data;
//                         resolve(true);
//                     } else {
//                         reject(false);
//                     }
//                 },
//                 fail: (e) => {
//                     reject(false);
//                 }
//             });
//         });
//     }
//
//     public static pushAction(action: number, adType: number = 1) {
//         return new Promise((resolve) => {
//             if (Global.config.isReportAction) {
//                 let nowTime = new Date().getTime();
//                 let time = (nowTime - JiuWuSDK.joinTime) / 1000;
//                 JiuWuSDK.joinTime = new Date().getTime()
//                 WechatApi.systemInterface_do("request", null, null, {
//                     url: Tools.getHost() + this.router.pushAction,
//                     header: this.headers(),
//                     method: "POST",
//                     data: {
//                         action: action,
//                         adType: adType,
//                         gameId: this.gameInfo.gameId,
//                         onlineTime: time,
//                         userId: CacheMgr.userId
//                     },
//                     success: (data) => {
//                         if (data.data.code == 200) {
//                             GameLogMgr.log(' 上报用户行为成功 ... ');
//                             resolve(true);
//                         }
//                     },
//                     fail: (e) => {
//                         GameLogMgr.error(e);
//                     }
//                 });
//             } else {
//                 resolve(true)
//             }
//         });
//     }
//
//     /**
//      * 路由
//      */
//     public static router = {
//         getExportData: "/api/gmsbox/",  // get export data
//         getConfig: "/api/modeversion",  // get config
//         login: '/api/login',            // get login
//         loginSum: '/api/login/loginsum', //登录汇总
//         update_userInfo: '/api/gmsuser', // updateUserInfo
//         export_log: "/api/exportlog", // 用户导出成功上报路由
//         friendShow: "/api/gmsbox/adimg/",  // 好友推荐游戏盒子
//         ranking: "/api/gmsuser/ranking/", // 获取世界排行榜信息
//         auth: '/api/login/auth',    // 发送用户授权信息
//         pushAction: '/api/gmsuser/action', // 玩家行为记录
//     }
// }
//
// interface GameInfo {
//     gameId: number,
//     gameVersion: string,
//     client: string,
//     token: string,
//     code: string, // 微信登录返回的code
// }
//
// interface UserInfo {
//     language: string;
//     nickName: string;
//     avatarUrl: string;
//     /**
//      * 0：未知、1：男、2：女
//      */
//     gender: 0 | 1 | 2;
//     country: string;
//     province: string;
//     city: string;
// }
//
// interface launchData {
//     scene: string,
//     query: any,
//     shareTicket: string,
//     referrerInfo: referrerInfo
// }
//
// export interface referrerInfo {
//     appId: string,
//     extraData: any
// }
