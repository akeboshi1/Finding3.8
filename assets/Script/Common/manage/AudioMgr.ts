/**
 * 音乐管理器
 */
import Global from "../Global";
import GameLog from "./GameLogMgr";
import CacheMgr from "./CacheMgr";
import LoadMgr from "./LoadMgr";

const {ccclass} = cc._decorator;

@ccclass
export default class AudioMgr {

    /**
     * @param isStop
     */
    public static backMusic(isStop = true) {
        if (CacheMgr.setting.setting.music === 0) {
            cc.audioEngine.stopMusic();
        } else if (!isStop) {
            cc.audioEngine.stopMusic();
        } else if (!cc.audioEngine.isMusicPlaying()) {
            LoadMgr.load_AudioClip("bg").then((audio: cc.AudioClip) => {
                cc.audioEngine.playMusic(audio, true);
                cc.audioEngine.setMusicVolume(CacheMgr.setting.setting.music);
            });
        }
    }

    public static play(url: string, max: number = 1, loop: boolean = false) {
        return new Promise((resolve, reject) => {
            if (CacheMgr.setting.setting.audio === 0) {
                GameLog.warn(" 当前音量静音 ");
                resolve(false);
            }

            LoadMgr.load_AudioClip(url).then((audio: cc.AudioClip) => {
                let id: number = 0;
                cc.audioEngine.setEffectsVolume(max * CacheMgr.setting.setting.audio);
                id = cc.audioEngine.playEffect(audio, loop)
                resolve(id);
            })

            // Global.bundleList.audio.load(url, cc.AudioClip, (err: Error, audio: cc.AudioClip) => {
            //     if (err) {
            //         GameLog.error(' 音效播放错误 ', url);
            //         reject(false);
            //     }
            //     let id: number = 0;
            //     cc.audioEngine.setEffectsVolume(max * CacheMgr.setting.setting.audio);
            //     id = cc.audioEngine.playEffect(audio, loop)
            //     resolve(id);
            // });
        });
    }
}
