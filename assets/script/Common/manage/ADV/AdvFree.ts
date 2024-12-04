/**
 * 空广告类
 */
import AdvBase from "./AdvBase";

const {ccclass} = cc._decorator;
@ccclass
export default class AdvFree extends AdvBase {

    public static instance(): AdvBase {
        if (this._instance === null) {
            this._instance = new AdvFree();
        }
        return this._instance;
    }

    public getNode() {
        return null;
    }


    init(param?: any) {

    }

    hide() {

    }

    show(param?: any) {

    }

}

