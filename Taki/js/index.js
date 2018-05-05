var PlayersNumber = 1;
var BotNumber = 1;

function startGame() {
    var playersArr = []; // array of all kinds of players in game

    for (i = 0 ; i < PlayersNumber ; i++) {
        var PlayerArr = [];
        var player = new Player(PlayerArr, i);
        playersArr.push({ type: 'player', data: player, isTurn: false });
    }

    for (i = 0 ; i < BotNumber ; i++) {
        var BotArr = [];
        var bot = new Bot(BotArr, PlayersNumber + i);
        playersArr.push({ type: 'bot', data: bot, isTurn: false });
    }

    playersArr[0].isTurn = true;
    UI_Utiles.createPlayersElements();
    Round.setGamePlayers(playersArr);
    Round.cardDivider();
    UI_Utiles.activateTakeCardButton(true);
    UI_Utiles.activateOnClick(true);
    UI_Utiles.playerTurnSign(true);
    UI_Utiles.retireSign(true);
    UI_Utiles.makeGameVisible();
}

function startNewGame() {
    UI_Utiles.startNewRound();
    UI_Utiles.deletePlayersElements();
    Round.roundOver = false;
    startGame();
}

function retireGame() {
    var turnsOfRound = Round.stats.turns;
    var lastOfRound = Round.stats.last;
    var avgTime = Math.floor(Round.getStats().avg_time);
    //Round.totalSum+= (avgTime!=NaN) ? (avgTime * Round.stats.turns) : 0;
    if (avgTime != NaN)
        Round.totalSum += (avgTime * Round.stats.turns);
    //Round.totalSum += (avgTime * Round.stats.turns);
    //Round.totalAvg = Math.floor(Round.totalSum/ Round.totalTurns);
    Round.totalAvg = (Round.totalTurns != 0) ? Math.floor(Round.totalSum / Round.totalTurns) : 0;
    UI_Utiles.showWinner(1, turnsOfRound, lastOfRound, avgTime, Round.totalAvg);
}
