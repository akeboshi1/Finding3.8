// const {ccclass} = cc._decorator;
//
// @ccclass
// export default abstract class AdvBase {
//     protected static _instance = null;
//
//     protected _isInit = false;
//
//     protected _isShow = false;
//
//     protected _isError = false;
//
//     public update() {
//         return;
//     }
//
//     public isError() {
//         return this._isError;
//     }
//
//     //判断当前是不是微信
//     protected isWechat() {
//         return cc.sys.platform == cc.sys.WECHAT_GAME
//     }
//
//     public abstract getNode();
//
//     public isShow() {
//         return this._isShow;
//     }
//
//     public isInit() {
//         return this._isInit;
//     }
//
//     public abstract init(param ?: any);
//
//     public abstract show(param ?: any);
//
//     public abstract hide();
//
// }