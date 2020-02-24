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
System.register(['angular2/core', 'rxjs/Subject'], function(exports_1, context_1) {
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
    var core_1, Subject_1;
    var GoService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
            }],
        execute: function() {
            GoService = (function () {
                function GoService() {
                    /* channel between each pair of components */
                    this._config2coreSource = new Subject_1.Subject(); // config  -> core    
                    this._control2coreSource = new Subject_1.Subject(); // control -> core
                    this._export2coreSource = new Subject_1.Subject(); // export  -> core
                    this._core2exportSource = new Subject_1.Subject(); // core    -> export
                    this._board2coreSource = new Subject_1.Subject(); // board   -> core
                    this._core2boardSource = new Subject_1.Subject(); // core    -> board
                    this.config2core$ = this._config2coreSource.asObservable();
                    this.control2core$ = this._control2coreSource.asObservable();
                    this.export2core$ = this._export2coreSource.asObservable();
                    this.core2export$ = this._core2exportSource.asObservable();
                    this.board2core$ = this._board2coreSource.asObservable();
                    this.core2board$ = this._core2boardSource.asObservable();
                }
                GoService.prototype.config2core = function (data) {
                    this._config2coreSource.next(data);
                };
                GoService.prototype.control2core = function (data) {
                    this._control2coreSource.next(data);
                };
                GoService.prototype.export2core = function (data) {
                    this._export2coreSource.next(data);
                };
                GoService.prototype.core2export = function (data) {
                    this._core2exportSource.next(data);
                };
                GoService.prototype.board2core = function (data) {
                    this._board2coreSource.next(data);
                };
                GoService.prototype.core2board = function (data) {
                    this._core2boardSource.next(data);
                };
                GoService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], GoService);
                return GoService;
            }());
            exports_1("GoService", GoService);
        }
    }
});
//# sourceMappingURL=go.service.js.map