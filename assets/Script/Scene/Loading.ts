import Tools from "../Common/Tools";
import WechatApi from "../Common/manage/API/WechatApi";
import JiuWuSDK from "../SDK/JiuWuSDK";
import GameLogMgr from "../Common/manage/GameLogMgr";
import CacheMgr from "../Common/manage/CacheMgr";
import Global from "../Common/Global";
import TestMgr from "../Common/Test";
import LoadMgr from "../Common/manage/LoadMgr";
import AudioMgr from "../Common/manage/AudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node)
    round: cc.Node = null;

    @property(cc.Node)
    mask: cc.Node = null;

    private tween = null;

    protected onLoad() {
        WechatApi.init();
        this._initSystemEvent();
        this.mask.width = 0
        //假的进度条
        this.tween = cc.tween(this.mask)
            .to(5, {width: 500}, {easing: "quadOut"})
            .start();
        let i = 0;

        cc.director.preloadScene("Game")
        LoadMgr.init_bundleMgr()

        TestMgr.start("加载总时长")
        let num = Tools.model_initModel(() => {
            i++
            if (i === num) {
                TestMgr.end("加载总时长")
                this.tween.stop();
                cc.tween(this.mask)
                    .to(0.2, {width: 500}, {easing: 'quadOut'})
                    .call(() => {
                        cc.director.loadScene('Game');
                    })
                    .start();
            }
        });
    }

    _initSystemEvent() {
        WechatApi.systemInterface_do('setKeepScreenOn', null, null, {
            keepScreenOn: true
        });
        WechatApi.systemInterface_do('getLaunchOptionsSync', (res) => {
            JiuWuSDK.launchData = res;
            JiuWuSDK.joinTime = new Date().getTime();
            GameLogMgr.log('获取小游戏冷启动时参数调用成功:', res);
        }, null);
        WechatApi.systemInterface_do('onHide', null, null, () => {
            GameLogMgr.log('微信 onHide ... ');
            CacheMgr.updateData();
            JiuWuSDK.pushAction(1).then();
            if (JiuWuSDK.systemInfo.platform == "ios"){
                console.log("暂停背景音乐")
                cc.audioEngine.pauseMusic()
            }
        });
        WechatApi.systemInterface_do('onShow', null, null, (res) => {
            JiuWuSDK.launchData = res;
            if (Global.isShowBanner && Global.config.adv_unit_conf.bannerBeClick_Refresh) {
                WechatApi.bottomAdv.bannerIns.activeRefreshBanner()
            }
            GameLogMgr.log('微信 onShow:', res);

            if (JiuWuSDK.systemInfo.platform == "ios"){
                console.log("恢复背景音乐")
                cc.audioEngine.resumeMusic()
            }
        });
        WechatApi.systemInterface_do('showShareMenu', null, null, {
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline'],
            success: () => {
                GameLogMgr.log('显示当前页面的转发按钮成功 ... ');
            }
        });
        WechatApi.systemInterface_do("getSystemInfoSync", (res) => {
            JiuWuSDK.systemInfo = res;
            GameLogMgr.log("获取系统信息成功", res);
        }, null);
    }
}
