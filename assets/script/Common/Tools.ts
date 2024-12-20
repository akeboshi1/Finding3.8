import Global, {ExportData} from "./Global";
import Constant from "./Constant";
import LoadMgr from "./manage/LoadMgr";
import CacheMgr from "./manage/CacheMgr";
import TwoBox from "../Moudle/Box/TwoBox";
import OneBox from "../Moudle/Box/OneBox";
import ThreeBox from "../Moudle/Box/ThreeBox";
import TreaView from "../Moudle/View/TreaView";
import GameLogMgr from "./manage/GameLogMgr";
import Game from "../Scene/Game";
import TestMgr from "./Test";
import PanelMgr, {Layer} from "./manage/PanelMgr";
import ShortageView from "../Moudle/View/ShortageView";
import {js,ScrollView,Layout,v2,tween,view,screen,UITransform,Node,Vec3,Vec2,math} from "cc";
import isNumber = js.isNumber;

export default class Tools {

    public static subStr(str, n) {
        let r = /[^\x00-\xff]/g;
        if (str.replace(r, "mm").length <= n) {
            return str;
        }
        let m = Math.floor(n / 2);
        for (let i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
                return str.substr(0, i) + "...";
            }
        }
        return str;
    }

    /**
     * 短震动
     * light  轻震动
     * medium 中震动
     * heavy  重震动
     */
    public static vibrateShort(t: string = "light") {
        try {
            if (CacheMgr.setting.setting.vibrate !== 1) {
                GameLogMgr.warn('当前 震动关闭。');
                return;
            }

            // if (WechatApi.systemInterface.vibrateShort) {
            //     WechatApi.systemInterface.vibrateShort({
            //         type: t,
            //     });
            // } else {
            //     GameLogMgr.warn('短震动 api 无法使用。');
            // }

        } catch (e) {
            GameLogMgr.error(e);
        }
    }

    /**
     * 长震动
     */
    public static vibrateLong() {
        try {
            if (CacheMgr.setting.setting.vibrate !== 1) {
                GameLogMgr.warn('当前 震动关闭。');
                return;
            }
            // if (WechatApi.systemInterface.vibrateLong) {
            //     WechatApi.systemInterface.vibrateLong();
            // } else {
            //     GameLogMgr.warn('长震动 api 无法使用。');
            // }

        } catch (e) {
            GameLogMgr.error(e);
        }
    }

    /**
     * 对象深拷贝
     * @param obj
     */
    public static deepClone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            return obj;
        }
    }


    public static openBox(box) {
        return new Promise((resolve) => {
            if (box === null || box === undefined || box === 0) {
                resolve(true);
            } else {
                // UIMgr.openUI(this.getBox(box), lay, {boxPromise: resolve});
                PanelMgr.INS.openPanel({
                    panel: this.getBox(box),
                    layer: Layer.gameBoxLayer,
                    param: {boxPromise: resolve},
                })
            }
        });
    }

    public static openTrea(pre) {
        return new Promise((resolve) => {
            if (Tools.checkPer(pre)) {
                PanelMgr.INS.openPanel({
                    panel: TreaView,
                    layer: Layer.chestLayer,
                    param: {promise: resolve},
                })
            } else {
                resolve(true);
            }
        });
    }

    /**
     * 根据配置获取 box
     */
    public static getBox(index: number) {
        let box;
        switch (index) {
            case 1 :
                box = OneBox;
                break;
            case 2 :
                box = TwoBox;
                break;
            case 3 :
                box = ThreeBox;
                break;
        }
        return box;
    }

    /**
     * 获取整数随机值
     * @param maxValue
     * @return [0, max)
     */
    public static getRandomMax(maxValue: number) {
        return Math.floor(Math.random() * maxValue)
    }

    /**
     * 获取数组随机值
     * @param array
     */
    public static getRandomByArray(array: any) {
        try {
            return array[this.getRandomMax(array.length)];
        } catch (e) {
            GameLogMgr.error('获取数组随机值异常', e);
        }
        return {};
    }

    /**
     * 获取整数随机值
     * @param minValue
     * @param maxValue
     * @return [min, max)
     */
    public static getRandom(minValue: number, maxValue: number): number {
        return Math.floor(Math.random() * (maxValue - minValue) + minValue);
    }

    /**
     * 获取随机值
     * @param minValue
     * @param maxValue
     * @return (min, max]
     */
    public static getRealRandom(minValue: number, maxValue: number): number {
        return Math.random() * (maxValue - minValue) + minValue;
    }


    public static sort(arr: any[], begin: number = 0, end: number = arr.length): Array<number> {
        if (end <= begin)
            return arr;
        let i = begin;
        let j = end;
        let key = arr[begin].sort;
        while (true) {
            while (true) {
                if (i == j) break;
                if (arr[j].sort < key) {
                    let temp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = temp;
                    break;
                }
                j--;
            }
            while (true) {
                if (i == j) break;
                if (arr[i].sort > key) {
                    let temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    break;
                }
                i++;
            }
            if (i == j)
                break;
        }
        if (end - j > 1) {
            arr = Tools.sort(arr, j + 1, end);
        }
        if (i - begin > 1) {
            arr = Tools.sort(arr, begin, i);
        }
        return arr;
    }

    /**
     * 快速排序导出信息:
     * @param arr 需要进行快速排序的数组
     * @returns {*[]|*}
     */
    public static quickExportSort(arr: ExportData[]) {
        if (arr.length < 2) return arr;
        // 随机选择0～arr.length之间选一个基准值
        const pivot = Math.floor(Math.random() * arr.length)
        // 声明两个数组，分别用于存放比基准值小的数据和比基准值大的数据
        let minArr = [];
        let maxArr = [];
        // 根据基准值填充数组
        for (let i = 0; i < arr.length; i++) {
            // 大于基准值就放maxArr里
            if (arr[i].sort >= arr[pivot].sort && i !== pivot) {
                maxArr.push(arr[i]);
            }
            // 小于基准值就放minArr里
            if (arr[i].sort < arr[pivot].sort && i !== pivot) {
                minArr.push(arr[i])
            }
        }
        // 分别对基准值划分出来的数组递归调用快速排序，然后合并数组
        return [...Tools.quickExportSort(minArr), arr[pivot], ...Tools.quickExportSort(maxArr)];
    }

    public static getGameBox(): ExportData[] {
        let gameBox = Tools.deepClone(Global.exportInfo);
        // 打乱 gameBox 顺序
        gameBox = Tools.quickExportSort(gameBox);
        let resultGameBox = [];
        for (let i = 0; i < gameBox.length; i++) {
            let item = gameBox[i];
            resultGameBox.push(item);
        }
        return resultGameBox;
    }

    /**
     * 跳转到小程序
     * @param gameBox
     * @param name
     * @param resolve
     */
    public static navigateTo(gameBox: ExportData, name, resolve ?: any) {
        // try {
        //     if (!gameBox) {
        //         GameLogMgr.error('跳转移除', gameBox);
        //     }
        //     WechatApi.systemInterface_do("navigateToMiniProgram", null, () => {
        //             if (resolve) {
        //                 resolve(true)
        //             }
        //         },
        //         {
        //             appId: gameBox.appId,
        //             path: gameBox.exportSrc,
        //             extraData: {
        //                 exportId: gameBox.id
        //             },
        //             envVersion: "develop",
        //             success: (res) => {
        //                 GameLogMgr.log("进入导出成功！", res);
        //                 JiuWuSDK.exportLog(gameBox.id).then();
        //                 JiuWuSDK.pushAction(5, name).then()
        //                 if (resolve) {
        //                     resolve(true)
        //                 }
        //             },
        //             fail: (res) => {
        //                 GameLogMgr.error("进入导出失败", res, gameBox, name);
        //                 resolve(true)
        //             }
        //         },
        //     )
        // } catch (e) {
        //     GameLogMgr.error('进入导出移除', gameBox, name);
        // }
    }

    /**
     * 关闭 开放数据域
     */
    public static closeOpenData() {
        Tools.subToOpenData({key: "close", value: ''});
    }


    private static _scrollViewData = {};

    public static scrollViewOneItem(scrollView: ScrollView, direction = 'v') {
        // 判断 scrollView 是否在滚动
        if (scrollView.isScrolling() || scrollView.isAutoScrolling()) {
            return;
        }
        if (scrollView.content.children.length <= 0) {
            return;
        }

        let uuid = scrollView.uuid;
        let count = scrollView.content.children.length;

        let scrollViewMax = 0;
        let pageSize = 0;
        let itemSize = 0;
        let layout = scrollView.content.getComponent(Layout);
        if (!layout) {
            return;
        }
        let lineSize = 1;
        let childNode =  scrollView.content.children[0];
        let childTransform = childNode.getComponent(UITransform);
        if(!childTransform) {
            childTransform = childNode.addComponent(UITransform);
        }
        let scrollViewUiTransform = scrollView.node.getComponent(UITransform);
        if(!scrollViewUiTransform) {
            scrollViewUiTransform = scrollView.node.addComponent(UITransform);
        }
        let scrollViewContentUiTransform = scrollView.content.getComponent(UITransform);
        if(!scrollViewContentUiTransform) {
            scrollViewContentUiTransform = scrollView.content.addComponent(UITransform);
        }

        if (direction === 'h') {
            itemSize = childTransform.width + layout.spacingX;
            pageSize = scrollViewUiTransform.width / itemSize;
            scrollViewMax = scrollView.getMaxScrollOffset().x;
            lineSize = Math.round(scrollViewContentUiTransform.height / (childTransform.height + layout.spacingY));
        } else {
            itemSize = childTransform.height + layout.spacingY;
            pageSize = scrollViewUiTransform.height / itemSize;
            scrollViewMax = scrollView.getMaxScrollOffset().y;
            lineSize = Math.round(scrollViewContentUiTransform.width / (childTransform.width + layout.spacingX));
        }
        if (scrollViewMax <= 0) {
            return;
        }

        let keepVar = scrollView.getScrollOffset().x;
        let scrollOffVar = scrollView.getScrollOffset().y;
        if (direction === 'h') {
            // 滚到到左边，offVar 为负
            scrollOffVar = -scrollView.getScrollOffset().x;
            keepVar = scrollView.getScrollOffset().y;
        }
        // let temp = ( scrollViewMax / ((count - pageSize) / lineSize));

        if (scrollOffVar + itemSize > scrollViewMax) {
            this._scrollViewData[uuid] = 'prev';
        } else if (scrollOffVar < itemSize) {
            this._scrollViewData[uuid] = 'next';
        }
        if (!this._scrollViewData.hasOwnProperty(uuid)) {
            this._scrollViewData[uuid] = 'next';
        }

        let endPosition = null;
        if (this._scrollViewData[uuid] == "next") {
            if (direction === 'h') {
                endPosition = v2(itemSize + scrollOffVar, keepVar);
            } else {
                endPosition = v2(keepVar, itemSize + scrollOffVar);
            }
        } else {
            if (direction === 'h') {
                endPosition = v2(scrollOffVar - itemSize, keepVar);
            } else {
                endPosition = v2(keepVar, scrollOffVar - itemSize);
            }
        }
        if (direction === 'h') {
            if (endPosition.x !== 0) {
                endPosition.x = Math.round(endPosition.x / itemSize) * itemSize;
            }
        } else {
            if (endPosition.y !== 0) {
                endPosition.y = Math.round(endPosition.y / itemSize) * itemSize;
            }
        }
        scrollView.scrollToOffset(endPosition, 0.5);
    }

    /**
     * scrollView_auto 自动滚动
     *
     *
     * 使用方法:
     *  let way = ()=>{
            Tools.scrollView_auto_vertical(this.content,0.5)
            this.scheduleOnce(()=>{
                way()
            },0.5)
        }
     way()
     *
     *
     *
     */
    private static scrollView_auto_data: Map<string, number> = new Map<string, number>()   //0 下（右）  1 上 （左）
    /**
     * 垂直自动滚动 scroll_view  通常用于 小游戏推荐
     * @param view
     * @param timeSecond
     */
    public static scrollView_auto_vertical(view: ScrollView, timeSecond: number) {
        if (view.isScrolling() || view.isAutoScrolling()) {
            return
        }
        let maxOffset_y = view.getMaxScrollOffset().y

        if (maxOffset_y == 0) {
            return;
        }
        let now_Position = view.getScrollOffset()

        if (!this.scrollView_auto_data.get(view.uuid)) {
            //默认先往后
            this.scrollView_auto_data.set(view.uuid, 0)
        }

        if (now_Position.y >= maxOffset_y - 5) {
            this.scrollView_auto_data.set(view.uuid, 1)
        } else if (now_Position.y <= 5) {
            this.scrollView_auto_data.set(view.uuid, 0)
        }
        let flag = this.scrollView_auto_data.get(view.uuid)

        if (flag) {
            //反向
            view.scrollToOffset(v2(now_Position.x, now_Position.y - Global.config.exportScrollSpeed), timeSecond, false)
            // view.scrollToOffset(v2(now_Position.x, now_Position.y + 100), timeSecond, false)

        } else {
            //正向
            view.scrollToOffset(v2(now_Position.x, now_Position.y + Global.config.exportScrollSpeed), timeSecond, false)
            // view.setContentPosition(v2(now_Position.x, now_Position.y + 10 ))
        }
    }

    public static scrollView_auto_horizontal(view: ScrollView, timeSecond: number) {
        if (view.isScrolling() || view.isAutoScrolling()) {
            return
        }
        let maxOffset_x = view.getMaxScrollOffset().x
        let now_Position = view.getScrollOffset()
        if (!this.scrollView_auto_data.get(view.uuid)) {
            //默认先往后
            this.scrollView_auto_data.set(view.uuid, 0)
        }

        if (now_Position.x <= 5 && now_Position.x >= 0) {
            this.scrollView_auto_data.set(view.uuid, 0)
        } else if (now_Position.x < -maxOffset_x + 5 && now_Position.x > -maxOffset_x - 5) {
            this.scrollView_auto_data.set(view.uuid, 1)
        }

        let flag = this.scrollView_auto_data.get(view.uuid)

        if (flag) {
            //反向
            view.scrollToOffset(v2(-(now_Position.x) - Global.config.exportScrollSpeed, now_Position.y), timeSecond, false)
        } else {
            //正向
            view.scrollToOffset(v2(-(now_Position.x) + Global.config.exportScrollSpeed, now_Position.y), timeSecond, false)
            // view.setContentPosition(v2(now_Position.x, now_Position.y + 10 ))
        }
    }

    /**
     * 展示 Toast 提示
     * @param title
     * @param duration
     */
    public static showToast(title, duration = 1500) {
        // WechatApi.systemInterface_do('showToast', null, () => {
        //     PanelMgr.INS.openPanel({
        //         layer: Layer.gameBoxLayer,
        //         panel: ToastTips,
        //         param: {title: title, time: duration}
        //     })
        // }, {
        //     title: title,
        //     duration: duration,
        //     icon: 'none'
        // })
    }

    /**
     * 改变节点位置的 y 为 banner 位置的 y (骗点用)
     * @param node
     */
    public static changeNodePosition(node: Node) {
        let banner = Game.Ins.banner;
        const bannerUiTransform = banner.getComponent(UITransform);
        if(!bannerUiTransform){
            bannerUiTransform.addComponent(UITransform);
        }
        const y = banner.position.y + bannerUiTransform.height / 2;
        node.setPosition(new Vec3(node.position.x,y));
    }

    /**
     * 调整按钮位置到 banner上方
     * @param button
     */
    public static setExportPos(button: Node) {
        let banner = Game.Ins.banner;
        this.changeNodePosition(button);
        const bannerUiTransform = banner.getComponent(UITransform);
        if(!bannerUiTransform){
            bannerUiTransform.addComponent(UITransform);
        }
        const buttonUiTransform = button.getComponent(UITransform);
        if(!buttonUiTransform){
            buttonUiTransform.addComponent(UITransform);
        }
        const y = button.position.y + bannerUiTransform.height / 2 + buttonUiTransform.height/2;
        button.setPosition(new Vec3(button.position.x,y))
    }


    /**
     * 骗点结束移动 按钮
     * @param time
     * @param button
     */
    public static setExportPos_Animation(time: number, button: Node) {
        let banner = Game.Ins.banner
        this.changeNodePosition(button);
        const bannerUiTransform = banner.getComponent(UITransform);
        if(!bannerUiTransform){
            bannerUiTransform.addComponent(UITransform);
        }
        const buttonUiTransform = button.getComponent(UITransform);
        if(!buttonUiTransform){
            buttonUiTransform.addComponent(UITransform);
        }
        tween(button)
            .to(time, {position:new Vec3(button.position.x,button.position.y+bannerUiTransform.height/2+buttonUiTransform.height/2)}, {easing: "smooth"})
            // .to(time, {y: button.y + banner.height / 2 + button.height / 2}, {easing: "smooth"})
            .start();
    }

    /**
     * 判断百分比
     * @param per
     */
    public static checkPer(per: number) {
        if (!per) {
            return false;
        }
        return Tools.getRandomMax(100) <= per;
    }

    /**
     * 判断是否做骗点
     * @param per
     */
    public static checkCheat(per: number) {
        return this.checkPer(Global.config.isCheat) && this.checkPer(per)
    }

    /**
     * 游戏链接后台，资源加载, 初始化 gameBox
     */
    public static model_initModel(f: Function): number {
        let functions: Function[] = [
            () => {
                let names = ["sub", "common"]
                LoadMgr.loadBundle(names).then(() => {
                    f()
                })
            },
            () => {
                TestMgr.start("加载SDK")
                // JiuWuSDK.initSDK().then((res: any) => {
                //     if (res.code) {
                //         GameLogMgr.warn(Constant.LOGIN_CODE[res.code]);
                //     }
                //     TestMgr.end("加载SDK")
                //     WechatApi.screenAdv.init();
                //     WechatApi.rewardedVideo.init();
                //     f();
                // });
            },
        ]

        for (let i = 0; i < functions.length; i++) {
            functions[i]();
        }
        return functions.length;
    }

    /**
     * 将关卡数据储存到微信托管中
     */
    public static setUserCloudStorage() {
        // let data = {
        //     'wxgame': {
        //         'score': CacheMgr.checkpoint,
        //         'update_time': new Date().getTime() / 1000
        //     }
        // }
        // WechatApi.systemInterface_do('setUserCloudStorage', null, null, {
        //     KVDataList: [{key: 'level', value: JSON.stringify(data)}],
        //     success: () => {
        //         GameLogMgr.log('储存成功 ... ');
        //     },
        //     fail: (err) => {
        //         GameLogMgr.error('储存失败 ... ', err);
        //     }
        // });
    }

    /**
     * 强制到处
     */
    public static forceExport():Promise<void> {
        return new Promise((resolve, reject) => {
            let id: number = 0;
            if (Global.config.box_conf.force_Id.length > 0) {
                id = this.getRandomByArray(Global.config.box_conf.length)
            }
            let gameBox: ExportData;
            if (Global.exportInfo.length <= 0) {
                return
            }
            if (id > 0) {
                Global.exportInfo.forEach((value) => {
                    if (value.id == id) {
                        gameBox = value;
                    }
                });
            } else {
                gameBox = Global.exportInfo[this.getRandomMax(Global.exportInfo.length)]
            }
            Tools.navigateTo(gameBox, Constant.EXPORT_TYPE.FORCE, resolve)
        })
    }

    /**
     * 随机导出
     */
    public static randomExport() {
        let gameBox = Tools.getRandomByArray(Global.exportInfo)
        Tools.navigateTo(gameBox, Constant.EXPORT_TYPE.RAND_FORCE)
    }

    /**
     * 向开放数据域发送消息
     * @param data
     */
    public static subToOpenData(data: { key: string, value: any }) {
        // WechatApi.systemInterface_do('getOpenDataContext', (res) => {
        //     res.postMessage(data);
        // }, null, null);
    }

    /**
     *  播放视频， resolve 返回 true 为获得奖励， false 为未获得奖励
     */
    public static handleVideo(adType: number) {
        return new Promise((resolve) => {
            resolve(true);
            // WechatApi.rewardedVideo.show({
            //     code: adType,
            //     success: (code) => {
            //         switch (code) {
            //             case Constant.REWARDED_VIDEO_END_TYPE.END:
            //                 resolve(true);
            //                 break;
            //             case Constant.REWARDED_VIDEO_END_TYPE.NOT_END:
            //                 resolve(false);
            //                 break;
            //             case Constant.REWARDED_VIDEO_END_TYPE.ERROR:
            //                 Tools.activeShare();
            //                 resolve(true)
            //                 break
            //             case Constant.REWARDED_VIDEO_END_TYPE.INSERT_SCREEN:
            //             case Constant.REWARDED_VIDEO_END_TYPE.SHARE:
            //                 resolve(true);
            //                 break;
            //         }
            //     },
            //     callObj: this
            // });
        });
    }

    /**
     * 打开或关闭 碰撞系统功能
     * @param isOpen 碰撞系统
     * @param draw debug 绘制
     * @param bounding 包围盒
     */
    // public static getCollision(isOpen: boolean = true, draw: boolean = false, bounding: boolean = false) {
    //     let Manager = director.getCollisionManager();
    //     Manager.enabled = isOpen;
    //     Manager.enabledDebugDraw = draw;
    //     Manager.enabledDrawBoundingBox = bounding;
    // }

    /**
     * 打开或关闭 物理系统
     * @param isOpen
     * @param draw
     */
    // public static getPhysics(isOpen: boolean = true, draw: boolean = false) {
    //     let Manager = director.getPhysicsManager();
    //     Manager.enabled = true;
    //     if (draw) {
    //         director.getPhysicsManager().debugDrawFlags =
    //             PhysicsManager.DrawBits.e_aabbBit
    //             |
    //             PhysicsManager.DrawBits.e_jointBit
    //             |
    //             PhysicsManager.DrawBits.e_shapeBit
    //         ;
    //     }
    // }

    /**
     *  注册一组 touch 事件
     * @param node
     * @param start
     * @param move
     * @param end
     * @param cancel
     * @param target
     * @param bool
     */
    public static onTouchAll(node: Node, start: Function, move: Function, end: Function, cancel: Function, target: any, bool: boolean = true) {
        if (node) {
            if (bool) {
                node.on(Node.EventType.TOUCH_START, start, target);
                node.on(Node.EventType.TOUCH_MOVE, move, target);
                node.on(Node.EventType.TOUCH_END, end, target);
                node.on(Node.EventType.TOUCH_CANCEL, cancel, target);
            } else {
                node.off(Node.EventType.TOUCH_START, start, target);
                node.off(Node.EventType.TOUCH_MOVE, move, target);
                node.off(Node.EventType.TOUCH_END, end, target);
                node.off(Node.EventType.TOUCH_CANCEL, cancel, target);
            }
        }
    }

    /**
     * 获取节点所在父节点的下标
     *  @param node
     */
    public static getChildrenIndex(node: Node): number {
        let parent = node.parent;
        for (let i = 0; i < parent.children.length; i++) {
            let value = parent.children[i];
            if (node === value) {
                return i;
            }
        }
    }

    /**
     * 该位置是否在节点中
     * @param point 位置
     * @param node 节点
     */
    public static getPointInNode(point: Vec2, node: Node): boolean {
        let uitransform = node.getComponent(UITransform);
        return uitransform.getBoundingBoxToWorld().contains(point);
    }

    /**
     * 获取比较奇怪的时间字符串 （特定的一天) 20210203
     */
    public static date_getTimeNum(date: Date) {
        return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
    }

    /**
     * 获取两个时间的时间差
     * @param start1   比较靠后的时间
     * @param start2   比较靠前的时间
     * @param type     获取的时间差类型  0 day  1 hour 2 minuter 3 second
     */
    public static date_getTimeDifference(start1: Date | number, start2: Date | number, type: number): any {
        if (isNumber(start1)) {
            start1 = new Date(start1)
        }
        if (isNumber(start2)) {
            start2 = new Date(start2)
        }

        if (start1 instanceof Date && start2 instanceof Date) {
            let distance = start1.getTime() - start2.getTime(); //时间差秒
            switch (type) {
                case 0:
                    return {
                        distance: Math.floor(distance / (24 * 60 * 60 * 1000)),
                        distance_real: distance,
                    }
                case 1 :
                    return {
                        distance: Math.floor(distance / (60 * 60 * 1000)),
                        distance_real: distance,
                    }
                case 2 :
                    return {
                        distance: Math.floor(distance / (60 * 1000)),
                        distance_real: distance,
                    }
                case 3  :
                    return {
                        distance: Math.floor(distance / (1000)),
                        distance_real: distance,
                    }
            }
        }
    }

    /**
     * 获取当前主机地址
     */
    // public static getHost(): string {
    //     if (WechatApi.systemInterface == AppApi) {
    //         return JiuWuSDK.url.test;
    //     } else {
    //         return JiuWuSDK.url.host;
    //     }
    // }

    /**
     * 根据一个矩形 ，创建一个节点
     */
    public static getNodeForRect(rect: math.Rect): Node {
        let node = new Node();
        let uitransform = node.getComponent(UITransform);
        uitransform.width = rect.width;
        uitransform.height = rect.height;

        node.setPosition(new Vec3(rect.center.x, rect.center.y));
        return node;
    }

    /**
     * 主动分享
     */
    public static activeShare() {
        // WechatApi.systemInterface_do('shareAppMessage', null, null, {
        //     title: Global.config.share.title,
        //     imageUrl: Global.config.share.img,
        //     query: 'shareMsg = ' + '分享卡片上所带的信息'
        // });
    }

    /**
     * 获取一个节点四个点的位置 (未经旋转 这种操作）
     * @param node
     */
    //获取一个节点四个点的位置 (未经旋转 这种操作）
    public static getNodeFourPoint(node: Node) {
        let uiTransform = node.getComponent(UITransform);
        let anchor = uiTransform.anchorPoint;
        return {
            left_down: v2(node.position.x - anchor.x * uiTransform.width, node.position.y - anchor.y * uiTransform.height),
            left_top: v2(node.position.x - anchor.x * uiTransform.width, node.position.y + (1 - anchor.y) * uiTransform.height),
            right_down: v2(node.position.x + (1 - anchor.x) * uiTransform.width, node.position.y - anchor.y * uiTransform.height),
            right_top: v2(node.position.x + (1 - anchor.x) * uiTransform.width, node.position.y + (1 - anchor.y) * uiTransform.height)
        }
    }


    //判断一个值是否在一个数组中
    public static judgeValueInArr(value: any, arr: Array<any>) {
        let flag = false
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === value) {
                flag = true
                break
            }
        }
        return flag
    }


    //判断两个数组是否相交
    public static judgeArraySame(arr1: number[], arr2: number[]) {
        let flag = false
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i] == arr2[j]) {
                    flag = true
                    return flag
                }
            }
        }
        return flag
    }


    //banner根据节点适配
    public static getRealSize(node: Node, resize_width = null, resize_height = null): {
        width: number,
        height: number,
        left: number,
        top: number
    } {
        //获取屏幕设计尺寸
        let canvas = node.parent;
        let uiTransform = canvas.getComponent(UITransform);
        let size = uiTransform.contentSize;
        let data = Tools.getNodeFourPoint(canvas)
        let pc = data.left_top.subtract(v2(Tools.getNodeFourPoint(node).left_top))
        let screenSize = screen.windowSize;
        let scaleX = screenSize.width / size.width
        let scaleY = screenSize.height / size.height

        if (resize_width && resize_height) {
            uiTransform.width = resize_width / scaleX
            uiTransform.height = resize_height / scaleY
        }
        // console.log("scaleX", scaleX, "scaleY", scaleY)
        return {
            width: uiTransform.width * scaleX,
            height: uiTransform.height * scaleY,
            left: -pc.x * scaleX,
            top: pc.y * scaleY,
        }
    }

    //custom适配 (底 中）
    public static getCustomAd(): {
        left: number,
        top: number
    } {





        let customSize = Global.config.adv_unit_conf.customSize
        let screenSize = screen.windowSize;//view.getFrameSize()
        let left = screenSize.width / 2 - customSize.width / 2
        let top = screenSize.height - customSize.height
        return {
            left: left,
            top: top
        }
    }


    /**
     * 修改体力 ， 如果体力不足 ，修改失败的话 ，会自动弹出体力不足框
     * @param num 需要改动的体力
     * @param callBack
     */
    public static changeStamina(num: number, callBack?: Function): boolean {
        if (CacheMgr.stamina + num < 0) {
            PanelMgr.INS.openPanel({
                panel: ShortageView,
                layer: Layer.gameLayer,
                param: {
                    type: "stamina",
                    callBack: callBack,
                    price: Math.abs(num),
                }
            })
            return false;
        } else {
            if (callBack) {
                callBack();
            }
        }
        CacheMgr.stamina = CacheMgr.stamina + num;
        return true;
    }

    /**
     * 修改金币 ， 如果金币不足 ，修改失败的话 ，会自动弹出金币不足框
     * @param num
     * @param callBack   成功回调 （包括领取金币成功）
     */
    public static changeGold(num: number, callBack?: Function): boolean {
        if (CacheMgr.gold + num < 0) {
            PanelMgr.INS.openPanel({
                panel: ShortageView,
                layer: Layer.gameLayer,
                param: {
                    type: "gold",
                    callBack: callBack,
                    price: Math.abs(num),
                }
            })
            return false
        } else {
            if (callBack) {
                callBack();
            }
        }
        CacheMgr.gold = CacheMgr.gold + num
        return true
    }
}


