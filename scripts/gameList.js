class GameType {
    constructor(name, instance){
        this.name = name;
        this.instance = instance;
    }
}

var gameList = [
    //new GameType("Spelling Spin"),
    new GameType("Grammar Falls", grammarFalls)
    //new GameType("Text Trouble"),
    //new GameType("Picture Quiz")
]