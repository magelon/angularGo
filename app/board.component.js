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
    var BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            }],
        execute: function() {
            BoardComponent = (function () {
                function BoardComponent(goService) {
                    this.goService = goService;
                    this.showSequence = "false";
                    this.dim = 19; // board dimension
                    this.grid = this.createGrid(19); // position for display, binded to svg
                    this.sequence = this.createGrid(19); // sequence number for sisplay, binded to svg
                    this.lines = this.getLines(19); // lines for board grids
                    this.stars = this.getStars(19); // circles for board stars
                    this.turn = 0; // 1: black; -1: white; 0: empty
                    this.active = false; // freeze the board if inactive
                }
                BoardComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.coreSubscription = this.goService.core2board$.subscribe(function (data) {
                        console.log("core2board data: " + JSON.stringify(data));
                        _this.processData(data);
                    });
                };
                BoardComponent.prototype.ngOnDestroy = function () {
                    this.coreSubscription.unsubscribe();
                };
                /**
                 * Reset board to default parameters.
                 */
                BoardComponent.prototype.resetBoard = function () {
                    this.turn = 0;
                    this.active = false;
                    this.grid = this.createGrid(this.dim);
                    this.sequence = this.createGrid(this.dim);
                };
                /**
                 * Helper to generate a dim*dim 2D array.
                 * @param dim: dimension
                 */
                BoardComponent.prototype.createGrid = function (dim) {
                    var grid = [];
                    for (var i = 0; i < dim; i++) {
                        grid[i] = [];
                        for (var j = 0; j < dim; j++) {
                            grid[i][j] = 0;
                        }
                    }
                    return grid;
                };
                /**
                 * Helper to get lines of the board grid for svg drawing.
                 * @param dim: dimension
                 */
                BoardComponent.prototype.getLines = function (dim) {
                    var lines = [];
                    var end = 500 * dim - 240;
                    for (var i = 0; i < dim; i++) {
                        lines.push({ a: 500 * i + 250, b: end });
                    }
                    return lines;
                };
                /**
                 * Helper to get circles of the board stars for svg drawing.
                 * @param dim: dimension
                 */
                BoardComponent.prototype.getStars = function (dim) {
                    var stars = [];
                    if (dim == 19) {
                        stars.push({ x: 250 + 500 * 3, y: 250 + 500 * 3 }, { x: 250 + 500 * 9, y: 250 + 500 * 3 }, { x: 250 + 500 * 15, y: 250 + 500 * 3 }, { x: 250 + 500 * 3, y: 250 + 500 * 9 }, { x: 250 + 500 * 9, y: 250 + 500 * 9 }, { x: 250 + 500 * 15, y: 250 + 500 * 9 }, { x: 250 + 500 * 3, y: 250 + 500 * 15 }, { x: 250 + 500 * 9, y: 250 + 500 * 15 }, { x: 250 + 500 * 15, y: 250 + 500 * 15 });
                    }
                    else if (dim == 13) {
                        stars.push({ x: 250 + 500 * 3, y: 250 + 500 * 3 }, { x: 250 + 500 * 3, y: 250 + 500 * 9 }, { x: 250 + 500 * 9, y: 250 + 500 * 3 }, { x: 250 + 500 * 9, y: 250 + 500 * 9 });
                    }
                    else if (dim == 9) {
                        stars.push({ x: 250 + 500 * 4, y: 250 + 500 * 4 });
                    }
                    return stars;
                };
                /**
                 * Helper to convert a number to a letter.
                 * @param num: a number >= 1 && <= 26
                 */
                BoardComponent.prototype.num2letter = function (num) {
                    if (num >= 1 && num <= 26) {
                        return String.fromCharCode(64 + num);
                    }
                    return "";
                };
                /**
                 * When the game is ready, add a stone to DOM if playable.
                 * @param x: x coordinate
                 * @param y: y coordinate
                 */
                BoardComponent.prototype.onClick = function (x, y) {
                    var data = {
                        method: "MOVE",
                        body: {
                            x: x,
                            y: y
                        }
                    };
                    this.goService.board2core(data);
                };
                /**
                 * Process data from subscription.
                 * @param data: {mothod; body}
                 */
                BoardComponent.prototype.processData = function (data) {
                    switch (data.method) {
                        case "INIT":
                            this.dim = data.body.dim;
                            this.grid = this.createGrid(data.body.dim);
                            this.sequence = this.createGrid(data.body.dim);
                            this.lines = this.getLines(data.body.dim);
                            this.stars = this.getStars(data.body.dim);
                            this.turn = data.body.turn;
                            this.active = true;
                            break;
                        case "RESET":
                            this.resetBoard();
                            break;
                        case "MOVERESP":
                            for (var i = 0; i < data.body.add.length; i++) {
                                this.grid[data.body.add[i].x][data.body.add[i].y] = data.body.add[i].c;
                                this.sequence[data.body.add[i].x][data.body.add[i].y] = data.body.add[i].s;
                            }
                            for (var i = 0; i < data.body.remove.length; i++) {
                                this.grid[data.body.remove[i].x][data.body.remove[i].y] = 0;
                                this.sequence[data.body.remove[i].x][data.body.remove[i].y] = 0;
                            }
                            this.turn = data.body.turn;
                            break;
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], BoardComponent.prototype, "showSequence", void 0);
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-board',
                        templateUrl: 'app/board.template.html'
                    }), 
                    __metadata('design:paramtypes', [go_service_1.GoService])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});
//# sourceMappingURL=board.component.js.map