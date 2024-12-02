import GameLogMgr from "./GameLogMgr";
import Emit from "./Emit/Emit";
import {EventCode} from "./Emit/EmitData";
import TestMgr from "../Test";
import LayerPanel, {UrlInfo} from "./Layer/LayerPanel";
import LoadMgr from "./LoadMgr";
import url = cc.url;
import Global from "../Global";
import Tools from "../Tools";
import SliderBox from "../../Moudle/Box/SliderBox";
import LayerMgr from "./Layer/LayerMgr";
import WechatApi from "./API/WechatApi";
import WechatGameBox from "./ADV/Wechat/WechatGameBox";
import show = cc.show;
import WechatBanner from "./ADV/Wechat/WechatBanner";
import WechatBottomAd from "./ADV/Wechat/WechatBottomAd";
import CacheMgr from "./CacheMgr";
import Constant from "../Constant";

const {ccclass, property} = cc._decorator;
@ccclass
export default class PanelMgr extends cc.Component {
    public static INS: PanelMgr
    @property(
        {
            type: [cc.Node],
            tooltip: "只要将Game中的场景layer按照顺序赋值即可， 如果存在修改，需要到PannerMgr.ts中修改枚举变量 Layer,也是需要按照绑定顺序"
        }
    )
    public layers: cc.Node[] = []

    //当前正在Loading 的面板
    private LoadingList: Map<string, number> = new Map<string, number>()
    //当前打开的面板数组
    private openList: Map<string, cc.Node> = new Map<string, cc.Node>()
    //当前关闭但是未摧毁的面板，存储在这里，下次打开该面板的时候，就会使用这里的面板
    private hideList: Map<string, cc.Node> = new Map<string, cc.Node>()

    onLoad() {
        PanelMgr.INS = this
        Emit.instance().emit(EventCode.PanelMgrInitOK)
    }

    /**
     * @param param{
     *     layer : 在哪一个容器打开页面
     *     panel: 打开面板
     *     call : 打开成功回调 可选
     *     param: 传递给下一个面板的参数
     * }
     */
    openPanel(param: openParam) {
        let layer = this.layers[param.layer]

        if (!layer) {
            GameLogMgr.error("openPanel layer 为空 ,打开失败. ", layer)
            return
        }

        //加载分包
        let urlInfo = param.panel.getUrl()
        let config = Global.config.panel_config[urlInfo.name]

        if (urlInfo.name == "homeView" && Global.LoginFlag) {
            Global.LoginFlag = false
            config = Global.config.panel_config["loginView"]
        }
        //检测是否已经再加载了
        if (this.LoadingList.has(urlInfo.name)) {
            GameLogMgr.warn("面板", urlInfo.name, "已经在加载中，重复加载失败")
            return;
        }

        if (this.openList.has(param.panel.getUrl().name)) {
            GameLogMgr.warn("不允许重复打开", param.panel)
            return;
        }
        this.LoadingList.set(urlInfo.name, 1) //添加一个加载标识， 防止重复添加
        //todo  mask
        let openPanelWay = () => {
            let way = () => {
                let panel: cc.Node = null
                //判断有没有旧的panel可用，有的话就不重新实例化了
                if (this.hideList.has(urlInfo.name)) {
                    panel = this.hideList.get(urlInfo.name)
                    panel.parent = layer
                    panel.active = false
                    // this.scheduleOnce(() => {
                    this.openList.set(urlInfo.name, panel)
                    this.showPanel(panel, param.param, config)
                    this.LoadingList.delete(urlInfo.name)
                    if (this.LoadingList.size == 0) {
                        //todo mask
                    }
                    if (param.call) {
                        param.call()
                    }
                    // }, 0)
                } else {
                    LoadMgr.loadPrefab(urlInfo.name, LoadMgr.getBundle(urlInfo.bundle)).then((prefab: cc.Prefab) => {
                        panel = cc.instantiate(prefab)
                        panel.parent = layer
                        panel.active = false
                        // this.scheduleOnce(() => {
                        this.openList.set(urlInfo.name, panel)
                        panel.getComponent(LayerPanel).initUI()
                        this.showPanel(panel, param.param, config)
                        this.LoadingList.delete(urlInfo.name)
                        if (this.LoadingList.size == 0) {
                            //todo mask
                        }
                        if (param.call) {
                            param.call()
                        }
                        // }, 0)
                    })
                }
            }

            if (LoadMgr.judgeBundleLoad(urlInfo.name)) {
                GameLogMgr.log("bundle已经加载好了:", urlInfo.name)
                way()
            } else {
                GameLogMgr.log("bundle还没加载好,需要加载一下")
                LoadMgr.loadBundle_Single(urlInfo.bundle).then(() => {
                    way()
                })
            }
        }
        //获取配置信息
        if (config) {
            this.handlePanelConfig(config).then(
                () => {
                    //存在配置 ，需要先打开配置
                    openPanelWay()
                }
            )
        } else {
            //没有配置立即准备打开目标panel
            openPanelWay()
        }
    }

