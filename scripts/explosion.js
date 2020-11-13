var explosion = {
    isExplosion: false,
    frameNumber: 0,
    totalFrames: 16,
    pos: { x:0, y:0 },
    scale: { x:1, y:1 },
    explSpriteSize: 64,
    expColNum: 4,
    explosionSheet: document.getElementById("explosion"),
    GetFrameCrop: function(num){
        num = Math.floor(num);
        let x = (num % explosion.expColNum) * explosion.explSpriteSize;
        let y = Math.floor(num / explosion.expColNum) * explosion.explSpriteSize;
        return { x:x, y:y };
    },
    StartExp: function(x, y, sx=2, sy=2){
        this.frameNumber = 0;
        this.isExplosion = true;
        this.scale.x = sx;
        this.scale.y = sy;
        this.pos.x = x - (explosion.explSpriteSize / 2) * sx;
        this.pos.y = y - (explosion.explSpriteSize / 2) * sy;

    }
}