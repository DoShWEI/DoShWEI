// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // PhysicsLayer: {
        //     default: null,
        //     type: cc.Node
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    start() {

    },

    onCollisionEnter(other, self) {
        // var direction = this.PhysicsLayer.getComponent('game').direction;
        if (self.tag === 1) {
            console.log('on collision exit');
            direction = -direction;
        } else if (self.tag === 3) {
        }
    },

    onCollisionStay: function (other, self) {
        console.log('on collision exit');
    },

    // 碰撞结束
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
    },


    update (dt) {
    },
});
