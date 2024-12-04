import HomeView from "./HomeView";
import LayerPanel, {UrlInfo} from "../../Common/manage/Layer/LayerPanel";
import Tools from "../../Common/Tools";
import PanelMgr, {Layer} from "../../Common/manage/PanelMgr";
import LoadMgr from "../../Common/manage/LoadMgr";
import CacheMgr from "../../Common/manage/CacheMgr";
import GameConfig from "../Game/GameConfig";
import Constant from "../../Common/Constant";
import AudioMgr from "../../Common/manage/AudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndView extends LayerPanel {
    public static getUrl(): UrlInfo {
        return {
            bundle: "endView",
            name: "endView"
        }
    }

    private result: boolean = null;

    private coinNode: cc.Node = null;
    private btn1Node: cc.Node = null;
    private btn2Node: cc.Node = null;
    private btn2Sprite: cc.Sprite = null;
    private winCoin: number = 0;

    private coinPool: cc.NodePool = null;

    private coinPrefab: cc.Prefab = null;

    private startPos: cc.Vec2 = null;
    private endPos: cc.Vec2 = null;

    private effectNode: cc.Node = null;

    private residueTime: number = null;

    private getOver: boolean = false;

    private loseTitle: cc.Node = null;

    hide() {
    }

    initUI() {
        this.coinNode = this.getNode("result/coin");
        this.btn1Node = this.getNode("result/btn1");
        this.btn2Node = this.getNode("result/btn2");
        this.loseTitle = this.getNode("result/title")
        this.btn2Sprite = this.btn2Node.getComponent(cc.Sprite);
        this.effectNode = this.getNode("particle");
        this.effectNode.active = false;
        this.coinPool = new cc.NodePool();
        LoadMgr.loadPrefab("game/coin").then((prefab: cc.Prefab) => {
            this.coinPrefab = prefab;
        })
    }

    show(param: any): void {
        this.residueTime = param.residueTime;
        this.result = param.isWin;
        let residueTime = param.residue
        if (residueTime > 0) {
            if (param.isWin) {
                CacheMgr.checkpoint = CacheMgr.checkpoint + 1
            }
        }
        GameConfig.customTime = GameConfig.allTime;
        this.initEnd();
    }

    public initPool(count: number = 20) {
        for (let i = 0; i < count; i++) {
            let coin = cc.instantiate(this.coinPrefab);
            this.coinPool.put(coin);
        }
    }

    public initEnd() {
        if (this.result) {
            this.coinNode.active = true;
            this.loseTitle.active = false;
            let coinLabel: cc.Label = this.coinNode.getChildByName("count").getComponent(cc.Label);
            this.winCoin = Math.ceil(this.residueTime);
            Tools.changeGold(this.winCoin)
            let coinPos = this.coinNode.getPosition();
            let scene = cc.director.getScene();
            let gameInfoView = scene.children[0].getChildByName("gameInfoLayer");
            let selfCoin = gameInfoView.getChildByName("gameInfoView").getChildByName("gold");
            let coinWorldPos = this.coinNode.parent.convertToWorldSpaceAR(coinPos);
            let coinNodePos = this.node.convertToNodeSpaceAR(coinWorldPos);
            let selfCoinNodePos = selfCoin.getPosition()
            this.startPos = coinNodePos;
            this.endPos = selfCoinNodePos;
            this.scheduleOnce(() => {
                this.flyCoin(coinNodePos, selfCoinNodePos);
            }, 0.5)
            coinLabel.string = this.winCoin + "";
            LoadMgr.loadSprite(this.btn2Sprite, "view/endView/btn_no").then();
            this.scheduleOnce(() => {
                this.onTouch(this.btn2Node, this.onClickNext);
            }, 1)
            // this.effectNode.active = true;
            AudioMgr.play("view/game/win", 1, false).then();
        } else {
            this.coinNode.active = false;
            this.loseTitle.active = true;
            LoadMgr.loadSprite(this.btn2Sprite, "view/endView/btn_startOver").then();
            this.onTouch(this.btn2Node, this.onClickAgain)
            AudioMgr.play("view/game/lose", 1, false).then()
        }
    }

    public flyCoin(startPos, endPos, callback?: Function) {
        // let randomCount = Math.random() * 15 + 10;
        let count = Math.ceil(this.winCoin / 10);
        this.playCoinFlyAnim(count, startPos, endPos, callback);
    }

    public playCoinFlyAnim(count: number, stPos: cc.Vec2, edPos: cc.Vec2, callback?: Function, r: number = 130,) {
        const poolSize = this.coinPool.size();
        const reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
        this.initPool(reCreateCoinCount);

        // 生成圆，并且对圆上的点进行排序
        let points = this.getCirclePoints(r, stPos, count);
        let coinNodeList = points.map(pos => {
            let coin = this.coinPool.get();
            coin.setPosition(stPos);
            this.node.addChild(coin);
            return {
                node: coin,
                stPos: stPos,
                mdPos: pos,
                edPos: edPos,
                dis: (pos as any).sub(edPos).mag()
            };
        });
        coinNodeList = coinNodeList.sort((a, b) => {
            if (a.dis - b.dis > 0) return 1;
            if (a.dis - b.dis < 0) return -1;
            return 0;
        });
        let isPlay = false;
        // 执行金币落袋的动画
        coinNodeList.forEach((item, idx) => {
            //贝塞尔左右
            let leftRight = idx % 2;
            let flyY = 300;
            let flyX;
            if (leftRight == 0) {
                flyX = 300;
            } else {
                flyX = -300;
            }
            cc.tween(item.node)
                .to(0.3, {x: item.mdPos.x, y: item.mdPos.y})
                .call(() => {
                    if (!isPlay) {
                        isPlay = true;
                        AudioMgr.play("view/game/boomCoin").then()
                    }
                })
                .delay(idx * 0.05)
                .bezierTo(0.5, cc.v2(flyX, flyY), cc.v2(flyX, flyY), cc.v2(item.edPos.x, item.edPos.y))
                // .to(0.5, {x: item.edPos.x, y: item.edPos.y})
                .call(() => {
                    this.coinPool.put(item.node);
                    if (idx == coinNodeList.length - 1) {
                        if (callback) {
                            let callObj = this;
                            callback.call(callObj);
                        }
                    }
                    AudioMgr.play("view/game/getCoin").then();
                })
                .start()
        });
    }

    public getCirclePoints(r: number, pos: cc.Vec2, count: number, randomScope: number = 60): cc.Vec2[] {
        let points = [];
        let radians = (Math.PI / 180) * Math.round(360 / count);
        for (let i = 0; i < count; i++) {
            let x = pos.x + r * Math.sin(radians * i);
            let y = pos.y + r * Math.cos(radians * i);
            points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
    }

    public onClickDoubleCoin() {
        if (this.getOver) return
        this.getOver = true;
        Tools.handleVideo(Constant.VIDEO_TYPE.GET_DOUBLE).then((res) =>{
            if (res){
                this.flyCoin(this.startPos, this.endPos, this.closeEnd)
            }
        })
    }

    public onClickNext() {
        let isCanPlay = Tools.changeStamina(-1);
        if (isCanPlay) {
            this.closeEnd();
        } else {
            this.openHome();
        }
    }

    public onClickAgain() {
        let isCanPlay = Tools.changeStamina(-1);
        if (isCanPlay) {
            this.closeEnd();
        } else {
            this.openHome();
        }
    }

    public onClickDouble() {
        if (this.getOver) return
        this.getOver = true;
        Tools.handleVideo(Constant.VIDEO_TYPE.GET_DOUBLE).then((res) =>{
            if (res){
                GameConfig.customTime = GameConfig.allTime * 2;
                this.closeEnd()
            }
        })
    }

    public closeEnd() {
        this.offTouch(this.btn1Node);
        this.offTouch(this.btn2Node);
        setTimeout(() => {
            PanelMgr.INS.openPanel({
                layer: Layer.gameLayer,
                panel: HomeView,
                call: ()=>{
                    PanelMgr.INS.closePanel(EndView);
                }
            })
        }, 500)
    }

    public openHome() {
        setTimeout(() => {
            PanelMgr.INS.openPanel({
                layer: Layer.gameLayer,
                panel: HomeView,
                call: ()=>{
                    PanelMgr.INS.closePanel(EndView);
                }
            })
        }, 500)
    }
}