    private showPanel(panel: cc.Node, param: any, config: any) {
        let script = panel.getComponent(LayerPanel)
        if (config) {
            if (Tools.checkPer(config.gameBox_probability)) {
                script.initGameBox()
            } else {
                script.noInitGameBox()
            }


            if (config.more_game && config.more_game.length > 0) {
                script.initMoreGame(() => {
                    this.handlePanelMorePlay(config.more_game)
                })
            } else {

            }
        }
        script.show(param)
        panel.active = true
    }

    /**
     *
     * @param panel 需要关闭的面板
     * @param destroy 是否需要彻底销毁这个面板
     */
    closePanel(panel: typeof LayerPanel, destroy = true) {
        let node = this.openList.get(panel.getUrl().name)
        if (!node) {
            GameLogMgr.warn("close Panel ", panel.getUrl(), " error  : 该面板尚未打开!")
            return
        }

        node.getComponent(LayerPanel).hideGameBox()

        node.getComponent(LayerPanel).hide() //这里可以做清除代码

        node.getComponent(LayerPanel).unscheduleAllCallbacks() //取消所有定时器
        if (panel.getUrl().name == "endView") { //如果是endView的化 ，需要同步数据
            CacheMgr.updateData();
        }

        node.parent = null
        this.openList.delete(panel.getUrl().name)
        if (destroy) {
            node.getComponent(LayerPanel).onDestroyDo() //这里可以做清除代码
            node.destroy()
        } else {
            this.hideList.set(panel.getUrl().name, node)
        }
    }

    getPanel(panel: typeof LayerPanel): cc.Node {
        return this.openList.get(panel.getUrl().name)
    }

    //处理Panel配置
    handlePanelConfig(config) {
        PanelMgr.INS.closePanel(SliderBox)
        return new Promise((resolve, reject) => {
            Tools.openBox(config.export_show[0]).then(() => {
                return Tools.openBox(config.export_show[1]);
            }).then(() => {
                return Tools.openBox(config.export_show[2]);
            }).then(() => {
                return Tools.openBox(config.export_show[3]);
            }).then(() => {
                //判断宝箱
                return Tools.openTrea(config.chest_probability);
            }).then(() => {
                //判断强拉视频
                return new Promise((resolve, reject) => {
                    if (Tools.checkPer(config.video_probability) && !Global.config.adv_unit_conf.video_auto_play) {
                        Tools.handleVideo(Constant.VIDEO_TYPE.ENFORCE).then(() => {
                            resolve(true)
                        })
                    } else {
                        resolve(true)
                    }
                })
            }).then(() => {
                if (Tools.checkPer(config.banner_probability)) {
                    WechatApi.bottomAdv.show()
                } else {
                    WechatApi.bottomAdv.hide()
                }
                if (config.slider > 0) {
                    PanelMgr.INS.openPanel({
                        layer: Layer.sliderLayer,
                        panel: SliderBox,
                        param: {
                            code: config.slider
                        }
                    })
                }
                return resolve(true)
            });
        })
    }

    handlePanelMorePlay(config) {
        Tools.openBox(config[0]).then(() => {
            return Tools.openBox(config[1]);
        }).then(() => {
            return Tools.openBox(config[2]);
        }).then(() => {
            return Tools.openBox(config[3]);
        })
    }

}

export enum Layer {
    gameLayer,
    gameInfoLayer,
    sliderLayer,
    chestLayer,
    gameBoxLayer,
    bannerLayer,
}

export enum View {
    endView,
    gameView,
    homeView,
}

export enum Box {
    fourBox = 10,
    oneBox,
}

export interface openParam {
    layer: Layer,
    panel: typeof LayerPanel,
    call?: Function,
    param?: any
}
