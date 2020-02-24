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
System.register(['angular2/core', './go.service', './samples'], function(exports_1, context_1) {
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
    var core_1, go_service_1, samples_1;
    var ConfigComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            },
            function (samples_1_1) {
                samples_1 = samples_1_1;
            }],
        execute: function() {
            ConfigComponent = (function () {
                function ConfigComponent(goService) {
                    this.goService = goService;
                    this.type = "new"; // specify if it is a new game config UI or import sgf config UI
                    this.submitted = false; // if a new game is submitted
                    this.config = samples_1.Samples.sampleConfig; // default text of config
                    this.sgf = samples_1.Samples.sampleSgf; // default text of sgf
                }
                ;
                /**
                 * Send a INIT request to start a new game.
                 */
                ConfigComponent.prototype.onSubmit = function () {
                    var data = {
                        method: "INIT",
                        body: {
                            dim: parseInt(this.config.dim),
                            handicaps: parseInt(this.config.handicaps),
                            black: this.config.black,
                            white: this.config.white,
                            mode: 1
                        }
                    };
                    this.goService.config2core(data);
                    this.submitted = true;
                };
                /**
                 * Clear the config field.
                 */
                ConfigComponent.prototype.onClear = function () {
                    this.config = {
                        dim: "",
                        handicaps: "",
                        black: "",
                        white: "",
                    };
                };
                /**
                 * Send a RESET request to core to reset the game.
                 */
                ConfigComponent.prototype.onRestart = function () {
                    var data = {
                        method: "RESET",
                        body: {}
                    };
                    this.goService.config2core(data);
                    this.submitted = false;
                };
                /**
                 * Send a IMPORT request to core to import sgf record.
                 */
                ConfigComponent.prototype.onImport = function () {
                    var data = {
                        method: "INIT",
                        body: {
                            dim: 19,
                            handicaps: 0,
                            black: "",
                            white: "",
                            mode: 2
                        }
                    };
                    this.goService.config2core(data);
                    var temp = this.sgf2json(this.sgf);
                    var moves = [];
                    for (var i = 0; i < temp.length; i++) {
                        moves.push({
                            x: this.letter2num(temp[i].charAt(0)),
                            y: this.letter2num(temp[i].charAt(1))
                        });
                    }
                    for (var i = 0; i < moves.length; i++) {
                        var curr = {
                            method: "MOVE2",
                            body: {
                                x: moves[i].x,
                                y: moves[i].y
                            }
                        };
                        this.goService.config2core(curr);
                    }
                };
                /**
                 * Helper to convert a sgf string to a json.
                 * @param data: sgf string
                 */
                ConfigComponent.prototype.sgf2json = function (data) {
                    var sgf = data.split(';');
                    var initial = '{"'
                        + sgf[1].replace(/\[/g, '":"')
                            .replace(/\](\n)?/g, '","')
                        + 'TR":"goban.fr"}';
                    var turns = '['
                        + sgf.slice(2)
                            .join(', ')
                            .replace(/[A-Z\n\)]/g, '')
                            .replace(/[\[\]]/g, '"')
                        + ']';
                    return JSON.parse(turns);
                };
                /**
                 * Helper to convert a letter to a number.
                 * @param str: a letter from a to s
                 */
                ConfigComponent.prototype.letter2num = function (str) {
                    return str.charCodeAt(0) - 97;
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ConfigComponent.prototype, "type", void 0);
                ConfigComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-config',
                        templateUrl: 'app/config.template.html',
                        styles: ["\n        .ng-valid[required] {\n        border-left: 5px solid #42A948;\n        }\n\n        .ng-invalid {\n        border-left: 5px solid #a94442;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [go_service_1.GoService])
                ], ConfigComponent);
                return ConfigComponent;
            }());
            exports_1("ConfigComponent", ConfigComponent);
        }
    }
});
//# sourceMappingURL=config.component.js.map