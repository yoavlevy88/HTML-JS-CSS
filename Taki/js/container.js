var CardContainer = (function CardContainer() {
    var cards = ['1', 'plus2', '3', '4', '5', '6', '7', '8', '9', 'taki', 'stop', 'plus'];
    var colors = ['red', 'blue', 'green', 'yellow'];

    return {
        deck: deck = [],
        pile: pile = [],

        passPileToDeck: function () {
            var x = pile.pop();
            var y;
            UI_Utiles.clearPile();
            while (pile.length > 0) {
                y = pile.pop();
                if (y.firstName === 'maki') {
                    y.firstName = 'taki';
                    y.lastName = 'colorful';
                }
                else if (y.firstName === 'change') {
                    y.lastName = 'colorful';
                }
                this.deck.push(y);
            }
            pile.push(x);
            UI_Utiles.displayPile(this.getPileFront().fullName);
        },

        shuffleDeck: function () {
            for (var i = this.deck.length; i-- > 1;) {
                var j = Math.floor(Math.random() * i);
                var tmp = this.deck[i];
                this.deck[i] = this.deck[j];
                this.deck[j] = tmp;
            }
        },

        createDeck: function () {
            var card;
            var cardindex = 0;

            if (this.deck.length > 0) { //case of new round
                this.makeEmptyDeckAndPile();
            }

            for (var i = 0 ; i < cards.length ; i++) {
                for (var j = 0 ; j < colors.length; j++) {
                    var cardToPush = cards[i] + '_' + colors[j];
                    this.deck.push(cardToPush);
                    this.deck.push(cardToPush);
                }
            }
            for (var i = 0; i < 2 ; i++) {
                this.deck.push('taki_colorful');
            }
            for (var i = 0; i < 4 ; i++) {
                this.deck.push('change_colorful');
            }
            this.shuffleDeck();
        },

        makeEmptyDeckAndPile: function () {
            while (this.deck.length > 0) {
                this.deck.pop();
            }
            while (this.pile.length > 0) {
                this.pile.pop();
            }
            UI_Utiles.clearPile();
        },

        printPileToLog: function () {
            for (var i = 0; i < this.pile.length ; i++) {
                console.log("card: ", this.pile[i]);
            }
        },

        printDeckToLog: function () {
            for (var i = 0; i < this.deck.length ; i++) {
                console.log("card: ", this.deck[i]);
            }
        },

        getPileFront: function () {
            var fullName = pile[pile.length - 1];
            var seperatedName = fullName.split("_");
            return { fullName: fullName, firstName: seperatedName[0], lastName: seperatedName[1] };
        },

        drawCards: function (i_totalToDraw, io_player) {

            if (i_totalToDraw === 0) {
                i_totalToDraw = 1;
            }
            for (var i = 0; i < i_totalToDraw; i++) {
                if (this.deck.length === 0) {
                    this.passPileToDeck();
                    this.shuffleDeck();
                }
                io_player.cardsArrInHand.push(this.deck.pop());
            }
            return 0;
        },

        drawFirstPileCard: function () {
            for (var i = 0; i < this.deck.length ; i++) {
                if (this.deck[i].charAt(0) <= '9') {
                    var tempToSwap;
                    tempToSwap = this.deck[this.deck.length - 1];
                    this.deck[this.deck.length - 1] = this.deck[i];
                    this.deck[i] = tempToSwap;
                    pile.push(this.deck.pop());
                    break;
                }
            }
            return this.getPileFront();
        }
    };
}());