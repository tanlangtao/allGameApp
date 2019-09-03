// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var intercepttouch = require('InterceptTouch');
var BaseDef = require('BaseDef');
var NoticeDef = require('NoticeDef');
var Notification = require('Notification');

cc.Class({
    extends: cc.Component,
    mixins:[intercepttouch],
 

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad ()
    {
        this.Intercept();
    },

    PlayButtonHitSound()
    {
        Notification.SendNotify(NoticeDef.PlayEffect,BaseDef.SOUND_DEF.SUD_HITBUTTON);
    },    

    Close()
    {
        this.PlayButtonHitSound();                
        this.node.destroy();
    },

    setGameUI(gameUI)
    {
        this.GameUI = gameUI;
    },

    onDestroy()
    {
        this.GameUI.onCloseFishListPanel();
    },

    start () {

    },

    // update (dt) {},
});