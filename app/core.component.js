/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Yongsheng Li
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
System.register(['angular2/core', './go.service'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, go_service_1;
    var CoreComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            }],
        execute: function() {
            CoreComponent = (function () {
                function CoreComponent(goService) {
                    this.goService = goService;
                    this.dim = 19; // dimension
                    this.grid = this.createGrid(19); // grid for stones
                    this.sequence = this.createGrid(19); // sequence number
                    this.handicaps = 0; // handicaps
                    this.mode = 0; // 1: play; 2: record; 3: testPlay
                    this.steps = 0; // step count
                    this.turn = 0; // 1: black; -1: white
                    this.history = []; // move history
                    this.testHistory = []; // move history for test play
                    this.black = ""; // TODO
                    this.white = ""; // TODO
                }
                CoreComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.configSubscription = this.goService.config2core$.subscribe(function (data) {
                        console.log("config2core data: " + JSON.stringify(data));
                        _this.processData(data);
                    });
                    this.boardSubscription = this.goService.control2core$.subscribe(function (data) {
                        console.log("control2core data: " + JSON.stringify(data));
                        _this.processData(data);
                    });
                    this.boardSubscription = this.goService.board2core$.subscribe(function (data) {
                        console.log("board2core data: " + JSON.stringify(data));
                        _this.processData(data);
                    });
                };
                CoreComponent.prototype.ngOnDestroy = function () {
                    this.configSubscription.unsubscribe();
                    this.controlSubscription.unsubscribe();
                    this.boardSubscription.unsubscribe();
                };
                /**
                 * Rest core to default.
                 */
                CoreComponent.prototype.resetCore = function () {
                    this.mode = 0;
                    this.black = "";
                    this.white = "";
                    this.steps = 0;
                    this.handicaps = 0;
                    this.turn = 0;
                    this.history = [];
                    this.grid = this.createGrid(this.dim);
                    this.sequence = this.createGrid(this.dim);
                };
                /**
                 * Check if a position is playable by a color.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 * @param c: color
                 */
                CoreComponent.prototype.isPlayable = function (x, y, c) {
                    if (this.grid[x][y] != 0) {
                        return false;
                    }
                    this.grid[x][y] = c;
                    if (this.countLiberties(x, y) > 0) {
                        this.grid[x][y] = 0;
                        return true;
                    }
                    var neighborGroups = this.getNeighbors(x, y);
                    for (var i = 0; i < neighborGroups.length; i++) {
                        if (this.countGroupLiberties(neighborGroups[i]) == 0) {
                            this.grid[x][y] = 0;
                            return true;
                        }
                    }
                    this.grid[x][y] = 0;
                    return false;
                };
                /**
                 * Count the liberties of a group where the input position resides.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.countLiberties = function (x, y) {
                    var group = this.getSelfGroup(x, y);
                    return this.countGroupLiberties(group);
                };
                /**
                 * Count the liberties of a group.
                 * @param group: a group of stones
                 */
                CoreComponent.prototype.countGroupLiberties = function (group) {
                    var explore = {};
                    for (var prop in group) {
                        if (group.hasOwnProperty(prop)) {
                            explore[prop] = true;
                        }
                    }
                    var liberties = {};
                    while (!this.isEmpty(explore)) {
                        var str = this.getFirst(explore);
                        var pos = this.str2pos(str);
                        var adjacent = [{ x: pos.x - 1, y: pos.y }, { x: pos.x + 1, y: pos.y },
                            { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 }];
                        delete explore[str];
                        for (var i = 0; i < 4; i++) {
                            var currStr = this.pos2str(adjacent[i]);
                            var currX = adjacent[i].x;
                            var currY = adjacent[i].y;
                            if (this.isOnBoard(currX, currY) && this.grid[currX][currY] == 0
                                && !liberties[currStr]) {
                                liberties[currStr] = true;
                            }
                        }
                    }
                    return this.getLength(liberties);
                };
                /**
                 * Get an array of groups which are input position's group's neighbors.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.getNeighbors = function (x, y) {
                    var color = this.grid[x][y];
                    var group = this.getSelfGroup(x, y);
                    var neighborStones = {};
                    var neighborGroups = [];
                    while (!this.isEmpty(group)) {
                        var str = this.getFirst(group);
                        var pos = this.str2pos(str);
                        var adjacent = [{ x: pos.x - 1, y: pos.y }, { x: pos.x + 1, y: pos.y },
                            { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 }];
                        delete group[str];
                        for (var i = 0; i < 4; i++) {
                            var currStr = this.pos2str(adjacent[i]);
                            var currX = adjacent[i].x;
                            var currY = adjacent[i].y;
                            if (this.isOnBoard(currX, currY) && this.grid[currX][currY] == -color
                                && !neighborStones[currStr]) {
                                neighborStones[currStr] = true;
                            }
                        }
                    }
                    while (!this.isEmpty(neighborStones)) {
                        var str = this.getFirst(neighborStones);
                        var pos = this.str2pos(str);
                        var neighborGroup = this.getSelfGroup(pos.x, pos.y);
                        for (var prop in neighborGroup) {
                            if (neighborGroup.hasOwnProperty(prop)) {
                                delete neighborStones[prop];
                            }
                        }
                        neighborGroups.push(neighborGroup);
                    }
                    return neighborGroups;
                };
                /**
                 * Get the group where the input position resides.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.getSelfGroup = function (x, y) {
                    var color = this.grid[x][y];
                    var explore = {};
                    var visited = {};
                    explore[this.xy2str(x, y)] = true;
                    while (!this.isEmpty(explore)) {
                        var str = this.getFirst(explore);
                        var pos = this.str2pos(str);
                        var adjacent = [{ x: pos.x - 1, y: pos.y }, { x: pos.x + 1, y: pos.y },
                            { x: pos.x, y: pos.y + 1 }, { x: pos.x, y: pos.y - 1 }];
                        visited[str] = true;
                        delete explore[str];
                        for (var i = 0; i < 4; i++) {
                            var currStr = this.pos2str(adjacent[i]);
                            var currX = adjacent[i].x;
                            var currY = adjacent[i].y;
                            if (this.isOnBoard(currX, currY) && this.grid[currX][currY] == color
                                && !visited[currStr] && !explore[currStr]) {
                                explore[currStr] = true;
                            }
                        }
                    }
                    return visited;
                };
                /**
                 * Remove all stones in the input group.
                 * @param group: a group of stones
                 */
                CoreComponent.prototype.removeGroup = function (group) {
                    for (var prop in group) {
                        if (group.hasOwnProperty(prop)) {
                            var pos = this.str2pos(prop);
                            this.grid[pos.x][pos.y] = 0;
                        }
                    }
                };
                /**
                 * Check if a position is on the board.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.isOnBoard = function (x, y) {
                    if (x >= this.dim || y >= this.dim || x < 0 || y < 0)
                        return false;
                    return true;
                };
                /**
                 * Helper to get the first key of an object, return null if empty.
                 * @param obj: object
                 */
                CoreComponent.prototype.getFirst = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            return prop;
                        }
                    }
                    return null;
                };
                /**
                 * Helper to check if an object is empty.
                 * @param obj: object
                 */
                CoreComponent.prototype.isEmpty = function (obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop))
                            return false;
                    }
                    return true && JSON.stringify(obj) === JSON.stringify({});
                };
                /**
                 * Helper to get the length of an object.
                 * @param obj: object
                 */
                CoreComponent.prototype.getLength = function (obj) {
                    var length = 0;
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop))
                            length++;
                    }
                    return length;
                };
                /**
                 * Helper to stringify an x, y position (<e.g.> x = 1, y = 2) to a string (<e.g.> "1,2").
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.xy2str = function (x, y) {
                    return x + "," + y;
                };
                /**
                 * Helper to stringify a poisition object (<e.g.> {x: 1, y: 2}) to a string (<e.g.> "1,2").
                 * @param pos: a position object
                 */
                CoreComponent.prototype.pos2str = function (pos) {
                    return pos.x + "," + pos.y;
                };
                /**
                 * Helper to de-stringify a string (<e.g.> "1,2") to a poisition object (<e.g.> {x: 1, y: 2}).
                 * @param str: string representation of a position object
                 */
                CoreComponent.prototype.str2pos = function (str) {
                    var res = str.split(",");
                    return { x: parseInt(res[0]), y: parseInt(res[1]) };
                };
                /**
                 * Helper to generate a dim*dim 2D array.
                 * @param dim: dimension
                 */
                CoreComponent.prototype.createGrid = function (dim) {
                    var board = [];
                    for (var i = 0; i < dim; i++) {
                        board[i] = [];
                        for (var j = 0; j < dim; j++) {
                            board[i][j] = 0;
                        }
                    }
                    return board;
                };
                /**
                 * Add a stone to DOM and update core if playable, a MOVERESP is sent.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.move = function (x, y) {
                    if (this.isPlayable(x, y, this.turn)) {
                        var data = {
                            method: "MOVERESP",
                            body: {
                                add: [{ x: x, y: y, c: this.turn, s: this.steps + 1 }],
                                remove: [],
                                turn: null
                            }
                        };
                        this.sequence[x][y] = this.steps + 1;
                        this.grid[x][y] = this.turn;
                        var neighborGroups = this.getNeighbors(x, y);
                        for (var i = 0; i < neighborGroups.length; i++) {
                            if (this.countGroupLiberties(neighborGroups[i]) == 0) {
                                for (var prop in neighborGroups[i]) {
                                    if (neighborGroups[i].hasOwnProperty(prop)) {
                                        var pos = this.str2pos(prop);
                                        this.grid[pos.x][pos.y] = 0;
                                        data.body.remove.push({ x: pos.x, y: pos.y, c: -this.turn, s: this.sequence[pos.x][pos.y] });
                                        this.sequence[pos.x][pos.y] = 0;
                                    }
                                }
                            }
                        }
                        this.steps += 1;
                        this.turn = this.steps >= this.handicaps ? -this.turn : this.turn;
                        data.body.turn = this.turn;
                        if (this.mode == 1 || this.mode == 2) {
                            this.history.push(data.body);
                        }
                        else if (this.mode == 3) {
                            this.testHistory.push(data.body);
                        }
                        this.goService.core2board(data);
                    }
                };
                /**
                 * Remove the last stone from DOM and update core if playable, a MOVERESP is sent.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                CoreComponent.prototype.regret = function () {
                    var last;
                    if (this.mode == 1) {
                        last = this.history.pop();
                    }
                    else if (this.mode == 3) {
                        last = this.testHistory.pop();
                    }
                    for (var i = 0; i < last.add.length; i++) {
                        this.grid[last.add[i].x][last.add[i].y] = 0;
                        this.sequence[last.add[i].x][last.add[i].y] = 0;
                    }
                    for (var i = 0; i < last.remove.length; i++) {
                        this.grid[last.remove[i].x][last.remove[i].y] = last.remove[i].c;
                        this.sequence[last.remove[i].x][last.remove[i].y] = last.remove[i].s;
                    }
                    var data = {
                        method: "MOVERESP",
                        body: {
                            add: last.remove,
                            remove: last.add,
                            turn: this.steps >= this.handicaps ? -last.turn : last.turn
                        }
                    };
                    this.turn = this.steps >= this.handicaps ? -last.turn : last.turn;
                    this.steps -= 1;
                    this.goService.core2board(data);
                };
                /**
                 * Process data from subscription.
                 * @param data: {mothod; body}
                 */
                CoreComponent.prototype.processData = function (data) {
                    switch (data.method) {
                        case "INIT":
                            this.dim = data.body.dim;
                            this.grid = this.createGrid(data.body.dim);
                            this.sequence = this.createGrid(data.body.dim);
                            this.mode = data.body.mode;
                            this.handicaps = data.body.handicaps;
                            this.black = data.body.black;
                            this.white = data.body.white;
                            this.turn = 1;
                            data = {
                                method: "INIT",
                                body: {
                                    dim: this.dim,
                                    turn: 1
                                }
                            };
                            this.goService.core2board(data);
                            break;
                        case "RESET":
                            this.resetCore();
                            data = {
                                method: "RESET",
                                body: {}
                            };
                            this.goService.core2board(data);
                            break;
                        case "MOVE":
                            if (this.mode == 1 || this.mode == 3) {
                                this.move(data.body.x, data.body.y);
                            }
                            break;
                        case "MOVE2":
                            if (this.mode == 2) {
                                this.move(data.body.x, data.body.y);
                            }
                            break;
                        case "FORWARD":
                            if (this.mode == 2 && this.steps < this.history.length) {
                                var next = this.history[this.steps];
                                for (var i = 0; i < next.add.length; i++) {
                                    this.grid[next.add[i].x][next.add[i].y] = next.add[i].c;
                                    this.sequence[next.add[i].x][next.add[i].y] = next.add[i].s;
                                }
                                for (var i = 0; i < next.remove.length; i++) {
                                    this.grid[next.remove[i].x][next.remove[i].y] = 0;
                                    this.sequence[next.remove[i].x][next.remove[i].y] = 0;
                                }
                                var data_1 = {
                                    method: "MOVERESP",
                                    body: next
                                };
                                this.steps += 1;
                                this.turn = this.steps >= this.handicaps ? -this.turn : this.turn;
                                this.goService.core2board(data_1);
                            }
                            break;
                        case "BACKWARD":
                            if (this.mode == 2 && this.steps > 0) {
                                var prev = this.history[this.steps - 1];
                                for (var i = 0; i < prev.add.length; i++) {
                                    this.grid[prev.add[i].x][prev.add[i].y] = 0;
                                    this.sequence[prev.add[i].x][prev.add[i].y] = 0;
                                }
                                for (var i = 0; i < prev.remove.length; i++) {
                                    this.grid[prev.remove[i].x][prev.remove[i].y] = prev.remove[i].c;
                                    this.sequence[prev.remove[i].x][prev.remove[i].y] = prev.remove[i].s;
                                }
                                var data_2 = {
                                    method: "MOVERESP",
                                    body: {
                                        add: prev.remove,
                                        remove: prev.add,
                                        turn: this.steps >= this.handicaps ? -prev.turn : prev.turn
                                    }
                                };
                                this.turn = this.steps >= this.handicaps ? -prev.turn : prev.turn;
                                this.steps -= 1;
                                this.goService.core2board(data_2);
                            }
                            break;
                        case "REGRET":
                            if (this.mode == 1 && this.steps > 0) {
                                this.regret();
                            }
                            break;
                        case "STARTTEST":
                            if (this.mode == 2) {
                                this.testHistory = [];
                                this.mode = 3;
                            }
                            break;
                        case "ENDTEST":
                            if (this.mode == 3) {
                                while (this.testHistory.length > 0) {
                                    this.regret();
                                }
                                this.mode = 2;
                            }
                            break;
                    }
                };
                CoreComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-core',
                        template: ''
                    }), 
                    __metadata('design:paramtypes', [go_service_1.GoService])
                ], CoreComponent);
                return CoreComponent;
            }());
            exports_1("CoreComponent", CoreComponent);
        }
    }
});
//# sourceMappingURL=core.component.js.map