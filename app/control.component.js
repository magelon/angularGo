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
    var ControlComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            }],
        execute: function() {
            ControlComponent = (function () {
                function ControlComponent(goService) {
                    this.goService = goService;
                    this.type = "new"; // specify if it is a new game config UI or import sgf config UI
                    this.forwardData = { method: "FORWARD", body: {} }; // FORWARD request data
                    this.backwardData = { method: "BACKWARD", body: {} }; // BACKWARD request data
                    this.regretData = { method: "REGRET", body: {} }; // REGRET request data
                    this.startTestData = { method: "STARTTEST", body: {} }; // STARTTEST request data
                    this.endTestData = { method: "ENDTEST", body: {} }; // ENDTEST request data
                }
                ;
                /**
                 * Send a FORWARD request to step forward.
                 */
                ControlComponent.prototype.onStepForward = function () {
                    this.goService.control2core(this.forwardData);
                };
                /**
                 * Send a BACKWARD request to step backward.
                 */
                ControlComponent.prototype.onStepBackward = function () {
                    this.goService.control2core(this.backwardData);
                };
                /**
                 * Send 5 FORWARD request to step forward*5.
                 */
                ControlComponent.prototype.onFastForward = function () {
                    for (var i = 0; i < 5; i++) {
                        this.goService.control2core(this.forwardData);
                    }
                };
                /**
                 * Send 5 BACKWARD request to step backward*5.
                 */
                ControlComponent.prototype.onFastBackward = function () {
                    for (var i = 0; i < 5; i++) {
                        this.goService.control2core(this.backwardData);
                    }
                };
                /**
                 * Send a REGRET request to step backward if in new game mode.
                 */
                ControlComponent.prototype.onRegret = function () {
                    this.goService.control2core(this.regretData);
                };
                ControlComponent.prototype.onStartTest = function () {
                    this.goService.control2core(this.startTestData);
                };
                ControlComponent.prototype.onEndTest = function () {
                    this.goService.control2core(this.endTestData);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], ControlComponent.prototype, "type", void 0);
                ControlComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-control',
                        templateUrl: 'app/control.template.html',
                        styles: []
                    }), 
                    __metadata('design:paramtypes', [go_service_1.GoService])
                ], ControlComponent);
                return ControlComponent;
            }());
            exports_1("ControlComponent", ControlComponent);
        }
    }
});
//# sourceMappingURL=control.component.js.map