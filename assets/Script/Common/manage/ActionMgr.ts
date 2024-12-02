/**
 * 动画效果类
 */

import easeInOut = cc.easeInOut;
import GameLog from "./GameLogMgr";
import Tween = cc.Tween;
import tween = cc.tween;

export default class ActionMgr {

    //疯狂抖动手指
    public static shakeHand(node: cc.Node) {
        tween(node)
            .by(0.05, {y: 20})
            .by(0.05, {y: -20})
            .union()
            .repeatForever()
            .start()
    }


    public static scaleNode(node: cc.Node, scale: number, time = 0.5) {
        try {
            cc.tween(node)
                .to(0, {scale: scale, y: -node.height * (1 - scale)})
                .to(time, {scale: 1, y: 0})
                .start()
        } catch (e) {
            node.scale = 1;
            node.y = 0;
            GameLog.log('shake动画异常', e);
        }
    }

    public static moveUpDownForever(node: cc.Node, runTime = 0.2, diff = 10) {
        cc.tween(node).repeatForever(
            cc.sequence(
                cc.moveBy(runTime, new cc.Vec2(0, diff)),
                cc.moveBy(runTime, new cc.Vec2(0, -diff)),
            )
        ).start();
    }

    /**
     * 旋转节点
     * @param node
     * @param duration
     */
    public static rotate(node: cc.Node, duration = 3) {
        try {
            cc.tween(node).repeatForever(
                cc.sequence(
                    cc.rotateTo(duration, 180),
                    cc.rotateTo(duration, 360),
                )
            ).start();

        } catch (e) {
            GameLog.error('shakeNode异常', e, node);

        }
    }


    /**
     * 放大缩小 node
     * @param node
     * @param timeRun
     * @param timeStop
     * @param scale
     * @param count
     * @param endScale
     * @constructor
     */
    public static scaleStop(node: cc.Node, timeRun = 0.1, timeStop = 10, scale = 0.3, count = 1, endScale = 1) {
        try {
            if (!node) {
                return;
            }
            node.scale = endScale;
            cc.tween(node)
                .repeatForever(
                    cc.tween()
                        .repeat(count,
                            cc.tween()
                                .to(timeRun, {scale: 1 + scale}, {easing: "smooth"})
                                .to(timeRun, {scale: endScale}, {easing: "smooth"})
                        )
                        .to(timeRun, {angle: 0})
                        .delay(timeStop)
                )
                .start()


        } catch (e) {
            GameLog.error('shakeNode异常', e, node);

        }
    }

    public static shakeNode(node: cc.Node, timeRun = 0.3, dstAngle: number = 10, count: number = 5) {
        cc.tween(node)
            .repeat(count,
                cc.tween()
                    .to(timeRun, {angle: -dstAngle})
                    .to(timeRun, {angle: dstAngle})
            ).to(timeRun, {angle: 0}).start();
    }

    /**
     * 摇动node
     * @param node
     * @param duration
     * @param dstAngle
     * @constructor
     */
    public static shakeNodeForever(node: cc.Node, duration = 4, dstAngle = 10) {
        try {
            cc.tween(node).repeatForever(
                cc.sequence(
                    cc.rotateTo(duration, -dstAngle),
                    cc.rotateTo(duration, dstAngle),
                )
            ).start();

        } catch (e) {
            GameLog.error('shakeNode异常', e, node);

        }
    }

    /**
     * node晃动后停止，一段时间后继续晃动
     * @param node 动作的节点
     * @param timeRun 单次晃动到左右任一边的时间
     * @param timeStop 停止的时间
     * @param dstAngle 晃动的角度
     * @param shakeCount 晃动的次数
     */
    public static shakeStop(node: cc.Node, timeRun = 0.1, timeStop = 10, dstAngle = 10, shakeCount = 5) {
        try {
            cc.tween(node)
                .repeatForever(
                    cc.tween()
                        .delay(timeStop)
                        .repeat(shakeCount,
                            cc.tween()
                                .to(timeRun, {angle: -dstAngle})
                                .to(timeRun, {angle: dstAngle})
                        )
                        .to(timeRun, {angle: 0})
                )
                .start()

        } catch (e) {

            GameLog.error('shakeStop异常', e, node);
        }
    }

