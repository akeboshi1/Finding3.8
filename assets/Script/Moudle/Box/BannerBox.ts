import GameLog from "../../Common/manage/GameLogMgr";
import Emit from "../../Common/manage/Emit/Emit";
import WechatApi from "../../Common/manage/API/WechatApi";
import {EventCode} from "../../Common/manage/Emit/EmitData";
import Tools from "../../Common/Tools";
import Global from "../../Common/Global";
import LayerUI from "../../Common/manage/Layer/LayerUI";
import Constant from "../../Common/Constant";

const {ccclass} = cc._decorator;
@ccclass
export default class BannerBox extends LayerUI {
    public banner: cc.Node = null;

    private _nodeGameBoxItem: cc.Node = null;

    private _scrollView: cc.ScrollView = null;

    private _nodeGameBox: cc.Node = null;

    private _gameBox = null;

    onLoad(): void {
        this.banner = this.getNode('banner');
        this._nodeGameBoxItem = this.getNode('banner/gameBox/item');
        this._nodeGameBoxItem.active = false;
        this._nodeGameBox = this.getNode('banner/gameBox');
        this._scrollView = this._nodeGameBox.getComponent(cc.ScrollView);
        //初始化导出
        this._initGameBox()
        this.scheduleOnce(() => {
            Emit.instance().emit(EventCode.BannerBoxInitOver)
            this.node.active = false
        }, 0)
    }

    private _initGameBox() {
        // 进行初始化
        let topNodeList = [];
        if (this._gameBox === null) {
            for (let i = 0; i < Global.exportInfo.length; i++) {
                let node = cc.instantiate(this._nodeGameBoxItem);
                node.active = true;
                topNodeList.push(node);
                this._scrollView.content.addChild(node);
            }
            this._gameBox = new WechatApi.gameBox();
            this._gameBox.init(topNodeList, null, Constant.EXPORT_TYPE.BANNER_BOX, true, this);
            if (this._gameBox !== null) {
                this._gameBox.show();
            }
            this.schedule(this._scrollBox, Global.config.gameBoxMoveInterval);
        }
        this._nodeGameBox.active = topNodeList.length > 0;
    }

    private _scrollBox() {
        try {
            if (this._nodeGameBox.active === false) {
                return;
            }
            Tools.scrollViewOneItem(this._scrollView, 'h');
        } catch (e) {
            GameLog.error('bannerAdvView error', e);
        }
    }

    public page() {
        this.node.children.forEach((node) => {
            node.active = false;
        });
        this.scheduleOnce(() => {
            this.node.children.forEach((node) => {
                node.active = true;
            }, 1);
        })
    }


    onEnable() {
        this._gameBox.show()
    }

    onDisable() {
        this._gameBox.hide()
    }
}