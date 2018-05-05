var UI_Utiles = (function () {
    return {
        renderStats: function () {
            let pstats = Round.getStats();
            document.getElementById('num_turns').innerHTML = pstats['num_turns'];
            document.getElementById('last_one').innerHTML = pstats['last_one'];
            this.activateAvgTime(pstats['avg_time']);
        },

        makeGameVisible: function () {
            document.getElementById("openingPage").style.display = "none";
            document.getElementById("gameScreen").style.display = "block";
        },

        createPlayersElements: function () { // our ui suppors only 2 players for now.
            for (var i = 0; i < PlayersNumber ; i++) {
                var newPlayerElement = document.createElement("DIV");
                newPlayerElement.id = 'Player_' + String(i);
                document.getElementById("gameScreen").appendChild(newPlayerElement);
            }
            for (var i = PlayersNumber; i < BotNumber + PlayersNumber; i++) {
                var newPlayerElement = document.createElement("DIV");
                newPlayerElement.id = 'Player_' + String(i);
                document.getElementById("gameScreen").appendChild(newPlayerElement);
            }
        },

        clearPile: function () {
            document.getElementById("pile").innerHTML = "";
        },

        deletePlayersElements: function () {
            var parent = document.getElementById("gameScreen");
            for (var i = 0; i < BotNumber + PlayersNumber; i++) {
                var child = document.getElementById('Player_' + String(i));
                parent.removeChild(child);
            }
        },

        displayCards: function (PlayerIndex, type, isTurn, CardsArr) {

            var PlayerElement = document.getElementById('Player_' + String(PlayerIndex));
            PlayerElement.innerHTML = "";

            var calcdegree = (CardsArr.length / 2) * 3;

            for (var i = 0; i < CardsArr.length; i++) {
                var card = document.createElement("IMG");
                card.setAttribute("index", String(i));

                if (isTurn && gameLogics.isPosibleStep(CardsArr[i])) {
                    card.addEventListener("click", function () { UI_Utiles.extractPlayerCardIndex(event) });
                    card.className = "playerHoverCards";
                }
                else {
                    card.onclick = "";
                    card.className = "playerCards";
                }


                if (type === 'player') {
                    card.style.transform = 'rotate(' + String(-(calcdegree)) + 'deg)';
                    card.src = './css/assets/' + String(CardsArr[i]) + '.png';


                }
                else {
                    card.src = './css/assets/card_back.png'
                    card.style.transform = 'rotate(' + String((calcdegree)) + 'deg)';
                }

                calcdegree = calcdegree - 3;
                PlayerElement.appendChild(card);
            }
        },
        extractPlayerCardIndex: function (ev) {
            var index = ev.target.getAttribute('index');
            Round.playerDecision(index);

        },
        extractPlayerCardTakiCaseIndex: function (ev) {
            var index = ev.target.getAttribute('index');
            Round.playerDecisionTakiCase(index);

        },


        displayPile: function (pileFront) {
            var string = "";
            var string = document.getElementById("pile").innerHTML;
            var rotation = Math.floor(Math.random() * -30) + 40;
            string += '<img class="pileCards" src="./css/assets/' + pileFront + '.png"' + 'style="transform: rotate(' + String(rotation) + 'deg);">';
            document.getElementById("pile").innerHTML = string;
        },

        DisplayCardsTakiCase: function (PlayerIndex, CardsArr, OpenTakiColor, type) {
            var playerElement = document.getElementById('Player_' + String(PlayerIndex));
            var calcdegree = (CardsArr.length / 2) * 3;

            playerElement.innerHTML = "";

            for (var i = 0 ; i < CardsArr.length ; i++) {
                var card = document.createElement("IMG");
                card.setAttribute("index", String(i));

                if (gameLogics.isPosibleStepTakiCase(CardsArr[i], OpenTakiColor) && type === 'player') {
                    card.addEventListener("click", function () { UI_Utiles.extractPlayerCardTakiCaseIndex(event) });
                    card.className = "playerHoverCards";
                }
                else {
                    card.onclick = "";
                    card.className = "playerCards";
                }

                if (type === 'player') {
                    card.style.transform = 'rotate(' + String(-(calcdegree)) + 'deg)';
                    card.src = './css/assets/' + String(CardsArr[i]) + '.png';
                }
                else {
                    card.src = './css/assets/card_back.png';
                    card.style.transform = 'rotate(' + String((calcdegree)) + 'deg)';
                }
                calcdegree = calcdegree - 3;
                playerElement.appendChild(card);
            }
        },

        alertWrongStep: function (i_alertStr) {
            alert(i_alertStr);
        },

        activateOnClick: function (i_toActivate) {
            if (i_toActivate)
                document.getElementById('gameScreen').style.pointerEvents = 'auto';
            else
                document.getElementById('gameScreen').style.pointerEvents = 'none';
        },

        activateTakeCardButton: function (i_toActivate) {
            if (i_toActivate)
                document.getElementById('takeCard_button').style.display = 'block';
            else
                document.getElementById('takeCard_button').style.display = 'none';
        },

        activateTime: function (time) {
            document.getElementById("timer").innerHTML = time.hour + ":" + time.minute + ":" + time.seconds;
        },

        activateAvgTime: function (time) {
            var partTime = { hour: 0, minute: 0, seconds: 0 };
            time = Math.floor(time);
            partTime.hour = Math.floor(time / 3600);
            partTime.minute = Math.floor((time - partTime.hour * 3600) / 60);
            partTime.seconds = time - (partTime.hour * 3600 + partTime.minute * 60);
            document.getElementById("avg_time").innerHTML = partTime.hour + ":" + partTime.minute + ":" + partTime.seconds;
        },

        showWinner: function (index, turnsForEndStats, lastForEndStats, avgTime, totalAvg) {
            document.getElementById("gameScreen").style.display = "none";
            document.getElementById("endGame").style.display = "block";
            switch (index) {
                case 0:
                    document.getElementById('WINNER_imeg').style.display = 'block';
                    break;
                case 1:
                    document.getElementById('LOSER_imeg').style.display = 'block';
                    break;
            }
            document.getElementById("Round_num_turns").innerHTML = turnsForEndStats;
            document.getElementById("Round_last_one").innerHTML = lastForEndStats;
            document.getElementById("Round_avg_time").innerHTML = avgTime;
            document.getElementById("Round_all_avg_time").innerHTML = totalAvg;
        },

        startNewRound: function () {
            document.getElementById("endGame").style.display = "none";
            document.getElementById('WINNER_imeg').style.display = 'none';
            document.getElementById('LOSER_imeg').style.display = 'none';
            this.clearStats();
        },

        clearStats: function () {
            Round.reset();
            document.getElementById("num_turns").innerHTML = 0;
            document.getElementById("timer").innerHTML = 0;
            document.getElementById("avg_time").innerHTML = 0;
            document.getElementById("last_one").innerHTML = 0;
            clearInterval(Round.interval);
        },

        colorPickerModalDisplay: function (isVisible) {
            var displayMode = (isVisible === true) ? "block" : "none";
            var webContentMode = (isVisible === true) ? 'none' : 'auto';

            document.getElementById('gameScreen').style.pointerEvents = webContentMode;
            document.getElementById('pickColorModal').style.display = displayMode;
        },

        playerTurnSign(isVisible) {
            var displayMode = (isVisible === true) ? "block" : "none";
            document.getElementById('PlayerTurn').style.display = displayMode;
        },

        retireSign(isVisible) {
            var displayMode = (isVisible === true) ? "block" : "none";
            document.getElementById('retireButton').style.display = displayMode;
        }

    };
}());