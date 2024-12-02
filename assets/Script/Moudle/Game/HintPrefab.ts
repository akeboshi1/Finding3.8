import AudioMgr from "../../Common/manage/AudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HintPrefab extends cc.Component {
    start() {
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.5, {scale: 1.2})
            .to(0.1, {scale: 1})
            .call(() => {
                this.scheduleOnce(() => {
                    this.node.destroy();
                }, 1)
            })
            .start();
    }

    playSound(url) {
        AudioMgr.play(url, 1, false).then();
    }

    onDestroy() {

    }
}
