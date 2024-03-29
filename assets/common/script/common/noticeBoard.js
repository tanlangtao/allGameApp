/*
 * @Author: burt
 * @Date: 2019-07-30 09:11:37
 * @LastEditors: burt
 * @LastEditTime: 2019-07-30 19:02:15
 * @Description: 公告板
 */

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.RichText, // 公告板文字(富文本)
        noticeScroll: cc.ScrollView, // 滚动视窗
    },

    /** 脚本组件初始化，可以操作this.node // use this for initialization */
    onLoad() {

    },
    /** enabled和active属性从false变为true时 */
    // onEnable() { },
    /** 通常用于初始化中间状态操作 */
    start() {
        // let testarr = [
        //     "<color=#00ff00>RichText</color>",
        //     "<color=#0fffff>Creates the action easing object with the rate parameter.</color>",
        //     "<color=#0fffff>From slow to fast.</color>",
        //     "<color=#0fffff>zh 创建 easeIn 缓动对象，由慢到快。</color>",
        // ]
        // this.noticeList = [];
        // for (let i = 0; i < testarr.length; i++) {
        //     this.noticeList.push({
        //         text: testarr[i],
        //         time: 2,
        //     })
        // }
        // this.noticeStartRoll();
    },
    /**
     * 添加滚动公告
     * @param {notice} 公告文字（富文本表示<color=#00ff00>RichText</color>）
     * @param {time} 公告滚动次数
     */
    addNotice(notice, time) {
        if (!this.noticeList) {
            this.noticeList = [];
        }
        let noticeItem = {
            text: notice,
            time: time || 1,
        }
        this.noticeList.push(noticeItem);
    },
    /** 开始滚动 */
    noticeStartRoll() {
        let item = this.noticeList.shift();
        if (item) {
            item.time--;
            let text = item.text;
            if (item.time > 0) {
                this.noticeList.push(item);
            }
            let time = text.length * 0.1 + 15;
            this.label.string = text;
            // this.label._updateRenderData(true);
            let x = this.noticeScroll.node.width / 2 + this.label.node.width / 2;
            this.label.node.setPosition(x, 0);
            let move1 = cc.moveTo(time / 3, cc.v2(0, 0));
            // let delay = cc.delayTime(time / 3);
            let move2 = cc.moveTo(time / 3, cc.v2(-x, 0));
            let callfunc = cc.callFunc(() => {
                this.noticeStartRoll();
            }, this)
            let seq = cc.sequence(move1, move2, callfunc);
            this.label.node.runAction(seq);
        }
    },

    /** 每帧调用一次 // called every frame */
    // update(dt) { },
    /** 所有组件update执行完之后调用 */
    // lateUpdate() { },
    /** 调用了 destroy() 时回调，当帧结束统一回收组件 */
    // onDestroy() { },
});
