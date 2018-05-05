System Explanation:
The Round manages a game of human player matches in front of a computer by running on the players array created in the first process (index.js), thus logically supporting a non-permanent number of players.

At the end of each card placement, the nextTurnIncrement function of Round will be called.
In case the player's current type is a human player, his cards with the onclick option will be used for calling cards, and gamelogics will check whether the card is valid for placement and turns the design department of those cards into playerHoverCards. Otherwise, cards will be playerCards.
At the end of the player's turn, we call the next RoundTurnIncrement of Round to display its cards again only this time with an end-of-queue argument, as this time the elements will be with the playerCards design class and without onclick events.