import Phaser from 'phaser'

const SKY_KEY = 'sky';
const EXP_KEY = 'exp';

const FONT_MED = '24px Arial'

export default class GrammarFallsScene extends Phaser.Scene
{
	constructor()
	{
        super('Grammar-Falls')
        
        this.gameData = undefined
        
        this.explosion = undefined
        
        this.sentence = undefined
        this.answers = []
    }

	preload()
    {
        console.log("Preload Grammar Falls")
        this.load.json('sentences', 'assets/Sentences.json')
        this.load.image(SKY_KEY, 'assets/night-sky.png')
        this.load.spritesheet(EXP_KEY, 'assets/explosion.png', {frameWidth: 64, frameHeight: 64})
    }

    create()
    {
        console.log("Create Grammar Falls")
        this.gameData = this.cache.json.get('sentences')
        this.createBackground()
        this.explosion = this.createExplosion()
        this.sentence = this.createQuizSentence()
        this.answers = this.createAnswers()
        this.newQuiz()
    }


    update(){

    }

    createBackground(){
        this.add.image(240, 160, SKY_KEY)
        this.add.image(240, 480, SKY_KEY)
    }

    createExplosion(){
        let exp = this.add.sprite(240, 320, EXP_KEY)

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers(EXP_KEY, { start: 0, end: 15}),
            frameRate: 36
        })

        exp.setVisible(false)

        return exp
    }

    createQuizSentence(){
        let text = this.add.text(240, 240, 'BOO!', {font: FONT_MED}).setOrigin(0.5)
        return text
    }
    createAnswers() {
        const numAnswers = 4
        let answers = []
        for(let i=0;i<numAnswers;i++){
            answers.push(this.add.text(240, 400 + 40 * i, `Ans ${i}`, {font: FONT_MED}).setOrigin(0.5))
        }

        return answers
    }

    newQuiz(){
        let quiz = this.getQuiz()
        this.sentence.text = this.getSentence(quiz)
        

    }

    createInput(){
        let keys = {}
        keys.enter = this.input.keyboard.addKey('ENTER')
        keys.enter.on(
            'down', 
            () => {
                
            }
        )
        keys.escape = this.input.keyboard.addKey('ESCAPE')
        keys.escape.on(
            'down', 
            () => {
                
            }
        )
        keys.up = this.input.keyboard.addKey('UP')
        keys.up.on(
            'down',
            () => {

            }
        )
        keys.down = this.input.keyboard.addKey('DOWN')
        keys.down.on(
            'down',
            () => {

            }
        )
        keys.left = this.input.keyboard.addKey('LEFT')
        keys.left.on(
            'down',
            () => {

            }
        )
        keys.right = this.input.keyboard.addKey('RIGHT')
        keys.right.on(
            'down',
            () => {

            }
        )
        return keys
    }

    selectAnswer(index){

    }

    getQuiz(){
        let index = this.randIndex(this.gameData.sentences.length);
        return this.gameData.sentences[index]
    }

    getSentence(quiz){
        console.log("GetSentence");
        let text = this.processText(quiz.text);
    
        return text[0].toUpperCase() + text.slice(1);
        // sentence.text = text[0].toUpperCase() + text.slice(1);
    
        // correctAnswer = ProcessText(data.sentences[index].correctAnswer);
    
        //Randomly choose correct place
        // let correctIndex = RandIndex(4);
        // let indices = ['c',0,1,2];
        // shuffle(indices);
    
        // for(let i=0; i<4; i++){
        //     let ans;
        //     if(indices[i]==='c'){
        //         ans = correctAnswer;
        //     }else{
        //         ans = ProcessText(data.sentences[index].wrongAnswer[indices[i]]);
        //     }
    
        //     answers[i] = new answer(ans, i);
            
        // }
    }

    getCorrectAnswer(){

    }
    getWrongAnswers(){

    }
    
    /**
     * @param {string} text
     */
    processText(text){
        if(!text.includes("%")){
            return text;
        }
    
        // Text includes a % sign
        //debugger;
        let finishedText = text;
        console.log("New Sentence is: " + text);
        while(finishedText.includes("%")){
            console.log("Sentence is currently: " + finishedText);
            let str = finishedText;
            let wildCard = str.split("%")[1];
            let replacement = "";
            
            for(const partOfSpeech of this.gameData.partsOfSpeech){
                console.log(partOfSpeech.name);
                if(wildCard == partOfSpeech.keyword){
                    console.log("Found keyword "+partOfSpeech.keyword);
                    replacement = partOfSpeech.words[this.randIndex(partOfSpeech.words.length)];
                    break;
                }
            }
            
            finishedText = finishedText.replace("%"+wildCard+"%", replacement);
        }
        console.log("Finished sentence is: " + finishedText);
        return finishedText;
        
    }
    randIndex(max){
        return Math.floor(Math.random() * max);
    }
}
