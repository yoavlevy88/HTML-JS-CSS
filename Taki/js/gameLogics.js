var gameLogics = (function () {

    return {
        isPosibleStep: function (i_cardName) {
            var pileCard = CardContainer.getPileFront();
            var CardSeperatedName = i_cardName.split("_");
            var pileFirstName = pileCard.firstName;
            if (pileFirstName === 'maki') {
                pileFirstName = 'taki';
            }

            if (pileFirstName === 'plus2' && Round.totalToDraw != 0) {
                if (CardSeperatedName[0] === 'plus2') {
                    return true;
                }
                else {
                    return false;
                }
            }

            else {
                if (CardSeperatedName[0] === pileFirstName || CardSeperatedName[1] === pileCard.lastName || CardSeperatedName[1] === "colorful") {
                    return true;
                }
                else {
                    return false;
                }
            }
        },

        isPosibleStepTakiCase: function (i_cardName, OpenTakiColor) {
            var cardName = i_cardName.split("_");

            if (cardName[1] === OpenTakiColor) {
                return true;
            }
            else {
                return false;
            }
        },

        isThereNoPosibleStep: function (isTakiCardActive, i_cardsInHandArr) {

            var res = true;
            var pileCard = CardContainer.getPileFront();

            if (isTakiCardActive) {
                for (var i = 0 ; (i < i_cardsInHandArr.length) && res; i++) {
                    res = !this.isPosibleStepTakiCase(i_cardsInHandArr[i], pileCard.lastName)
                }
            }

            else {
                for (var i = 0 ; (i < i_cardsInHandArr.length) && res; i++) {
                    res = !this.isPosibleStep(i_cardsInHandArr[i]);
                }
            }
            return res;
        }
    };
}());