    public static scaleMove(node: cc.Node, delayTime: number = 3, repeatCount: number = 2,) {
        cc.tween(node)
            .repeatForever(
                cc.tween()
                    .delay(delayTime)
                    .repeat(repeatCount,
                        cc.tween()
                            .to(0.3, {scale: 1.1})
                            .to(0, {scale: 1})
                            .to(0.3, {scale: 1.2})
                            .to(0, {scale: 1})
                    )
                // .repeat(repeatCount,
                //     cc.tween()
                // )
            )
            .start();
    }

    /**
     * 界面缩放进入
     * @param node
     * @param duration
     */
    public static moveBigIn(node: cc.Node, duration = 0.3) {
        if (!node) {
            return false;
        }
        try {
            node.scale = 2;
            cc.tween(node)
                .to(duration, {scale: 1}, easeInOut(1))
                .start();

        } catch (e) {
            node.scale = 1;
            GameLog.error('moveIn 异常', e, node);

        }
    }


    /**
     * 界面缩放进入
     * @param node
     * @param duration
     * @param beginSale
     */
    public static moveIn(node: cc.Node, duration: number = 0.4, beginSale: number = 0) {
        node.scale = beginSale;
        cc.tween(node)
            .to(duration, {scale: 1}, {easing: 'backOut'})
            .start();
    }

    /**
     * 界面从上推下
     */
    public static moveTop(node: cc.Node, time: number = 0.4) {
        node.y = node.height / 2;
        cc.tween(node)
            .to(time,{y: 0}, {easing: "smooth"})
            .start()
    }

    /**
     * 界面缩放退出
     * @param node
     * @param duration
     * @param endScale
     */
    public static moveOut(node: cc.Node, duration = 0.4, endScale = 0) {
        if (!node) {
            return false;
        }
        try {
            node.scale = 1;
            cc.tween(node)
                .to(duration, {scale: endScale})
                .start();
        } catch (e) {
            node.scale = 0;
            GameLog.error('moveOut 异常', e, node);
        }
    }

    public static TWEEN_FROM_SIDE = {
        TOP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4
    };

    private static _moveSideNodePosition = {};

    /**
     * 从画布外进入, 不能重复调用
     * @param node 动作的节点
     * @param beginSide 界面进入的边
     * @param time 动作进行的时间/s
     * @param delay 动作延迟进行的时间/s
     */
    public static moveInSide(node: cc.Node, beginSide = this.TWEEN_FROM_SIDE.TOP, time = 0.5, delay = 0) {
        if (!node) {
            return false;
        }
        if (!this._moveSideNodePosition.hasOwnProperty(node.uuid)) {
            this._moveSideNodePosition[node.uuid] = node.position.clone();
        }
        try {
            let resultPos = this._getSideResultPos(node, beginSide);
            node.position = resultPos;
            GameLog.log("节点", node.name, "界面外坐标为：", resultPos);
            cc.tween(node)
                .delay(delay)
                .to(time, {position: this._moveSideNodePosition[node.uuid].clone()}, {easing: 'quartIn'})
                .start();
        } catch (e) {
            node.position = this._moveSideNodePosition[node.uuid].clone();
            GameLog.log("move In Side 异常", e, node);
        }

    }

