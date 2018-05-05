var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bot = function () {
    function Bot(i_cardsInHandsArr, i_playerIndex) {
        _classCallCheck(this, Bot);

        this.cardsArrInHand = i_cardsInHandsArr;
        this.playerIndex = i_playerIndex;
        this.doneSetTimeOut = false;
        this.changeColorName = undefined;
        this.cardsTiThrow = [];
    }
    _createClass(Bot, [{
        key: "Turn",
        value: function Turn() {
            Round.UserTurn = false;
            var cardsIndexesToThrow = [];
            var skipNext = false;
            var turnAgain = false;
            var pileCard = CardContainer.getPileFront();
            var currentBotCardNumber;
            var currentBotCardColor;
            var Match = { bestMatchIndex: undefined, bestMatch: 0 };
            var firstNamePileCard = pileCard.firstName;

            if (pileCard.firstName === 'maki') {
                firstNamePileCard = 'taki';
            }

            if (firstNamePileCard === 'plus2' && Round.totalToDraw != 0) {
                //case of pile card is plus2	
                for (var i = 0; i < this.cardsArrInHand.length; i++) {
                    currentBotCardNumber = this.cardsArrInHand[i].split("_")[0];
                    currentBotCardColor = this.cardsArrInHand[i].split("_")[1];

                    if (currentBotCardNumber === 'plus2') {
                        CardContainer.pile.push(this.cardsArrInHand[i]);
                        this.cardsArrInHand.splice(i, 1);
                        Round.totalToDraw += 2;
                        Match.bestMatch = 8;
                        Match.bestMatchIndex = i;
                        UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                        break;
                    }
                }
            }
            else //there is no active plus2 card on pile top	
            {
                this.getTheBestmatch(Match);

                if (Match.bestMatch != 0) {
                    if (Match.bestMatch != 7 && Match.bestMatch != 4) {
                        CardContainer.pile.push(this.cardsArrInHand[Match.bestMatchIndex]);
                        this.cardsArrInHand.splice(Match.bestMatchIndex, 1);
                        UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                    }
                    else {
                        this.cardsArrInHand.splice(Match.bestMatchIndex, 1);
                    }
                }
            }

            switch (Match.bestMatch) {
                case 0:
                    Round.totalToDraw = CardContainer.drawCards(Round.totalToDraw, this);
                    Round.nextTurnIncrement(skipNext, turnAgain, false);
                    break;
                case 3:
                    UI_Utiles.displayCards(this.playerIndex, 'bot', true, this.cardsArrInHand);
                    if (!gameLogics.isThereNoPosibleStep(true, this.cardsArrInHand)) {
                        Round.nextTurnIncrement(skipNext, turnAgain, true);
                    }
                    else {
                        Round.nextTurnIncrement(skipNext, turnAgain, false);
                    }
                    //	this.handleTakiCardCase();

                    break;
                case 4:
                    UI_Utiles.displayCards(this.playerIndex, 'bot', true, this.cardsArrInHand);
                    var makiCardToReplace;
                    var lastColor = CardContainer.pile[CardContainer.pile.length - 1].split("_");
                    lastColor = lastColor[1];
                    makiCardToReplace = 'maki_' + lastColor;
                    CardContainer.pile.push(makiCardToReplace);
                    UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                    if (!gameLogics.isThereNoPosibleStep(true, this.cardsArrInHand)) {
                        Round.nextTurnIncrement(skipNext, turnAgain, true);
                    }
                    else {
                        Round.nextTurnIncrement(skipNext, turnAgain, false);
                    }

                    //	this.handleTakiCardCase();

                    break;
                case 5:
                    turnAgain = true;
                    Round.nextTurnIncrement(skipNext, turnAgain, false);
                    break;
                case 6:
                    skipNext = true;
                    Round.nextTurnIncrement(skipNext, turnAgain, false);
                    break;
                case 7:
                    this.getMostAttractiveColor();
                    CardContainer.pile.push(this.changeColorName);
                    UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                    Round.nextTurnIncrement(skipNext, turnAgain, false);
                    break;
                default:
                    Round.nextTurnIncrement(skipNext, turnAgain, false);
            }
        }
    }, {
        key: "getTheBestmatch",
        value: function getTheBestmatch(Match) {
            var currentBotCardNumber;
            var currentBotCardColor;
            var pileCard = CardContainer.getPileFront();
            var fullCardName;
            var firstNamePileCard = pileCard.firstName;

            console.log("pileCard: ", pileCard.fullName);
            if (pileCard.firstName === 'maki') {
                firstNamePileCard = 'taki';
            }

            for (var i = 0; i < this.cardsArrInHand.length; i++) {
                fullCardName = this.cardsArrInHand[i].split("_");
                currentBotCardNumber = fullCardName[0];
                currentBotCardColor = fullCardName[1];

                if (currentBotCardNumber === 'plus2' && currentBotCardColor === pileCard.lastName || currentBotCardNumber === firstNamePileCard && currentBotCardNumber === 'plus2') {
                    Match.bestMatchIndex = i;
                    Round.totalToDraw += 2;
                    Match.bestMatch = 8;
                    break;
                }

                if (currentBotCardNumber === 'change' && currentBotCardColor === 'colorful') {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 7;
                }

                if (Match.bestMatch < 7 && currentBotCardNumber === 'stop' && (firstNamePileCard === 'stop' || currentBotCardColor === pileCard.lastName)) {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 6;
                }

                if (Match.bestMatch < 6 && currentBotCardNumber === 'plus' && (firstNamePileCard === 'plus' || currentBotCardColor === pileCard.lastName)) {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 5;
                }

                if (Match.bestMatch < 5 && currentBotCardNumber === 'taki' && currentBotCardColor === 'colorful') {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 4;
                }

                if (Match.bestMatch < 4 && currentBotCardNumber === 'taki' && (firstNamePileCard === 'taki' || currentBotCardColor === pileCard.lastName)) {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 3;
                }

                if (Match.bestMatch < 3 && currentBotCardColor === pileCard.lastName) {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 2;
                }

                if (Match.bestMatch < 2 && currentBotCardNumber === firstNamePileCard) {
                    Match.bestMatchIndex = i;
                    Match.bestMatch = 1;
                }
            }
        }
    }, {
        key: "getMostAttractiveColor",
        value: function getMostAttractiveColor() {
            var counter = { red: { count: 0, name: 'red' }, blue: { count: 0, name: 'blue' }, green: { count: 0, name: 'green' }, yellow: { count: 0, name: 'yellow' } };
            var bestColor;
            for (var i = 0; i < this.cardsArrInHand.length; i++) {
                var cardName = this.cardsArrInHand[i].split("_");
                var cardColor = cardName[1];
                var cardType = cardName[0];

                if (cardColor != 'colorful') {
                    switch (cardColor) {
                        case 'red':
                            counter.red.count++;
                            break;
                        case 'blue':
                            counter.blue.count++;
                            break;
                        case 'green':
                            counter.green.count++;
                            break;
                        case 'yellow':
                            counter.yellow.count++;
                            break;
                    }

                    switch (cardType) {
                        case 'plus2':
                            counter[cardColor].count += 4;
                            break;
                        case 'taki':
                            counter[cardColor].count += 3;
                            break;
                        case 'plus':
                            counter[cardColor].count += 2;
                            break;
                        case 'stop':
                            counter[cardColor].count += 1;
                            break;
                    }
                }
            }
            bestColor = (counter.red.count >= counter.blue.count) ? counter.red : counter.blue;
            bestColor = (bestColor.count >= counter.green.count) ? bestColor : counter.green;
            bestColor = (bestColor.count >= counter.yellow.count) ? bestColor : counter.yellow;
            bestColor = bestColor.name;
            this.changeColorName = 'change_' + bestColor;
        }
    }, {
        key: "throwCard",
        value: function throwCard(i_cardsIndexesToThrow) {
            var cardIndex = i_cardsIndexesToThrow.pop();
            CardContainer.pile.push(this.cardsArrInHand[cardIndex]);
            this.cardsArrInHand.splice(cardIndex, 1);
            UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
            UI_Utiles.displayCards(this.playerIndex, 'bot', true, this.cardsArrInHand);
        }
    }, {
        key: "handleTakiCardCase",
        value: function handleTakiCardCase() {
            var skipNext = false;
            var turnAgain = false;
            var found = false;

            if (!gameLogics.isThereNoPosibleStep(true, this.cardsArrInHand)) {
                for (var i = 0; i < (this.cardsArrInHand.length) && (!found) ; i++) {
                    if (gameLogics.isPosibleStepTakiCase(this.cardsArrInHand[i], CardContainer.getPileFront().lastName)) {
                        var cardIndex = i;
                        CardContainer.pile.push(this.cardsArrInHand[cardIndex]);
                        this.cardsArrInHand.splice(cardIndex, 1);
                        UI_Utiles.displayPile(CardContainer.getPileFront().fullName);
                        UI_Utiles.displayCards(this.playerIndex, 'bot', true, this.cardsArrInHand);
                        found = true;
                        if (!gameLogics.isThereNoPosibleStep(true, this.cardsArrInHand)) {
                            Round.nextTurnIncrement(skipNext, turnAgain, true);
                        }
                        else {
                            if (CardContainer.getPileFront().firstName === 'stop') {
                                skipNext = true;
                            }
                            else if (CardContainer.getPileFront().firstName === 'plus') {
                                turnAgain = true;
                            }
                            else if (CardContainer.getPileFront().firstName === 'plus2') {
                                Round.totalToDraw += 2;
                            }
                            Round.nextTurnIncrement(skipNext, turnAgain, false);
                        }
                    }
                }
            }
        }
    }
    ]);
    return Bot;
}();