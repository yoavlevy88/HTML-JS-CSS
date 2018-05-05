var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stats = function () {
    function Stats() {
        _classCallCheck(this, Stats);

        this.turns = 0;
        this.last = 0;
        this.turnstime = new Array();
    }

    _createClass(Stats, [{
        key: "getAvgTime",
        value: function getAvgTime() {
            var sum = 0;
            for (var i = 1; i < this.turnstime.length; i++) {
                sum += this.turnstime[i];
            }
            if (this.turns != 0)
                return sum / this.turns;
            else
                return 0;
        }
    }]);

    return Stats;
}();

var Round = (function () {
    var totalSeconds = 0;
    var bestMatchIndex = undefined;
    var bestMatch = 0;
    var pileCardNumber = undefined;
    var pileCardColor = undefined;
    var currentBotCardNumber = undefined;
    var currentBotCardColor = undefined;
    var UserTurn = true;
    var takiCardIsActive = false;// takiCardIsActive
    var OpenTakiColor = "";
    var PlayersArr;
    var currentPlayerIndex = 0;
    var curTime = 0;
    var timeOutDone = false;

    return {
        roundOver: roundOver = false,
        startedTime: startedTime = 0,
        stats: new Stats(),
        totalToDraw: totalToDraw = 0,
        totalSum: totalSum = 0,
        totalTurns: totalTurns = 0,
        totalAvg: totalAvg = 0,
        interval: interval = undefined,
        setGamePlayers: function (i_playerArr) {
            PlayersArr = i_playerArr.slice(); //copy the array to PlayersArr
        },

        getStats: function () {
            let avg = this.stats.getAvgTime();
            return { "num_turns": this.stats.turns, "last_one": this.stats.last, "avg_time": avg };
        },

        setTurnTime: function (curTime) {
            this.stats.turnstime[this.stats.turns] = curTime - this.startedTime;
            this.startedTime = curTime;
        },

        setStats: function () {
            this.stats.turns++;
            this.totalTurns++;
            if (PlayersArr[currentPlayerIndex].data.cardsArrInHand.length === 1)
                this.stats.last++;
        },

        cardDivider: function () {
            CardContainer.createDeck();

            for (var i = 0; i < PlayersArr.length ; i++) {
                this.totalToDraw = 8;
                this.totalToDraw = CardContainer.drawCards(this.totalToDraw, PlayersArr[i].data);
            }

            UI_Utiles.displayPile(CardContainer.drawFirstPileCard().fullName);

            for (var i = 0; i < PlayersArr.length ; i++) {
                UI_Utiles.displayCards(i, PlayersArr[i].type, PlayersArr[i].isTurn, PlayersArr[i].data.cardsArrInHand);
            }
            this.interval = setInterval(Round.countTimer, 1000);
        },

        countTimer: function () {
            ++totalSeconds;
            var string = { hour: 0, minute: 0, seconds: 0 };
            string.hour = Math.floor(totalSeconds / 3600);
            string.minute = Math.floor((totalSeconds - string.hour * 3600) / 60);
            string.seconds = totalSeconds - (string.hour * 3600 + string.minute * 60);
            curTime = totalSeconds;
            UI_Utiles.activateTime(string);
        },

        reset() {
            delete (this.stats);
            this.stats = new Stats();
            totalSeconds = 0;
            this.startedTime = 0;
            this.totalToDraw = 0;
        },

        nextTurnIncrement: function (skipNext, turnAgain, activeBotTakiCard) {
            var that = this;
            if (!this.checkEndGame()) {
                if ((skipNext && PlayersArr[(currentPlayerIndex + 2) % PlayersArr.length].type === 'bot') // next turn is a bot
                    || (!skipNext && !turnAgain && PlayersArr[(currentPlayerIndex + 1) % PlayersArr.length].type === 'bot')
                    || (turnAgain && PlayersArr[currentPlayerIndex].type === 'bot')
                    || activeBotTakiCard) {



                    if (PlayersArr[currentPlayerIndex].type === 'player') { // current turn is aplayer and next turn is a bot
                        this.setStats();
                        this.setTurnTime(curTime);
                        UI_Utiles.renderStats();
                        UI_Utiles.displayCards(currentPlayerIndex, 'player', false, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                        UI_Utiles.activateTakeCardButton(false);
                        UI_Utiles.activateOnClick(false);
                        UI_Utiles.playerTurnSign(false);
                        UI_Utiles.retireSign(false);
                    }

                    setTimeout(function () { that.nextTurnIncrementPartB(skipNext, turnAgain, activeBotTakiCard); }, 1500);
                    this.waitUntillPartBDone();
                    console.log("Done waiting");

                }
                else { // next turn is a player
                    if (!turnAgain) {
                        PlayersArr[currentPlayerIndex].isTurn = false;
                        UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                        currentPlayerIndex++;
                        if (skipNext) {
                            currentPlayerIndex++;
                        }
                        currentPlayerIndex = currentPlayerIndex % PlayersArr.length;
                        PlayersArr[currentPlayerIndex].isTurn = true;
                    }
                    UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, true, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                    if (!this.checkEndGame()) {
                        UI_Utiles.activateTakeCardButton(true);
                        UI_Utiles.activateOnClick(true);
                        UI_Utiles.playerTurnSign(true);
                        UI_Utiles.retireSign(true);
                    }
                }
            }
        },

        nextTurnIncrementPartB: function (skipNext, turnAgain, activeBotTakiCard) {

            if (!activeBotTakiCard) {

                if (!turnAgain) {
                    PlayersArr[currentPlayerIndex].isTurn = false;
                    UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                    currentPlayerIndex++;
                    if (skipNext) {
                        currentPlayerIndex++;

                    }
                    currentPlayerIndex = currentPlayerIndex % PlayersArr.length;
                    PlayersArr[currentPlayerIndex].isTurn = true;
                    if (PlayersArr[currentPlayerIndex].type === 'player') {
                        console.log("PANIC");
                    }
                    PlayersArr[currentPlayerIndex].data.Turn();
                }
                else {
                    UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, true, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                    PlayersArr[currentPlayerIndex].data.Turn();
                }
                this.checkEndGame();
                if (!this.roundOver) {
                    UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, true, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                }
            }
            else {
                PlayersArr[currentPlayerIndex].data.handleTakiCardCase();

            }
            timeOutDone = true;
        },
        waitUntillPartBDone: function () {
            var that = this;
            console.log("Waiting");
            if (!timeOutDone) {
                setTimeout(function () { this.waitUntillPartBDone; }, 5000);
            }
            else {
                timeOutDone = false;
            }
        },

        checkEndGame: function () {
            if (!this.roundOver) {
                if (PlayersArr[0].data.cardsArrInHand.length === 0) {
                    var turnsForEndStats = this.stats.turns;
                    var lastForEndStats = this.stats.last;
                    var avgTime = Math.floor(this.getStats().avg_time);
                    this.totalSum += (this.getStats().avg_time * this.stats.turns);
                    this.totalAvg = Math.floor(this.totalSum / this.totalTurns);
                    this.initialVariables();
                    UI_Utiles.showWinner(0, turnsForEndStats, lastForEndStats, avgTime, this.totalAvg);
                    this.roundOver = true;
                    return true;
                }
                else if (PlayersArr[1].data.cardsArrInHand.length === 0) {
                    var turnsForEndStats = this.stats.turns;
                    var lastForEndStats = this.stats.last;
                    var avgTime = Math.floor(this.getStats().avg_time);
                    this.totalSum += (this.getStats().avg_time * this.stats.turns);
                    this.totalAvg = Math.floor(this.totalSum / this.totalTurns);
                    this.initialVariables();
                    UI_Utiles.showWinner(1, turnsForEndStats, lastForEndStats, avgTime, this.totalAvg);
                    this.roundOver = true;
                    return true;
                }
            }
            return false;
        },
        initialVariables: function () {
            totalSeconds = 0;
            bestMatchIndex = undefined;
            bestMatch = 0;
            pileCardNumber = undefined;
            pileCardColor = undefined;
            currentBotCardNumber = undefined;
            currentBotCardColor = undefined;
            UserTurn = true;
            takiCardIsActive = false;// takiCardIsActive
            OpenTakiColor = "";
            currentPlayerIndex = 0;
            curTime = 0;
            for (var i = 0; i < PlayersArr.length; i++) {
                PlayersArr[i].data = null;
            }
            PlayersArr = [];
        },
        handleTakiCard: function () { //user putting the firt taki card in his turn
            if (PlayersArr[currentPlayerIndex].isTurn) {
                displayPlayerCardsToScreen();
                takiCardIsActive = true;
            }
        },

        selectColor: function (color) {
            var newCard = 'change_' + color;
            CardContainer.pile[CardContainer.pile.length - 1] = newCard; /// CardCOntainer need to handle the replacement
            UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
            UI_Utiles.colorPickerModalDisplay(false);
            UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
            this.nextTurnIncrement(false, false, false);
        },

        playerDecision: function (index) {
            var card = PlayersArr[currentPlayerIndex].data.cardsArrInHand[index];
            var cardName = card.split("_");
            var newColor = undefined;
            var newCard = undefined;
            var pickColorActive = false;

            if (cardName[0] === 'plus2') {
                this.totalToDraw += 2;
            }

            CardContainer.pile.push(PlayersArr[currentPlayerIndex].data.cardsArrInHand[index]);
            PlayersArr[currentPlayerIndex].data.cardsArrInHand.splice(index, 1);
            if (cardName[1] != 'colorful') {
                UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
            }
            if (cardName[0] === 'taki') {
                newColor = cardName[1];
                takiCardIsActive = true;
                if (newColor === 'colorful') {
                    newColor = CardContainer.pile[CardContainer.pile.length - 2].split("_");
                    newColor = newColor[1];
                    newCard = 'maki_' + newColor;
                    CardContainer.pile[CardContainer.pile.length - 1] = newCard;
                }
                OpenTakiColor = newColor;
                UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                if (gameLogics.isThereNoPosibleStep(takiCardIsActive, PlayersArr[currentPlayerIndex].data.cardsArrInHand)) {
                    takiCardIsActive = false;
                    OpenTakiColor = "";
                }
                if (takiCardIsActive) {
                    UI_Utiles.DisplayCardsTakiCase(currentPlayerIndex, PlayersArr[currentPlayerIndex].data.cardsArrInHand, OpenTakiColor, PlayersArr[currentPlayerIndex].type);
                }
                else {
                    PlayersArr[currentPlayerIndex].isTurn = false;
                    UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                    this.nextTurnIncrement(false, false, false);
                }
            }
            else {
                var toSkipNext = false;
                var turnAgain = false;
                OpenTakiColor = "";
                if (cardName[0] === 'stop') {
                    toSkipNext = true;
                }
                else if (cardName[0] === 'plus') {
                    turnAgain = true;
                }
                else if (cardName[0] === 'change') {
                    pickColorActive = true;
                    UI_Utiles.colorPickerModalDisplay(true);
                }
                UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);

                if (!pickColorActive)
                    this.nextTurnIncrement(toSkipNext, turnAgain, false);
            }
        },

        playerDecisionTakiCase: function (index) { //while there is no more cards that posible to set to pile for the current player.. after it we need to return the display logics as it was before..				
            var card = PlayersArr[currentPlayerIndex].data.cardsArrInHand[index];
            var cardName = card.split("_");
            var thereIsOption;
            var skipNext = false;
            var turnAgain = false;

            CardContainer.pile.push(PlayersArr[currentPlayerIndex].data.cardsArrInHand[index]);
            PlayersArr[currentPlayerIndex].data.cardsArrInHand.splice(index, 1);

            UI_Utiles.DisplayCardsTakiCase(currentPlayerIndex, PlayersArr[currentPlayerIndex].data.cardsArrInHand, OpenTakiColor, PlayersArr[currentPlayerIndex].type);
            UI_Utiles.displayPile(CardContainer.getPileFront().fullName);

            if (gameLogics.isThereNoPosibleStep(takiCardIsActive, PlayersArr[currentPlayerIndex].data.cardsArrInHand)) {
                takiCardIsActive = false;
                if (CardContainer.getPileFront().firstName === 'plus2') {
                    this.totalToDraw += 2;
                }
                else if (CardContainer.getPileFront().firstName === 'stop') {
                    skipNext = true;
                }
                else if (CardContainer.getPileFront().firstName === 'plus') {
                    turnAgain = true;
                }
                this.nextTurnIncrement(skipNext, turnAgain, false);
            }
        },

        GetCardFromDeck: function () {
            if (gameLogics.isThereNoPosibleStep(takiCardIsActive, PlayersArr[currentPlayerIndex].data.cardsArrInHand)) {
                this.totalToDraw = CardContainer.drawCards(this.totalToDraw, PlayersArr[currentPlayerIndex].data);
                UI_Utiles.displayCards(currentPlayerIndex, PlayersArr[currentPlayerIndex].type, PlayersArr[currentPlayerIndex].isTurn, PlayersArr[currentPlayerIndex].data.cardsArrInHand);
                this.nextTurnIncrement(false, false, false);
            }
            else {
                UI_Utiles.alertWrongStep('you can not draw cards when you have an option to put');
            }
        }
    };
}());