    /**
     * 移出画布外, 不能重复调用
     * @param node 动作的节点
     * @param endSide 界面移出的边
     * @param time 动作进行的时间/s
     */
    public static moveOutSide(node: cc.Node, endSide = this.TWEEN_FROM_SIDE.TOP, time = 0.5) {
        if (!node) {
            return false;
        }
        if (!this._moveSideNodePosition.hasOwnProperty(node.uuid)) {
            this._moveSideNodePosition[node.uuid] = node.position;
        }
        try {
            let resultPos = this._getSideResultPos(node, endSide);
            cc.tween(node)
                .to(time, {position: resultPos}, {easing: 'quartIn'})
                .call(() => {
                    node.position = this._moveSideNodePosition[node.uuid].clone();
                    GameLog.log('end move out side', node.position);
                })
                .start();
        } catch (e) {
            node.position = this._moveSideNodePosition[node.uuid].clone();
            GameLog.log("move Out Side 异常", e, node);
        }

    }

    private static _getSideResultPos(node: cc.Node, side) {
        //获取屏幕尺寸
        let winSize = cc.winSize;
        let windowHeight = winSize.height;
        let windowWidth = winSize.width;
        GameLog.log("屏幕尺寸大小为：", windowHeight, windowWidth);
        //根据节点移动方向获取坐标
        let pos;
        switch (side) {
            case ActionMgr.TWEEN_FROM_SIDE.TOP:
                pos = new cc.Vec2(node.x, windowHeight + node.height);
                break;
            case ActionMgr.TWEEN_FROM_SIDE.DOWN:
                pos = new cc.Vec2(node.x, -windowHeight - node.height);
                break;
            case ActionMgr.TWEEN_FROM_SIDE.LEFT:
                pos = new cc.Vec2(-windowWidth - node.width, node.y);
                break;
            case ActionMgr.TWEEN_FROM_SIDE.RIGHT:
                pos = new cc.Vec2(windowWidth + node.width, node.y);
                break;
        }
        return pos;
    }

    /**
     * 左右移动
     * @param node 运动的节点
     * @param direction 运动的方向
     * @param disMove 运动的距离
     * @param timeMove 运动的时间/s
     */
    public static moveLeftRight(node: cc.Node, direction, disMove: number, timeMove: number) {
        try {
            let lessPos;
            let morePos;
            switch (direction) {
                case ActionMgr.TWEEN_FROM_SIDE.LEFT:
                case ActionMgr.TWEEN_FROM_SIDE.RIGHT:
                    lessPos = new cc.Vec2(node.x - disMove, node.y);
                    morePos = new cc.Vec2(node.x + disMove, node.y);
                    break;
                case ActionMgr.TWEEN_FROM_SIDE.TOP:
                case ActionMgr.TWEEN_FROM_SIDE.DOWN:
                    lessPos = new cc.Vec2(node.x, node.y - disMove);
                    morePos = new cc.Vec2(node.x, node.y + disMove);
                    break;
            }
            cc.tween(node).repeatForever(
                cc.sequence(
                    cc.moveTo(timeMove, lessPos),
                    cc.moveTo(timeMove, morePos)
                )
            ).start();

        } catch (e) {
            GameLog.error('moveLeftRight异常', e, node);
        }
    }

    public static showGradually(node: cc.Node, duration = 1, delay = 0, endOpacity = 255, starOpacity = 0) {
        try {
            cc.tween(node)
                .call(() => {
                    node.opacity = starOpacity;
                    node.active = true;
                })
                .delay(delay)
                .to(duration, {opacity: endOpacity})
                .start()
        } catch (e) {
            node.opacity = endOpacity;
            GameLog.error('showGradually异常', e, node);
        }
    }

    public static hideGradually(node: cc.Node, duration = 1, delay = 0, endOpacity = 50) {
        try {
            node.active = true;
            cc.tween(node)
                .delay(delay)
                .to(duration, {opacity: endOpacity}, {easing: 'quartIn'})
                .call(() => {
                    node.active = false;
                    node.opacity = 255;
                })
                .start()

        } catch (e) {
            node.opacity = endOpacity;
            GameLog.error('showGradually异常', e, node);
        }
    }
}
