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
const direction = require('../sample/direction.js');
function getNearBy (target, hero) {
    const closest = target.reduce((a, b) => distance(a, hero) < distance(b, hero) ? a : b);
    const x = closest.x - hero.x, y = closest.y - hero.y;
    console.log("closvest", closest.x, hero.x, closest.y, hero.y)
    // return {x, y};
    return {x, y};
}
function distance(point, p) {
    return Math.sqrt(Math.pow(point.x - p.x, 2) + Math.pow(point.y - p.y, 2))
}
function goTo(point, direction, moveXFirst = true) {
    if(moveXFirst){
        if(point.x > 0){
            return direction.RIGHT;
        } 
        if(point.x < 0){
            return direction.LEFT;
        }
    }
    if(point.y > 0){
        return direction.UP;
    } 
    if(point.y < 0){
        return direction.DOWN;
    }
    return direction.ACT;
}
function moveFrom(point, direction, moveXFirst = true) {
    if(moveXFirst){
        if(point.x < 0){
            return direction.RIGHT;
        } 
        if(point.x > 0){
            return direction.LEFT;
        }
    }
    if(point.y < 0){
        return direction.UP;
    } 
    if(point.y > 0){
        return direction.DOWN;
    }
    return direction.ACT;
}
function getHeroNextPoint (hero, move, direction) {
    switch(move){
        case direction.LEFT:
           return {x: hero.x - 1, y: hero.y};
        case direction.RIGHT:
            return {x: hero.x + 1, y: hero.y};
        case direction.TOP:
            return {x: hero.x, y: hero.y - 1};
        case direction.DOWN:
            return {x: hero.x, y: hero.y + 1};
        default:
            return hero;
    }
} 
function isInBlastZone(target, hero) {
    return target.find(a => a.x === hero.x && a.y === hero.y);
}
let lastPos = [], posCount = 0, timer = 0, lastVertical;
function hasObstacleHorizontal(hero, direction, isBarrierAt) {
    // console.log("LEFT", !isBarrierAt(hero.x-1, hero.y))
    if(!isBarrierAt(hero.x-1, hero.y)){
        return direction.LEFT;
    }
    // console.log("RIGHT", !isBarrierAt(hero.x+1, hero.y))
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
var MollymageSolver = module.exports = {
    get: function (board) {
        /**
         * @return next hero action
         * 
         */
        var Games = require('./../../engine/games.js');
        var Point = require('./../../engine/point.js');
        var Direction = Games.require('./direction.js');
        var Element = Games.require('./elements.js');
        var Stuff = require('./../../engine/stuff.js');

        
        // TODO your code here
        // console.log(lastPos, "lastPos")
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
        const futureBlasts = board.getFutureBlasts();
        let nextDir = Direction.ACT;
        lastPos = ['ACT'];
        posCount = 0;
        return nextDir;
    }
};