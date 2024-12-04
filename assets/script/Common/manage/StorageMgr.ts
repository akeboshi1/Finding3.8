/**
 * 本地数据处理
 */
import GameLog from "./GameLogMgr";

export default class StorageMgr {
    /**
     * 读取本地数据
     * @param key
     */
    public static read(key: string) {
        if (key != null) {
            let result = cc.sys.localStorage.getItem(key);
            if (result) {
                result = JSON.parse(result);
            }
            GameLog.log('storage read', key, result);
            return result;
        }
    }

    /**
     * 写入本地数据
     * @param key
     * @param value
     */
    public static save(key: string, value: any) {
        try {
            GameLog.log('storage save', key, value);
            if (key != null) {
                return cc.sys.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            GameLog.error(error);
        }
    }

    /**
     * 清空本地数据
     */
    public static clear() {
        return cc.sys.localStorage.clear();
    }

    /**
     * 删除本地数据
     * @param key
     */
    public static rm(key: string) {
        if (key != null) {
            return cc.sys.localStorage.removeItem(key);
        }
    }

}

