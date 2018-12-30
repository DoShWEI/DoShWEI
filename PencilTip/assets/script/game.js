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
        bg: {
            default: null,
            type: cc.Node
        },

        rubber: {
            default: null,
            type: cc.Node
        },

        pencilPrefab: {
            default: null,
            type: cc.Prefab
        },

        StartDisplay: {
            default: null,
            type: cc.Label
        },

        ScoreDisplay: {
            default: null,
            type: cc.Label
        },

        gameStart: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        // 启用物理引擎相关功能  
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -640);

        let rubberStartAciton1 = cc.jumpTo(1, cc.p(0, 20), 100, 1);
        let rubberStartAciton2 = cc.repeatForever(rubberStartAciton1);
        this.rubber.runAction(rubberStartAciton2);

        this.spawnPencil();
    },

    start() {
        this.bg.on(cc.Node.EventType.TOUCH_START, this.onEventStart, this);
    },

    spawnPencil: function () {
        for (let i = 0; i <= 13; i++) {
            let Pencil = cc.instantiate(this.pencilPrefab);
            this.node.addChild(Pencil);
            if (i < 7) {
                Pencil.setPosition(cc.p(-234 + 78 * i, -423.5));
            } else {
                Pencil.setRotation(180);
                Pencil.setPosition(cc.p(-234 + 78 * (i - 7), 423.5));
            }
        }
    },

    onEventStart: function (event) {
        if (this.gameStart === false) {
            this.gameStart = true;
            cc.log(this.gameStart);
            this.StartDisplay.destroy();
            this.ScoreDisplay.node.opacity = 255;
            this.rubber.stopAllActions();
            this.rubber.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
        }
        this.rubberJump();
    },

    rubberJump: function () {
        let direction = this.rubber.getComponent('collision').direction;
        const speed = 400;
        let x = direction * speed * Math.cos(45 * Math.PI / 180);
        let y = speed * Math.sin(60 * Math.PI / 180);
        this.rubber.getComponent(cc.RigidBody).linearVelocity = cc.v2(x, y);
    },

});
