import AudioMgr from "../AudioMgr";
import GameLog from "../GameLogMgr";

/**
 * 这个是 封装了一些方法  ，例如 注册点击事件 销毁事件 等等
 */
const {ccclass} = cc._decorator;

@ccclass
export default class LayerUI extends cc.Component {

    private _touchList: { [key: string]: { target, handler, callObj } } = {};
    private _touchEndList: { [key: string]: { target, handler, callObj } } = {}

    private _enableList: { [key: string]: { enabled: boolean, isGray: boolean } } = {};


    /**
     * 是否交互 需在target注册onTouch之后
     * @param target
     * @param v
     * @param isGray
     */
    protected setInteractable(target: cc.Node, v: boolean, isGray: boolean = true) {
        if (!target)
            return;
        let button: cc.Button = target.getComponent(cc.Button);
        if (button) {
            button.enableAutoGrayEffect = isGray;
            button.interactable = v;
        }
        this._enableList[target.name] = {enabled: v, isGray};
    }

    /**
     *  注册点击事件
     * @param target    点击对象
     * @param handler   触发事件
     * @param sound     播放声音名称
     * @param scale     缩放值
     * @param stopEvent
     */
    protected onTouch(target: cc.Node, handler: Function, sound: string = "click", scale = 0.9, stopEvent = true) {
        if (!target || !handler) {
            GameLog.error("target || handler为空-->", target, handler);
            return;
        }

        let targetName: string = target.name;
        if (this._touchList[targetName] && this._touchList[targetName].target == target) {
            GameLog.warn("重复设置-->", targetName);
            return;
        }

        //添加一个button 动画
        let button = target.getComponent(cc.Button);
        if (scale != 1) {
            if (!button) {
                button = target.addComponent(cc.Button);
                button.transition = cc.Button.Transition.SCALE;
                button.zoomScale = scale;
            }
        }


        let enabled = true;
        let isGray = true;
        if (this._enableList[target.name]) {
            enabled = this._enableList[target.name].enabled;
            isGray = this._enableList[target.name].isGray;
        }

        this.setInteractable(target, enabled, isGray);

        let callObj = this;
        let touchHandler = (event) => {
            let {enabled = true} = this._enableList[target.name] || {};
            if (!enabled) {
                return;
            }
            if (stopEvent) {
                event.stopPropagation();
            }
            if (sound && sound != "") {
                // if (sound === "check") {
                // sound = "piano/a" + Math.floor(Math.random() * (5 - 1) + 1);
                // }
                AudioMgr.play(sound).then();
            }
            handler.call(callObj, event);
        };
        target.on(cc.Node.EventType.TOUCH_START, touchHandler);
        this._touchList[targetName] = {target: target, handler: touchHandler, callObj: callObj};
    }

    protected onTouchEnd(target: cc.Node, handler: Function) {
        if (!target || !handler) {
            GameLog.error("target || handle为空 ondTouchEnd -->", target, handler)
            return
        }
        let targetName: string = target.name
        if (this._touchEndList[targetName] && this._touchEndList[targetName].target == target) {
            GameLog.warn("重复设置 --> onTouchEnd ", targetName)
        }

        let callObj = this;
        let touchHandler = (event) => {
            handler.call(callObj, event);
        };
        target.on(cc.Node.EventType.TOUCH_END, touchHandler);
        target.on(cc.Node.EventType.TOUCH_CANCEL, touchHandler);

        this._touchEndList[targetName] = {target: target, handler: touchHandler, callObj: callObj};
    }

    protected offTouchEnd(target: cc.Node) {
        if (!target) {
            GameLog.error("target 为空 ")
            return
        }
        let targetName: string = target.name
        if (this._touchEndList[targetName]) {
            let handler = this._touchEndList[targetName].handler
            target.off(cc.Node.EventType.TOUCH_END, handler)
            target.off(cc.Node.EventType.TOUCH_CANCEL, handler)
            delete this._touchEndList[targetName]
        }
    }

    /**
     * 移除对象点击事件
     * @param target
     */
    protected offTouch(target: cc.Node) {
        if (!target) {
            GameLog.error("target 为空");
            return
        }
        let targetName: string = target.name;
        if (this._touchList[targetName]) {
            let touchHandler = this._touchList[targetName].handler;
            target.off(cc.Node.EventType.TOUCH_START, touchHandler);
            delete this._touchList[targetName]
        }
        delete this._enableList[targetName]
    }


    protected clear() {
        for (let key in this._touchList) {
            this.offTouch(this._touchList[key].target)
        }
    }

    onDestroy() {
        this.clear()
    }

    /**
     *
     * @param path 路径或者名字
     */
    protected getNode(path: string): cc.Node {
        let node: cc.Node = null;
        if (path == "" || !path)
            return null;
        if (path.indexOf("/") != -1) {
            node = cc.find(path, this.node);
        } else {
            node = this.node.getChildByName(path);
        }

        if (!node) {
            GameLog.warn("未找到该节点  path=", path);
        }
        return node;
    }

}
