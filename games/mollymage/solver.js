/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2012 - 2022 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */

let lastPos = [], posCount = 0, timer = 0;
function hasObstacleHorizontal(hero, direction, isBarrierAt) {
    if(!isBarrierAt(hero.x-1, hero.y)){
        return direction.LEFT;
    }
    if(!isBarrierAt(hero.x+1, hero.y)){
        return direction.RIGHT;
    }
    return hasObstacleVertical(hero, direction, isBarrierAt);
}

function hasObstacleVertical(hero, direction, isBarrierAt, isFutureBarrierAt) {
    if(!isBarrierAt(hero.x, hero.y-1)){
        return direction.DOWN;
    }
    if(!isBarrierAt(hero.x, hero.y+1)){
        return direction.UP;
    }
    return hasObstacleHorizontal(hero, direction, isBarrierAt, isFutureBarrierAt);
}

var extendBoard = (function(board, Point){
    board.isBarrierAt = function(x, y) {
        if (new Point(x, y).isOutOf(board.size)) {
            return true;
        }

        return board.contains(board.getBarriers(), new Point(x, y));
    };
    board.getMyBarriers = function() {
        var all = board.getGhosts();
        all = all.concat(board.getWalls());
        all = all.concat(board.getTreasureBoxes());
        all = all.concat(board.getOtherHeroes());
        return board.removeDuplicates(all);
    };
    board.isMyBarrierAt = function(x, y) {
        if (new Point(x, y).isOutOf(board.size)) {
            return true;
        }

        return board.contains(board.getMyBarriers(), new Point(x, y));
    };
    return board;
})
var MollymageSolver = module.exports = {

get: function (board) {
    /**
     * @return next hero action
     */
   
    var Games = require('./../../engine/games.js');
    var Point = require('./../../engine/point.js');
    var Direction = Games.require('./direction.js');
    var Element = Games.require('./elements.js');
    var Stuff = require('./../../engine/stuff.js');
    board = extendBoard(board, Point);

    const myHero = board.getHero();
    if(timer >= 5) {
        timer = 0;
    }
    timer += 1;
    if(lastPos[0] == "ACT" && posCount <= 2 && timer <= 3){
        posCount += 1;
        if(posCount === 1){
            return hasObstacleHorizontal(myHero, Direction, board.isMyBarrierAt);
        }
        lastPos = [];
        posCount = 0;
        return hasObstacleVertical(myHero, Direction, board.isMyBarrierAt);
    }
    let nextDir = Direction.ACT;
    lastPos = ['ACT'];
    posCount = 0;
    return nextDir;
}
};
