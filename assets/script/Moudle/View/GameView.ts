import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import PanelMgr, {Layer} from "../../Common/manage/PanelMgr";
import CacheMgr from "../../Common/manage/CacheMgr";
import GameConfig from "../Game/GameConfig";
import LoadMgr from "../../Common/manage/LoadMgr";
import Tools from "../../Common/Tools";
import AudioMgr from "../../Common/manage/AudioMgr";
import HintPrefab from "../Game/HintPrefab";
import EndView from "./EndView";
import Constant from "../../Common/Constant";
import ActionMgr from "../../Common/manage/ActionMgr";
import HomeView from "./HomeView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends LayerPanel {
    public static getUrl(): UrlInfo {
        return {
            bundle: "gameView",
            name: "gameView"
        }
    }

    private picture1: cc.Node = null;

    private picture2: cc.Node = null;

    private pictureList: cc.Node[] = [];

    private frameList = [];

    private errNode: cc.Node = null;

    private resultList = [];

    private resultNode: cc.Node = null;

    private countDownLabel: cc.Node = null;

    private countDownTime: number = null;

    private countDown = null;

    private progress: cc.Node = null;

    private progressSprite: cc.Sprite = null;

    private hintNode: cc.Node = null;

    private addTime: cc.Node = null;

    private hintData = null;

    private hintRoundNode1: cc.Node = null;

    private hintRoundNode2: cc.Node = null;

    private interval: number = 0;

    private hintIndex: number = 0;

    private isStartCount: boolean = false;

    private reminderNode: cc.Node = null;

    private handNode: cc.Node = null;

    private customsNode: cc.Node = null;

    private victory: cc.Node = null;

    private backNode: cc.Node = null;

    private shareNode: cc.Node = null;

    private newHandHintNode: cc.Node = null;

    private clockTime: number = null;

    private plistNode: cc.Node = null;

    private tempList = [];

    private addTimeCountNode: cc.Node = null;

    private addTimeVideo: cc.Node = null;

    private hintCountNode: cc.Node = null;

    private hintVideoNode: cc.Node = null;

    private tempCountDown: number = null;

    private canAddTime: boolean = false;

    private gameOver: boolean = false;

    private pause: boolean = false;

    initUI() {
        this.canAddTime = true;
        this.picture1 = this.getNode("pictureBg/mask/picture");
        this.pictureList.push(this.picture1);
        this.picture2 = this.getNode("picture2Bg/mask/picture");
        this.pictureList.push(this.picture2);
        this.resultNode = this.getNode("resultList");
        this.countDownLabel = this.getNode("countDown/label");
        this.countDown = this.countDownLabel.getComponent(cc.Label);
        this.countDownTime = GameConfig.customTime;
        this.tempCountDown = GameConfig.allTime;
        this.progress = this.getNode("countDown/progress");
        this.progressSprite = this.progress.getComponent(cc.Sprite);
        this.hintNode = this.getNode("hint");
        this.addTime = this.getNode("addTime");
        this.hintCountNode = this.hintNode.getChildByName("count");
        this.hintVideoNode = this.hintNode.getChildByName("video");
        this.addTimeCountNode = this.addTime.getChildByName("count");
        this.addTimeVideo = this.addTime.getChildByName("video")
        this.customsNode = this.getNode("customs/label");
        this.victory = this.getNode("victory");
        this.backNode = this.getNode("back")
        this.shareNode = this.getNode("shareNode")
        this.victory.active = false;
        this.newHandHintNode = this.getNode("newHandHint");
        this.newHandHintNode.active = false;
        this.plistNode = this.getNode("caidai");
        this.plistNode.active = false;
        let checkPoint = CacheMgr.checkpoint;
        let loopLevel = checkPoint % GameConfig.allCheckPoint;
        if (loopLevel == 0) loopLevel = GameConfig.allCheckPoint;
        let customCount;
        if (loopLevel == GameConfig.allCheckPoint){
            customCount = 1;
        }else{
            customCount = loopLevel;
        }
        LoadMgr.loadBundle_Single("level" + GameConfig.level_order[customCount]).then()
        this.customsNode.getComponent(cc.Label).string = "第" + checkPoint + "关";
        let bundleName = "level" + GameConfig.level_order[loopLevel - 1]
        let pictureSprite1 = this.picture1.getComponent(cc.Sprite);
        let pictureSprite2 = this.picture2.getComponent(cc.Sprite);
        LoadMgr.loadSprite(pictureSprite1, "bg", LoadMgr.getBundle(bundleName)).then();
        LoadMgr.loadSprite(pictureSprite2, "bg", LoadMgr.getBundle(bundleName)).then();
        let custData = GameConfig.level_data[loopLevel - 1];
        let sizeData = GameConfig.level_data_size[loopLevel - 1];
        // LoadMgr.loadAtlas("view/gameView/customData/customData").then((alert: cc.SpriteAtlas) => {
        for (let i = 0; i < custData.length; i++) {
            let node: cc.Node = new cc.Node()
            node.scale = 0.91;
            node.width = sizeData[i].w;
            node.height = sizeData[i].h;
            node.setPosition(cc.v2(custData[i]).x, custData[i].y)
            node.setAnchorPoint(0.5, 0.5);
            let sprite = node.addComponent(cc.Sprite);
            LoadMgr.loadSprite(sprite, String(i), LoadMgr.getBundle(bundleName)).then()
            sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            // let url = loopLevel + "-" + i;
            // let frame = alert.getSpriteFrame(url);
            // sprite.spriteFrame = frame;
            this.picture1.addChild(node);
            this.frameList.push(node.getBoundingBox());
            this.frameList[i].id = i + 1;
        }
        if (checkPoint == 1) {
            this.newHandHint();
        } else {
            this.hintNode.active = true
            this.addTime.active = true;
        }
        // })
        this.onTouch(this.hintNode, () => {
            this.clickHint(true);
        })
        this.onTouch(this.addTime, () => {
            this.clickAddTime();
        })
        for (let j = 0; j < this.resultNode.childrenCount; j++) {
            let children = this.resultNode.children[j].getChildByName("right")
            children.active = false;
        }
        this.onTouch(this.shareNode, () => {
            Tools.activeShare();
        })
        this.onTouch(this.backNode, () => {
            PanelMgr.INS.openPanel({
                layer: Layer.gameLayer,
                panel: HomeView,
                call: () => {
                    PanelMgr.INS.closePanel(GameView)
                }
            })
        })
    }

    show(param: any): void {
        this.monitorEvent();
        this.clockTime = GameConfig.clockTime;
        this.initProp();
    }

    public initProp() {
        let time: number = CacheMgr.addTime;
        let hint: number = CacheMgr.hint;
        if (time <= 0) {
            this.addTimeVideo.active = true;
            this.addTimeCountNode.active = false;
        } else {
            this.addTimeVideo.active = false;
            this.addTimeCountNode.active = true;
            let label = this.addTimeCountNode.getChildByName("label").getComponent(cc.Label);
            label.string = time + "";
        }
        if (hint <= 0) {
            this.hintVideoNode.active = true;
            this.hintCountNode.active = false;
        } else {
            this.hintVideoNode.active = false;
            this.hintCountNode.active = true;
            let label = this.hintCountNode.getChildByName("label").getComponent(cc.Label);
            label.string = hint + "";
        }
    }

    public newHandHint() {
        console.log("进入新手提示");
        this.clickHint(false);
        this.hintNode.active = false;
        this.addTime.active = false;
        this.newHandHintNode.active = true;
    }

    update(dt) {
        this.gameCountDown(dt);
        this.hintCountDown(dt);
        this.countDownClockTime(dt);
    }

    public countDownClockTime(dt) {
        if (this.clockTime == null) return;
        if (this.gameOver) return;
        if (Math.ceil(this.clockTime) <= 0) {
            this.clockTime = GameConfig.clockTime;
            AudioMgr.play("view/game/clock").then()
            ActionMgr.shakeNode(this.hintNode)
            ActionMgr.shakeNode(this.addTime)
        }
        this.clockTime -= dt;
    }

    public gameCountDown(dt) {
        if (this.countDownTime == null) return;
        if (this.pause) return;
        if (this.gameOver) return;
        if (Math.ceil(this.countDownTime) <= 0) {
            this.countDown.string = "0";
            this.progressSprite.fillRange = 0;
            this.closeGame(false);
            this.gameOver = true;
            this.canAddTime = false;
            return;
        }
        this.countDownTime -= dt;
        this.countDown.string = Math.ceil(this.countDownTime) + "";
        let plan = this.countDownTime / this.tempCountDown;
        this.progressSprite.fillRange = plan;
    }

    hintCountDown(dt) {
        if (!this.isStartCount) return;
        if (!this.isStartCount) return;
        if (this.interval >= 10) {
            this.isStartCount = false;
            this.interval = 0;
            this.hintIndex = 0;
        }
        this.interval += dt;
    }

    public clickAddTime() {
        if (!this.canAddTime) return;
        this.pause = true;
        let addTimeCount = CacheMgr.addTime;
        if (addTimeCount <= 0) {
            Tools.handleVideo(Constant.VIDEO_TYPE.GET_PROPS).then((res) => {
                if (res) {
                    this.handler_addTime();
                    this.pause = false;
                }else {
                    this.pause = false;
                }
            })
        } else {
            CacheMgr.addTime = addTimeCount - 1;
            this.initProp();
            this.handler_addTime();
        }
    }

    public handler_addTime() {
        this.countDownTime += 60;
        this.tempCountDown += 60;
    }

    public clickHint(isCut) {
        if (this.hintData != null) return;
        this.pause = true;
        let hint = CacheMgr.hint;
        for (let i = 0; i < this.frameList.length; i++) {
            if (!this.frameList[i].dot) {
                if (isCut) {
                    // let isHint = Tools.changeGold(-100);
                    // if (!isHint) return;
                    if (hint <= 0) {
                        Tools.handleVideo(Constant.VIDEO_TYPE.GET_PROPS).then((res) => {
                            if (res) {
                                this.pause = false;
                                this.handler_hint(i);
                            }else{
                                this.pause = false;
                            }
                        })
                    } else {
                        CacheMgr.hint = hint - 1;
                        this.initProp();
                        this.handler_hint(i)
                    }
                } else {
                    this.handler_hint(i)
                }
                break;
            }
        }
    }

    public handler_hint(i) {
        let url = "view/gameView/public/hint";
        this.hintData = this.frameList[i];
        for (let j = 0; j < this.pictureList.length; j++) {
            if (j == 0) {
                this.hintRoundNode1 = this.createRound(i, j, url, 120);
            } else {
                this.hintRoundNode2 = this.createRound(i, j, url, 120);
                let node = new cc.Node();
                node.name = "hand";
                node.width = 90;
                node.height = 90;
                node.setAnchorPoint(0.5, 0.5)
                node.angle = 90;
                let sprite: cc.Sprite = node.addComponent(cc.Sprite);
                sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
                LoadMgr.loadSprite(sprite, "view/gameView/public/hand").then();
                this.hintRoundNode2.addChild(node);
                node.x += node.width / 2;
                node.y -= node.height / 2;
                // node.y -= node.width / 2;
                // node.x += node.height;
                this.handNode = node;
            }
        }
    }

    public monitorEvent() {
        this.picture1.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
        this.picture2.on(cc.Node.EventType.TOUCH_START, this.onTouchDown, this);
    }

    public onTouchDown(event: cc.Event.EventTouch) {
        let clickPos = event.getLocation();
        let target: cc.Node = event.target;
        let nodePos = target.convertToNodeSpaceAR(clickPos);
        let rect = new cc.Rect(nodePos.x, nodePos.y, GameConfig.checkArea, GameConfig.checkArea);
        rect.x -= GameConfig.checkArea / 2;
        rect.y -= GameConfig.checkArea / 2;
        let isRight: boolean = false;
        let url = "view/gameView/public/rightRound";
        for (let i = 0; i < this.frameList.length; i++) {
            let isClick = rect.intersects(this.frameList[i]);
            if (isClick) {
                isRight = true;
                AudioMgr.play("view/game/right", 1, false).then()
                let destroyHint = () => {
                    this.hintData = null;
                    if (this.hintRoundNode1) {
                        this.hintRoundNode1.destroy();
                        this.hintRoundNode1 = null;
                    }
                    if (this.hintRoundNode2) {
                        this.hintRoundNode2.destroy();
                        this.hintRoundNode2 = null;
                    }
                    if (this.handNode) {
                        this.handNode.destroy();
                        this.handNode = null;
                    }
                }
                let isDestroy = true;
                if (this.tempList.length == 0) isDestroy = true;
                for (let j = 0; j < this.tempList.length; j++) {
                    if (this.frameList[i].id == this.tempList[j]) {
                        isDestroy = false;
                        break;
                    }
                }
                if (isDestroy) destroyHint();
                if (this.frameList[i].dot) break;
                this.frameList[i].dot = true;
                this.resultList.push(i);
                for (let j = 0; j < this.pictureList.length; j++) {
                    this.createRound(i, j, url, 70);
                }
                this.createHintPrefab();
                this.createParticle(clickPos);
                this.tempList.push(this.frameList[i].id);
                break;
            }
        }
        if (!isRight) {
            if (this.errNode != null) {
                this.errNode.destroy();
                this.errNode = null;
                this.createErr(clickPos);
            } else {
                this.createErr(clickPos)
            }
        }
    }

    public closeGame(isWin) {
        if (this.gameOver) return;
        if (isWin) {
            this.victory.active = true;
        }
        setTimeout(() => {
            PanelMgr.INS.openPanel({
                layer: Layer.gameLayer,
                panel: EndView,
                param: {
                    residue: 1,
                    isWin: isWin,
                    residueTime: this.countDownTime
                },
                call: () => {
                    PanelMgr.INS.closePanel(GameView)
                }
            })
        }, 1500)
    }

    public createHintPrefab() {
        if (this.reminderNode) {
            this.reminderNode.destroy();
            this.reminderNode = null;
        }
        LoadMgr.loadPrefab(GameConfig.prefabData[this.hintIndex]).then((prefab: cc.Prefab) => {
            let node = cc.instantiate(prefab);
            this.node.addChild(node);
            let script = node.getComponent(HintPrefab);
            script.playSound(GameConfig.soundData[this.hintIndex]);
            this.hintIndex += 1;
            this.isStartCount = true;
            this.interval = 0;
            this.reminderNode = node;
        })
    }

    public createParticle(clickPos) {
        let result = this.resultList.length;
        if (this.resultList.length == 5) {
            this.plistNode.active = true;
            AudioMgr.play("view/game/sahua").then();
        }
        let resultNode = this.resultNode.children[result - 1]
        let resultPos = resultNode.getPosition();
        let resultWorldPos = resultNode.parent.convertToWorldSpaceAR(resultPos);
        let targetNodePos = this.node.convertToNodeSpaceAR(resultWorldPos);
        let pos = this.node.convertToNodeSpaceAR(clickPos);
        let node = new cc.Node();
        node.name = "particle";
        node.setPosition(pos);
        let particleComp: cc.ParticleSystem = node.addComponent(cc.ParticleSystem);
        let particleUrl = "view/gameView/particle/win";
        LoadMgr.loadParticle(particleUrl).then((particle: cc.ParticleAsset) => {
            particleComp.file = particle;
        })
        this.node.addChild(node);
        cc.tween(node)
            .to(0.5, {x: targetNodePos.x, y: targetNodePos.y})
            .call(() => {
                let children = resultNode.getChildByName("right")
                children.active = true;
                this.checkResult();
                let checkPoint = CacheMgr.checkpoint;
                if (checkPoint == 1) {
                    this.clickHint(false);
                }
                setTimeout(() => {
                    node.destroy();
                }, 200)
            })
            .start()
    }


    public createRound(index1, index2, url, dia) {
        let node: cc.Node = new cc.Node();
        node.width = dia;
        node.height = dia;
        //矩形是从左下角为锚点
        let diffX = this.frameList[index1].width / 2;
        let diffY = this.frameList[index1].height / 2;
        node.setPosition(this.frameList[index1].x + diffX, this.frameList[index1].y + diffY)
        node.setAnchorPoint(0.5, 0.5)
        let sprite: cc.Sprite = node.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        LoadMgr.loadSprite(sprite, url).then();
        this.pictureList[index2].addChild(node);
        return node;
    }

    public createErr(clickPos) {
        this.isStartCount = false;
        this.interval = 0;
        this.hintIndex = 0;
        AudioMgr.play("view/game/err", 1, false).then();
        let node: cc.Node = new cc.Node;
        node.width = 60;
        node.height = 60;
        let gameViewPos = this.node.convertToNodeSpaceAR(clickPos);
        node.setPosition(gameViewPos);
        node.setAnchorPoint(0.5, 0.5);
        let sprite: cc.Sprite = node.addComponent(cc.Sprite);
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        LoadMgr.loadSprite(sprite, "view/gameView/public/err");
        this.node.addChild(node);
        this.errNode = node;
        cc.tween(node)
            .to(1.5, {opacity: 0})
            .call(() => {
                node.destroy();
            })
            .start()
        let count: cc.Node = new cc.Node;
        count.setPosition(gameViewPos);
        count.setAnchorPoint(0.5, 0.5);
        count.color = new cc.Color(255, 0, 0, 255);
        let str = count.addComponent(cc.Label);
        str.string = "-10";
        str.fontSize = 40;
        this.node.addChild(count);
        let resultPos = this.countDownLabel.convertToWorldSpaceAR(this.countDownLabel.getPosition());
        let nodePos = count.parent.convertToNodeSpaceAR(resultPos);
        cc.tween(count)
            .to(1, {x: nodePos.x, y: nodePos.y})
            .call(() => {
                count.destroy();
                this.countDownTime -= 10;
            })
            .start()
    }

    public checkResult() {
        if (this.resultList.length == this.resultNode.childrenCount) {
            this.closeGame(true);
            this.gameOver = true;
        }
    }

    hide() {
    }
}

