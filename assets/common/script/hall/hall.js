/*
 * @Author: burt
 * @Date: 2019-07-27 14:58:41
 * @LastEditors: burt
 * @LastEditTime: 2019-08-12 13:36:11
 * @Description: 大厅场景
 */
const gameConfig = require('gameConfig');
let gameGlobal = require("gameGlobal");
let gHandler = require("gHandler");
let hqqCommonTools = require("hqqCommonTools");
let hqqLocalStorage = require("hqqLocalStorage");
let hqqLogMgr = require("hqqLogMgr");
let hqqAudioMgr = require("hqqAudioMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        headimg: cc.Sprite, // 玩家头像
        namelabel: cc.Label, // 玩家昵称
        coinlabel: cc.Label, // 玩家金币
        topbubble: cc.Node, // 你有新消息

        chatbtn: cc.Node, // 聊天按钮
        duihuanbtn: cc.Node, // 兑换按钮
        huodongbtn: cc.Node, // 活动按钮

        pageview: cc.PageView, // 活动页面
        itembtn: cc.Node, // 子游戏按钮
        subgameview: cc.ScrollView, // 子游戏按钮缓动面板
    },

    /** 脚本组件初始化，可以操作this.node // use this for initialization */
    onLoad() {
        if (!CC_JSB) {
            gHandler.localStorage = hqqLocalStorage.init();
            gHandler.logManager = hqqLogMgr.init();
            gHandler.commonTools = hqqCommonTools;

            cc.game.on(cc.game.EVENT_HIDE, function () {
                cc.audioEngine.pauseMusic();
                cc.audioEngine.pauseAllEffects();
                gHandler.logManager.saveLog();
                gHandler.localStorage.savaLocal();
            });
            cc.game.on(cc.game.EVENT_SHOW, function () {
                cc.audioEngine.resumeMusic();
                cc.audioEngine.resumeAllEffects();
            });
        }
        gHandler.gameConfig = gameConfig;
        gHandler.audioMgr = hqqAudioMgr.init(gHandler.hallResManager);
        gHandler.audioMgr.playBg("hallbg");

        this.infolabel = "";
        this.topbubble.active = false;
        //  todo 设置按钮红点
        this.chatbtn.getChildByName("redpoint").active = false;
        this.duihuanbtn.getChildByName("redpoint").active = false;
        this.huodongbtn.getChildByName("redpoint").active = false;
        gHandler.commonTools.setDefaultHead(this.headimg);
        if (cc.sys.isBrowser) {
            this.browserDeal();
        }
        this.addSubgame();

    },
    /** enabled和active属性从false变为true时 */
    // onEnable() { },
    /** 通常用于初始化中间状态操作 */
    start() {
    },
    /** 子游戏初始化 */
    addSubgame() {
        this.subgameview.content.width = Math.ceil(gameConfig.gamelist.length / 2) * (this.itembtn.width + 5) + this.pageview.node.width + 15;
        for (let i = 0; i < gameConfig.gamelist.length; i++) {
            let tempdata = gameConfig.gamelist[i];
            let itembtn = cc.instantiate(this.itembtn);
            itembtn.x = Math.floor(i / 2) * (this.itembtn.width + 5) + this.itembtn.width / 2 + 15 + this.pageview.node.width;
            itembtn.y = -i % 2 * this.itembtn.height - this.itembtn.height * 0.5 - 20;
            itembtn.active = true;
            this.subgameview.content.addChild(itembtn);
            let namelabel = itembtn.getChildByName("nameimg").getComponent(cc.Sprite);
            namelabel.spriteFrame = gHandler.hallResManager.getHallBtnImg(tempdata.resid);
            let ani = itembtn.getChildByName("ani").getComponent('sp.Skeleton');
            ani.skeletonData = gHandler.hallResManager.getHallBtnAni(tempdata.resid);
            ani.animation = "animation";
            itembtn.getChildByName("wait").active = false;
            itembtn.getChildByName("experience").active = false;
            tempdata.itembtn = itembtn;
            if (CC_JSB) {
                this.checkSubGameDownload(tempdata);
            } else {
                let downflag = tempdata.itembtn.getChildByName("downFlag");
                let progress = tempdata.itembtn.getChildByName("progress");
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hall";
                clickEventHandler.customEventData = tempdata;
                downflag.active = false;
                progress.active = false;
                clickEventHandler.handler = "onClickSubgame";
                let button = tempdata.itembtn.getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
        }
    },
    /** web端需要做的处理 */
    browserDeal() {
        let url = window.location.search;
        if (url.indexOf("?") != -1) {
            // var str = url.substr(1);
            // let strs = str.split("&")
            let strs = url.split("?")[1].split("&");
            for (let i = 0; i < strs.length; i++) {
                // let temp = unescape(strs[i].split("=")[1])
                let temp = strs[i].split("=")[1];
                console.log(temp)
            }
        }
    },
    /** 根据id获取服务器子游戏信息 */
    getRemoteSubgame(game_id) {
        let remotedata = gHandler.appGlobal.remoteGamelist[0];
        for (let i = 0; i < gHandler.appGlobal.remoteGamelist.length; i++) {
            if (game_id === gHandler.appGlobal.remoteGamelist[i].game_id) {
                remotedata = gHandler.appGlobal.remoteGamelist[i];
                break;
            }
        }
        return remotedata;
    },
    /** 判断子游戏是否下载更新等 */
    checkSubGameDownload(data) {
        let downflag = data.itembtn.getChildByName("downFlag");
        let progress = data.itembtn.getChildByName("progress");
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "hall";
        clickEventHandler.customEventData = data;
        let subgamev = this.getRemoteSubgame(data.game_id).version;
        let localsubv = gHandler.localStorage.get(data.enname, "versionKey");
        if (!localsubv || subgamev.split(".")[2] !== localsubv.split(".")[2]) { // 判断是否需要更新
            console.log("subgame : " + data.enname + " need update");
            downflag.active = true;
            progress.active = true;
            clickEventHandler.handler = "downloadSubGame";
        } else {
            console.log("subgame : " + data.enname + " not need update")
            downflag.active = false;
            progress.active = false;
            clickEventHandler.handler = "onClickSubgame";
        }
        let button = data.itembtn.getComponent(cc.Button);
        button.clickEvents.push(clickEventHandler);
    },
    /** 下载子游戏 */
    downloadSubGame(event, data) {
        gHandler.logManager.log("download subgame " + data.enname);
        let downflag = data.itembtn.getChildByName("downFlag");
        let progressnode = data.itembtn.getChildByName("progress");
        let progressbar = progressnode.getComponent(cc.ProgressBar);
        gHandler.SubgameManager.downloadSubgame(
            data,
            (progress) => {
                if (isNaN(progress)) {
                    progress = 0;
                }
                console.log(data.enname + " is download...", progress)
                progressbar.progress = progress;
            },
            (success) => {
                if (success) {
                    console.log("change btn callback");
                    let version = this.getRemoteSubgame(data.game_id).version;
                    gHandler.localStorage.set(data.enname, "versionKey", version)
                    progressnode.active = false;
                    downflag.active = false;
                    event.target.getComponent(cc.Button).clickEvents[0].handler = "onClickSubgame";
                } else {
                    gHandler.logManager.log("subgame " + data.enname + " download fail");
                }
            }
        );
    },
    /** 点击子游戏按钮统一回调 */
    onClickSubgame(event, subgameconfig) {
        console.log("jump to subgame", subgameconfig.enname)
        cc.director.loadScene(subgameconfig.lanchscene);
    },
    /** 复制名字 */
    onClickCopyNameBtn() {
        console.log("复制名字")
        let text = this.namelabel.string;
        gHandler.Reflect && gHandler.Reflect.setClipboard(text);
    },
    /** 充值 */
    onClickChongZhiBtn() {
        console.log("chongzhi")
    },
    /** 全民代理  */
    onClickQMDL() {
        console.log("全民代理")
    },
    /** 公告 */
    onClickGongGaoBtn() {
        console.log("公告")
    },
    /** 设置 */
    onClickSettingBtn() {
        console.log("设置")
    },
    /** 聊天 */
    onClickChatBtn() {
        console.log("聊天")
    },
    /** 兑换 */
    onClickDuiHuanBtn() {
        console.log("兑换")
    },
    /** 活动 */
    onClickHuoDongBtn() {
        console.log("活动")
    },
    /** 活动页面 */
    onClickADPage(event, custom) {
        console.log("点击活动页面", custom)
    },

    /** 每帧调用一次 // called every frame */
    // update(dt) { },
    /** 所有组件update执行完之后调用 */
    // lateUpdate() { },
    /** 调用了 destroy() 时回调，当帧结束统一回收组件 */
    // onDestroy() { },
});