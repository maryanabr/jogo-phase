// Game configuration using Phaser.js
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let platforms;
let questionText;
let questionIndex = 0;
let score = 0;
let scoreText;
let finalChallenge;

const questionData = [
    { question: "During recess, a friend falls and hurts their knee. What do you do?", answer: "Ask if they are okay and call an adult for help." },
    { question: "The teacher is explaining something important, but you find it boring. What do you do?", answer: "Try to pay attention because it is important for learning." },
    { question: "Your little sister is crying because she broke a toy. How do you react?", answer: "Tell her you understand she is sad and help her fix it or find another toy." },
    { question: "A classmate is sad because they lost a game. What do you do?", answer: "Tell them that you have lost too and that they can try again." },
    { question: "Your mom asks you to turn off the tablet and come to dinner. What do you do?", answer: "Let her know you are finishing something and turn it off soon after." },
    { question: "The teacher calls your attention for talking in class. What do you do?", answer: "Stay quiet and pay attention." },
    { question: "A friend forgot their lunch at home and is hungry. What do you do?", answer: "Offer to share some of your lunch." },
    { question: "You see a classmate being teased by other kids. What do you do?", answer: "Defend the classmate and say that it is not okay." },
    { question: "Your stepmother asks for help cleaning the living room, but you want to watch videos on your phone. How do you react?", answer: "Help quickly so you can watch your videos afterward." },
    { question: "Your sister took your toy without asking. What do you do?", answer: "Explain that you didn’t like it and ask her to ask for permission next time." },
    { question: "You notice a classmate is sad, but you don't know why. What do you do?", answer: "Ask if they want to talk or need help." },
    { question: "Your mom is tired and asks you to help put away the groceries. How do you react?", answer: "Help quickly so she can rest." },
    { question: "A friend apologizes after a fight. What do you do?", answer: "Accept the apology and try to resolve the problem." },
    { question: "You did something wrong at school, and the teacher wants to talk. How do you respond?", answer: "Listen and try to understand how to improve." },
    { question: "An elderly person is struggling to cross the street. What do you do?", answer: "Ask an adult to help and wait patiently." }
];

function preload() {
    this.load.image('background', 'https://i.imgur.com/Y5BQwLV.png');
    this.load.image('platform', 'https://i.imgur.com/s5aOqzU.png');
    this.load.image('chocolateEnemy', 'https://i.imgur.com/FuKcqXj.png');
    this.load.spritesheet('player', 'https://i.imgur.com/sB5B9El.png', { frameWidth: 32, frameHeight: 48 });
}

function create() {
    this.add.image(400, 300, 'background');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'platform').setScale(2).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(200, 250, 'platform');

    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    
    questionText = this.add.text(20, 20, questionData[questionIndex].question, { fontSize: '16px', fill: '#FFF' });
    scoreText = this.add.text(650, 20, 'Score: 0', { fontSize: '16px', fill: '#FFF' });
    this.input.keyboard.on('keydown-SPACE', nextQuestion, this);

    finalChallenge = this.physics.add.sprite(700, 500, 'chocolateEnemy');
    this.physics.add.collider(finalChallenge, platforms);
    this.physics.add.overlap(player, finalChallenge, completeLevel, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function nextQuestion() {
    questionIndex++;
    if (questionIndex < questionData.length) {
        questionText.setText(questionData[questionIndex].question);
        score += 10;
        scoreText.setText('Score: ' + score);
    } else {
        questionText.setText("Now face the final challenge!");
    }
}

function completeLevel(player, finalChallenge) {
    questionText.setText("Congratulations, Lorenza! You have gained the skill of empathy!");
    player.setVelocity(0);
    finalChallenge.destroy();
}
