/**
 * Dawnson 2019-08-01
 * 15302765815@163.com
 */
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad: function () {
        this.initMgr();
    },

    initMgr: function () {
        cc.gg = cc.gg || {};

        cc.debug.setDisplayStats(false);


        // The core communication
        var Http = require('Http');
        cc.gg.http = new Http();
        var Net = require('Socket');
        cc.gg.net = new Net();

        //utils
        var Utils = require('Common');
        cc.gg.utils = new Utils();


        var AudioMgr = require('AudioMgr');
        cc.gg.audioMgr = new AudioMgr();

        var Global = require('Global');
        cc.gg.global = new Global;

        var ProtoBuf = require('Protobuf');
        cc.gg.protoBuf = new ProtoBuf();
        cc.gg.protoBuf.connect(cc.gg.global.socket, false)

    },


    onDestroy: function () {
        //注销掉所有监听事件
        cc.gg.protoBuf.removeAllHandler();
    }
});