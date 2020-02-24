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
System.register(['angular2/core', './go.service', './board.component', './board3d.component', './config.component', './control.component', './core.component'], function(exports_1, context_1) {
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
    var core_1, go_service_1, board_component_1, board3d_component_1, config_component_1, control_component_1, core_component_1;
    var GoComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            },
            function (board_component_1_1) {
                board_component_1 = board_component_1_1;
            },
            function (board3d_component_1_1) {
                board3d_component_1 = board3d_component_1_1;
            },
            function (config_component_1_1) {
                config_component_1 = config_component_1_1;
            },
            function (control_component_1_1) {
                control_component_1 = control_component_1_1;
            },
            function (core_component_1_1) {
                core_component_1 = core_component_1_1;
            }],
        execute: function() {
            GoComponent = (function () {
                function GoComponent(goService) {
                    this.goService = goService;
                    this.newTabActive = true; // if new game config and control is shown
                    this.twodTabActive = true; //
                    this.showSequence = false;
                    this.showSequenceText = "Show sequence";
                }
                /**
                 * Show new game config and control.
                 */
                GoComponent.prototype.onNewTabClick = function () {
                    this.newTabActive = true;
                };
                /**
                 * Show import sgf config and control.
                 */
                GoComponent.prototype.onImportTabClick = function () {
                    this.newTabActive = false;
                };
                GoComponent.prototype.onTwodTabClick = function () {
                    this.twodTabActive = true;
                };
                GoComponent.prototype.onThreedTabClick = function () {
                    this.twodTabActive = false;
                };
                GoComponent.prototype.onShowSequence = function () {
                    this.showSequence = !this.showSequence;
                    if (this.showSequenceText === "Show sequence") {
                        this.showSequenceText = "Hide sequence";
                    }
                    else {
                        this.showSequenceText = "Show sequence";
                    }
                };
                GoComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-go',
                        templateUrl: 'app/go.template.html',
                        directives: [board_component_1.BoardComponent, board3d_component_1.Board3dComponent, config_component_1.ConfigComponent, control_component_1.ControlComponent, core_component_1.CoreComponent],
                        providers: [go_service_1.GoService]
                    }), 
                    __metadata('design:paramtypes', [go_service_1.GoService])
                ], GoComponent);
                return GoComponent;
            }());
            exports_1("GoComponent", GoComponent);
        }
    }
});
//# sourceMappingURL=go.component.js.map