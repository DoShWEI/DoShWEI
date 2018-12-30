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

        pencilPrefab: {
            default: null,
            type: cc.Prefab
        },

        ScoreDisplay: {
            default: null,
            type: cc.Label
        },

        endLayer: {
            default: null,
            type: cc.Node
        },

        endScore: {
            default: null,
            type: cc.Label
        },

        direction: 1,

        score: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        cc.director.getCollisionManager().enabled = true;
        this.endLayer.active = false;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.tag === 1) {
            this.addPencil();
            this.direction = -this.direction;
            this.addScore();
            this.rubberPlayAnim();
        } else if (otherCollider.tag === 2) {
            this.direction = 0;
            this.rubberPlayAnim();
            this.gameOver();
        }
    },

    rubberPlayAnim: function () {
        if (this.direction !== 0) {
            this.getComponent(cc.Animation).play('rubber_1');
        } else {
            this.getComponent(cc.Animation).play('rubber_2');
        }
    },

    addScore: function () {
        if (this.direction !== 0) {
            this.score += 1;
            this.ScoreDisplay.string = this.score;
        }
    },

    addPencil: function () {
        let n = Math.floor(Math.random() * 2 + 1);
        for (let i = 1; i <= n; i++) {
            let Pencil = cc.instantiate(this.pencilPrefab);
            if (this.direction === -1) {
                this.bg.addChild(Pencil, 1, 1);
                Pencil.setRotation(-90);
                Pencil.setPosition(cc.p(213.5, Math.random() * 621 - 310.5));
            } else if (this.direction === 1) {
                this.bg.addChild(Pencil, 1, 2);
                Pencil.setRotation(90);
                Pencil.setPosition(cc.p(-213.5, Math.random() * 621 - 310.5));
            }
        };
    },

    gameOver: function () {
        cc.eventManager.removeListeners(this.bg);
        this.scheduleOnce(this.end, 2);
    },

    end: function () {
        this.bg.removeAllChildren();
        this.node.removeFromParent();
        this.ScoreDisplay.destroy();
        this.endLayer.active = true;
        this.endScore.string = '你得到了：' + this.score + '分';
    },

    update: function (dt) {
        if (this.score > 1) {
            if (this.score % 2 === 0) {
                this.bg.removeChildByTag(2);
            } else {
                this.bg.removeChildByTag(1);
            }
        }
    },

});
