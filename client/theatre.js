import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { DateTime, Settings } from 'luxon';

import './theatre.html';

global.columns = [];

let idealI, idealJ;

function available(nr, i, j) {
    if (nr == 0) return true;
    if (i >= global.columns.length) return false;
    if (global.columns[i].seats[j].removed) return false;
    if (global.columns[i].seats[j].reserved) return false;
    if (global.columns[i].seats[j].sold) return false;
    if (global.columns[i].seats[j].pending) return false;
    return available(nr - 1, i + 1, j);
}

function reserve(nr, i, j) {
    for (let ip = i; ip < i + nr; ++ip) {
        global.columns[ip].seats[j].pending = true;
    }
}

function findBestSpot(nr) {
    let cols = global.columns.length;
    let rows = global.columns[0].seats.length;
    let best = 1000;
    let bestI = -1, bestJ = -1;
    console.log('find best',cols,rows);
    for (let i = 0; i < cols; ++i) {
        for (j = 0; j < rows; ++j) {
            if (available(nr, i, j)) {
                console.log('available',nr,i,j);
                let charge = global.columns[i].seats[j].distance;
                if (global.columns[i].seats[j].weight == 'premium') charge -= 10;
                if (global.columns[i].seats[j].weight == 'medium') charge -= 5;
                if (charge < best) {
                    console.log('better',charge,i,j);
                    best = charge;
                    bestI = i;
                    bestJ = j;
                }
            }
            else continue;
        }
    }
    return {startI:bestI,startJ:bestJ};
}

function trySell(nr, i, j) {
    let startI, startJ;
    if (!(typeof (i) == 'number')) {
        ({ startI, startJ } = findBestSpot(nr));
        if (startI == -1) {
            alert('Not possible to find free spaces');
            return;
        }
        else console.log('best found',startI,startJ);
    }
    else {
        startI = i;
        startJ = j;
        if (!available(nr, i, j)) {
            alert('Not enough free spaces');
            return;
        }
    }
    reserve(nr, startI, startJ);
    return true;
}

Template.theatre.onCreated(function theatreOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
    console.log('theatre created', this.data);
    let rowIndex = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    let mid;
    let odd = this.data.columns % 2;
    if (odd) { // odd
        mid = [Math.floor(this.data.columns / 2)];
    }
    else { // even
        mid = [Math.floor(this.data.columns / 2), Math.floor(this.data.columns / 2 - 1)];
    }
    let rotDivisor = Math.ceil(this.data.columns / 16);
    idealI = Math.floor(this.data.columns / 2);
    idealJ = Math.floor(this.data.rows * 2 / 3);
    for (let i = 0; i < this.data.columns; ++i) {
        global.columns.push({});
        global.columns[i].columnIndex = i;
        if (mid.includes(i)) { // middle column(s)
            global.columns[i].leftrightClass = 'middle';
            global.columns[i].columnClass = '';
        }
        else if (i > mid[0]) { // right
            global.columns[i].leftrightClass = 'right';
            let columnClassIndex = i - Math.floor(this.data.columns / 2) + rotDivisor - 1;
            global.columns[i].columnClass = `column-${Math.floor(columnClassIndex / rotDivisor)}`;
        }
        else { // left
            global.columns[i].leftrightClass = 'left';
            let columnClassIndex = Math.floor(this.data.columns / 2) - i + rotDivisor - (odd ? 1 : 2);
            global.columns[i].columnClass = `column-${Math.floor(columnClassIndex / rotDivisor)}`;
        }
        global.columns[i].columnJump = false;
        if (i && (global.columns[i - 1].columnClass != global.columns[i].columnClass)) global.columns[i - 1].columnJump = true;
        global.columns[i].seats = [];
        for (let j = 0; j < this.data.rows; ++j) {
            global.columns[i].seats.push({});
            global.columns[i].seats[j].index = `${rowIndex[this.data.rows - j - 1]}-${i + 1}`;
            global.columns[i].seats[j].removed = false;
            global.columns[i].seats[j].weight = 'standard';
            global.columns[i].seats[j].reserved = false;
            global.columns[i].seats[j].sold = false;
            global.columns[i].seats[j].pending = false;
            global.columns[i].seats[j].distance = Math.floor(Math.sqrt(Math.pow(i - idealI, 2) + Math.pow(j - idealJ, 2)));
            global.columns[i].seats[j].i = i;
            global.columns[i].seats[j].j = j;
        }
    }
    idealI = Math.floor(this.data.columns / 2);
    idealJ = Math.floor(this.data.rows * 2 / 3);
    Session.set('mode', 'design');
    Session.set('modified', false);
});

