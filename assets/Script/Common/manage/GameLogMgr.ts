import Global from "../Global";

export default class GameLogMgr {

    public static log(...args: any[]): void {
        if (Global.IS_LOG) {
            console.log.apply(cc.log, args);
        }
    }

    public static warn(...args: any[]): void {
        if (Global.IS_LOG) {
            console.warn.apply(cc.warn, args);
        }
    }

    public static error(...args: any[]): void {
        if (Global.IS_LOG) {
            console.error.apply(cc.error, args);
        }
    }
}
