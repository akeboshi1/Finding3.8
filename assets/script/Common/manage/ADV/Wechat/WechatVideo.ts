// import AdvBase from "../AdvBase";
// import WechatApi from "../../API/WechatApi";
// import Tools from "../../../Tools";
// import Global from "../../../Global";
// import Constant from "../../../Constant";
// import GameLogMgr from "../../GameLogMgr";
// import TypeScript = cc.TypeScript;
// import JiuWuSDK from "../../../../SDK/JiuWuSDK";
//
// export default class WechatVideo extends AdvBase {
//     private isLoadOK: boolean = false    //视频是否拉取成功
//     private isStrong_play: boolean = false //是否已经开启强拉视频倒计时
//
//     public static instance(): AdvBase {
//         if (this._instance === null) {
//             new this();
//             this._instance = new WechatVideo();
//         }
//         return this._instance;
//     }
//
//     public getNode() {
//         return null;
//     }
//
//     public strong_play() {
//         if (!Global.config.adv_unit_conf.video_auto_play) {
//             return
//         }
//         //判断是否一进入游戏就进行强拉视频
//         if (Global.config.adv_unit_conf.video_play_on_login) {
//             Tools.handleVideo(Constant.VIDEO_TYPE.ENFORCE).then()
//         }
//
//         if (Global.config.adv_unit_conf.video_play_interval > 0) {
//             window.setInterval(() => {
//                 Tools.handleVideo(Constant.VIDEO_TYPE.ENFORCE).then()
//             }, 1000 * Global.config.adv_unit_conf.video_play_interval)
//         }
//     }
//
//     public init() {
//         if (!this.isWechat()) {
//             return;
//         }
//         if (this._isInit || Global.config.adv_unit_conf.rewarded_video.length == 0) {   //如果已经初始化 ， 就不初始化了
//             return;
//         }
//         let currentVideoAdvId = Tools.getRandomByArray(Global.config.adv_unit_conf.rewarded_video);
//         WechatApi.systemInterface_do("createRewardedVideoAd", (res) => {
//             this._rewardedVideoAd = res
//         }, null, {adUnitId: currentVideoAdvId})
//
//         this.loadVideo()
//
//         //用户点击【关闭广告】的按钮
//         this._rewardedVideoAd.onClose((res) => {
//             cc.audioEngine.resumeMusic()
//             this._isShow = false;
//             this.isLoadOK = false
//             if (res.isEnded) {
//                 this._callSuccess(Constant.REWARDED_VIDEO_END_TYPE.END);
//             } else {
//                 this._callSuccess(Constant.REWARDED_VIDEO_END_TYPE.NOT_END);
//             }
//             //重新加载
//             this.loadVideo()
//         });
//
//         this._rewardedVideoAd.onError((err) => {
//             this._rewardedVideoAd.offError()
//         });
//
//         if (this._rewardedVideoAd) {
//             this._isInit = true;
//         }
//
//     }
//
//     public show(param) {
//         this._successCallback = param.success;
//         this._callObj = param.callObj;
//         if (!this.isWechat()) {
//             GameLogMgr.warn("视频观看不是微信环境.... 默认成功")
//             this._callSuccess(Constant.REWARDED_VIDEO_END_TYPE.END);
//             return;
//         }
//
//         if (!this._isInit) {
//             GameLogMgr.warn("视频尚未初始化.... 播放失败")
//             this.init();
//             return;
//         }
//
//         if (!this.isLoadOK) {
//             GameLogMgr.warn("视频尚未加载成功, 硬拉插屏代替.")
//             WechatApi.screenAdv.show().then(() => {
//                 GameLogMgr.log("播放插屏成功")
//                 this._callSuccess(Constant.REWARDED_VIDEO_END_TYPE.INSERT_SCREEN);
//             }, () => {
//                 GameLogMgr.log("播放插屏失败，调用分享")
//                 Tools.activeShare()
//                 this._callSuccess(Constant.REWARDED_VIDEO_END_TYPE.SHARE);
//             })
//             return;
//         }
//
//
//         cc.audioEngine.pauseMusic()
//         this._rewardedVideoAd.show().then()
//     }
//
//     public hide() {
//
//     }
//
//     public loadVideo() {
//         this._rewardedVideoAd.load().then((res) => {
//             GameLogMgr.warn("视频加载完成", cc.director.getScene().name)
//             this.isLoadOK = true
//             if (!this.isStrong_play) {
//                 this.isStrong_play = true
//                 this.strong_play() //执行强拉视频计时器
//             }
//         }, () => {
//             GameLogMgr.warn("视频加载失败, 准备重新拉去.......")
//             window.setTimeout(() => {
//                 this.loadVideo()
//             }, 1000 * Global.config.adv_unit_conf.video_reconnect_interval)
//         });
//     }
//
//     private _rewardedVideoAd: any = null;
//
//     private _successCallback = null;
//
//     private _callObj = null;
//
//     private _callSuccess(endType) {
//         if (endType == Constant.REWARDED_VIDEO_END_TYPE.END) {
//             JiuWuSDK.pushAction(2, Constant.VIDEO_TYPE.PLAY_END).then()
//         } else if (endType == Constant.REWARDED_VIDEO_END_TYPE.NOT_END) {
//             JiuWuSDK.pushAction(2, Constant.VIDEO_TYPE.PLAY_CLOSE).then()
//         }
//         typeof this._successCallback === 'function' && this._successCallback.call(this._callObj, endType);
//     }
//
//
// }
