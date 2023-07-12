// import axios from 'axios';
// import jBox from 'jBox';

function rollDice(num){
    return Math.floor(Math.random() * num) + 1;
}

export function rollD20(){
    return rollDice(20);
}

export function rollD15(){
    return rollDice(15);
}

export function rollD12(){
    return rollDice(12);
}

export function rollD10(){
    return rollDice(10);
}

export function rollD8(){
    return rollDice(8);
}

export function rollD6(){
    return rollDice(6);
}

export function rollD4(){
    return rollDice(4);
}

export function roll(dNum){
    return rollDice(dNum);
}

export function parseDiceString(str){
    /* Example dice string: 17d12+85 */
    /* Rex for (?<amount>\d+)?d(<dice>\d+) */
    var diceObj = {}, staticObj = {};
    try {
        var diceObj = /(?<amount>\d+)?d(?<dice>\d+)/.exec(str).groups
    } catch(err){
    }
    try {
        var staticObj =  /[+-](?<static>\d+)(?!d\d+)/.exec(str).groups 
    } catch(err){
    }

    var parsedStr = [];
    if (diceObj){
        parsedStr.push(diceObj);
    }
    if (staticObj){
        parsedStr.push(staticObj);
    }
    return parsedStr;
}

export function sumDiceString(str){
    var diceObj = parseDiceString(str);
    var sum = sumDiceObj(diceObj);
    return sum;
}

export function sumDiceObj(obj){
    var sum = 0;
    var rolls = [];
    console.log("sumDiceObj", obj);
    for(var d = 0; d < obj.length; d++){
        if(obj[d]['dice']){
            try {
                var amount = parseInt(obj[d]['amount']);
            } catch(err){
                amount = 1;
            }
            for(var i = 0; i < amount; i++){
                var r = rollDice(obj[d]['dice']);
                sum += r;
                rolls.push(r);
            }
        } else if (obj[d]['static']){
            sum += parseInt(obj[d]['static']);
        }
    }
    console.log(sum);
    return [sum, rolls];
}