Template.theatre.helpers({
    columns() {
        if (Session.get('modified')) Session.set('modified', false);
        return global.columns;
    },
    weightMode() {
        return Session.get('mode') == 'weight';
    },
    sellMode() {
        return Session.get('mode') == 'sell';
    }
});

Template.theatre.events({
    'click #design'(event, instance) {
        Session.set('mode', 'design');
        Session.set('modified', true);
    },
    'click #weight'(event, instance) {
        Session.set('mode', 'weight');
        Session.set('modified', true);
    },
    'click #standard'(event, instance) {
        Session.set('weight', 'standard');
        // Session.set('modified', true);
    },
    'click #medium'(event, instance) {
        Session.set('weight', 'medium');
        // Session.set('modified', true);
    },
    'click #premium'(event, instance) {
        Session.set('weight', 'premium');
        // Session.set('modified', true);
    },
    'click #reserve'(event, instance) {
        Session.set('mode', 'reserve');
        Session.set('modified', true);
    },
    'click #sell'(event, instance) {
        Session.set('mode', 'sell');
        Session.set('modified', true);
    },
    'click #sell1'(event, instance) {
        trySell(1);
        Session.set('modified', true);
    },
    'click #sell2'(event, instance) {
        trySell(2);
        Session.set('modified', true);
    },
    'click #sell3'(event, instance) {
        trySell(3);
        Session.set('modified', true);
    },
})

Template.columnseats.onCreated(function columnseatsOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
    console.log('row created', this.data);
});

Template.columnseats.helpers({
    columnSeats() {
        return this.seats;
    }
});

Template.seatRep.onCreated(function seatRepOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
    // console.log('seat created', this.data.index);
});

Template.seatRep.helpers({
    seatClass() {
        switch (Session.get('mode')) {
            case 'design':
                if (this.removed) return 'removed';
                break;
            case 'weight':
                if (this.removed) return 'removedInvisible';
                switch (this.weight) {
                    case 'standard':
                        return ''
                        break;
                    case 'medium':
                        return 'medium'
                        break;
                    case 'premium':
                        return 'premium'
                        break;
                }
                break;
            case 'reserve':
                if (this.removed) return 'removedInvisible';
                switch (this.weight) {
                    case 'standard':
                        if (this.reserved) return 'reserved'
                        return ''
                        break;
                    case 'medium':
                        if (this.reserved) return 'reserved'
                        return 'medium'
                        break;
                    case 'premium':
                        if (this.reserved) return 'reserved'
                        return 'premium'
                        break;
                }
                break;
            case 'sell':
                if (this.removed) return 'removedInvisible';
                if (this.reserved || this.sold) return 'sold';
                if (this.pending) return 'pending';
                break;
        }
    }
})

Template.seatRep.events({
    'click .seat'(event, instance) {
        console.log(`seat ${instance.data.index}`, instance.data.distance, instance.data)
        // $(event.target).toggleClass('active');
        switch (Session.get('mode')) {
            case 'design':
                global.columns[instance.data.i].seats[instance.data.j].removed = !instance.data.removed;
                break;
            case 'weight':
                global.columns[instance.data.i].seats[instance.data.j].weight = Session.get('weight');
                break;
            case 'reserve':
                global.columns[instance.data.i].seats[instance.data.j].reserved = !instance.data.reserved;
                break;
            case 'sell':
                if (!(instance.data.sold || instance.data.reserved)) trySell(2,instance.data.i, instance.data.j);
                else alert('Try free position')
                break;
        }
        Session.set('modified', true);
    }
});