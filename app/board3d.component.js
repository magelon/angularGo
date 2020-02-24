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
    var Board3dComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (go_service_1_1) {
                go_service_1 = go_service_1_1;
            }],
        execute: function() {
            Board3dComponent = (function () {
                function Board3dComponent(elementRef, goService) {
                    this.elementRef = elementRef;
                    this.goService = goService;
                    this.dim = 19; // board dimension
                    this.radius = 1.5 * (19 + 1); // distance from camera to center (0, 0, 0)
                    this.size = 600; // canvas size
                    this.turn = 0; // 1: black; -1: white; 0: empty
                    this.active = false; // freeze the board if inactive
                    this.el = elementRef.nativeElement;
                    this.prep();
                    this.init();
                    this.render();
                }
                Board3dComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.coreSubscription = this.goService.core2board$.subscribe(function (data) {
                        console.log("core2board data: " + JSON.stringify(data));
                        _this.processData(data);
                    });
                };
                Board3dComponent.prototype.ngOnDestroy = function () {
                    this.coreSubscription.unsubscribe();
                };
                /**
                 * Prepare for objects that will not be recreated upon rerendering.
                 */
                Board3dComponent.prototype.prep = function () {
                    // renderer
                    this.renderer = new THREE.WebGLRenderer({ antialiasing: true, alpha: true });
                    this.renderer.setPixelRatio(window.devicePixelRatio);
                    this.renderer.setSize(this.size, this.size);
                    this.el.appendChild(this.renderer.domElement);
                    // camera 
                    this.camera = new THREE.PerspectiveCamera(50, 1, 1, 10000);
                    // conrols
                    this.orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                    this.orbit.enableZoom = true;
                    this.orbit.minDistance = this.radius / 3;
                    this.orbit.maxDistance = this.radius * 3;
                    this.orbit.enablePan = false;
                    this.orbit.enableDamping = true;
                    this.orbit.rotateSpeed = 0.2;
                    this.orbit.dampingFactor = 0.15;
                    // raycast and mouse
                    this.raycasterForClick = new THREE.Raycaster();
                    this.raycasterForMove = new THREE.Raycaster();
                    this.mouseForClick = new THREE.Vector2();
                    this.mouseForMove = new THREE.Vector2();
                    // lights
                    this.ambientLight = new THREE.AmbientLight(0x404040);
                    this.lights = [];
                    this.lights[0] = new THREE.PointLight(0xffffff, 1, 0);
                    this.lights[1] = new THREE.PointLight(0xffffff, 1, 0);
                    this.lights[0].position.set(150, 200, 100);
                    this.lights[1].position.set(-150, -200, 100);
                    // geometry and material
                    this.stoneGeometry = new THREE.SphereGeometry(0.48, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
                    var textureLoader = new THREE.TextureLoader();
                    this.gobanMaterial = new THREE.MeshPhongMaterial({
                        map: textureLoader.load('images/wood-min.jpg'),
                        emissive: 0x000000,
                        side: THREE.DoubleSide,
                        shading: THREE.SmoothShading
                    });
                    this.blackMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        side: THREE.DoubleSide,
                        shading: THREE.SmoothShading
                    });
                    this.starGeometry = new THREE.CircleGeometry(0.12, 32);
                };
                /**
                 * Initialize the scene.
                 */
                Board3dComponent.prototype.init = function () {
                    this.active = false;
                    this.turn = 0;
                    // camera and orbit
                    this.camera.position.set(this.radius / 1.732, -this.radius / 1.732, this.radius / 1.732);
                    this.orbit.minDistance = this.radius / 3;
                    this.orbit.maxDistance = this.radius * 3;
                    this.orbit.update();
                    // scene
                    this.scene = new THREE.Scene();
                    // add lights to scene
                    this.scene.add(this.ambientLight);
                    for (var i = 0; i < this.lights.length; i++) {
                        this.scene.add(this.lights[i]);
                    }
                    // clear meshes
                    this.meshes = [];
                    // create & add stone meshes to scene
                    for (var i = 0; i < this.dim; i++) {
                        for (var j = 0; j < this.dim; j++) {
                            var stoneMaterial = new THREE.MeshPhongMaterial({
                                color: 0xffffff,
                                emissive: 0x000000,
                                specular: 0x808080,
                                shininess: 10,
                                side: THREE.DoubleSide,
                                shading: THREE.SmoothShading,
                                transparent: true,
                                opacity: 0
                            });
                            var stoneMesh = new THREE.Mesh(this.stoneGeometry, stoneMaterial);
                            stoneMesh.rotation.x = Math.PI / 2;
                            stoneMesh.position.x = i - (this.dim - 1) / 2;
                            stoneMesh.position.y = -j + (this.dim - 1) / 2;
                            stoneMesh.position.z = 0;
                            stoneMesh.index = [i, j];
                            this.meshes.push(stoneMesh);
                            this.scene.add(stoneMesh);
                        }
                    }
                    // create & add goban mesh to scene
                    var gobanGeometry = new THREE.BoxGeometry(this.dim + 1, this.dim + 1, (this.dim + 1) / 10);
                    var gobanMesh = new THREE.Mesh(gobanGeometry, this.gobanMaterial);
                    gobanMesh.position.z = -(this.dim + 1) / 20;
                    this.meshes.push(gobanMesh);
                    this.scene.add(gobanMesh);
                    // create & add line meshes to scene
                    var lineGeometryHorizontal = new THREE.PlaneGeometry(this.dim - 1 + 0.05, 0.05);
                    var lineGeometryVertical = new THREE.PlaneGeometry(0.05, this.dim - 1 + 0.05);
                    for (var i = 0; i < this.dim; i++) {
                        var lineMeshHorizontal = new THREE.Mesh(lineGeometryHorizontal, this.blackMaterial);
                        lineMeshHorizontal.position.y = i - (this.dim - 1) / 2;
                        lineMeshHorizontal.position.z = 0.01;
                        var lineMeshVertical = new THREE.Mesh(lineGeometryVertical, this.blackMaterial);
                        lineMeshVertical.position.x = i - (this.dim - 1) / 2;
                        lineMeshVertical.position.z = 0.01;
                        this.scene.add(lineMeshHorizontal);
                        this.scene.add(lineMeshVertical);
                    }
                    // create & add star meshes to scene
                    var starMeshes = this.getStars(this.dim);
                    for (var i = 0; i < starMeshes.length; i++) {
                        this.scene.add(starMeshes[i]);
                    }
                };
                /**
                 * Render the scene.
                 */
                Board3dComponent.prototype.render = function () {
                    requestAnimationFrame(this.render.bind(this));
                    this.orbit.update();
                    this.renderer.render(this.scene, this.camera);
                };
                /**
                 * Helper to get circles of the board stars.
                 * @param dim: dimension
                 */
                Board3dComponent.prototype.getStars = function (dim) {
                    var starMeshes = [];
                    if (dim == 9) {
                        var starMesh = new THREE.Mesh(this.starGeometry, this.blackMaterial);
                        starMesh.position.x = 0;
                        starMesh.position.y = 0;
                        starMesh.position.z = 0.01;
                        starMeshes.push(starMesh);
                    }
                    else if (dim == 13) {
                        var coordinates = [-3, 3];
                        for (var i = 0; i < 2; i++) {
                            for (var j = 0; j < 2; j++) {
                                var starMesh = new THREE.Mesh(this.starGeometry, this.blackMaterial);
                                starMesh.position.x = coordinates[i];
                                starMesh.position.y = coordinates[j];
                                starMesh.position.z = 0.01;
                                starMeshes.push(starMesh);
                            }
                        }
                    }
                    else if (dim == 19) {
                        var coordinates = [-6, 0, 6];
                        for (var i = 0; i < 3; i++) {
                            for (var j = 0; j < 3; j++) {
                                var starMesh = new THREE.Mesh(this.starGeometry, this.blackMaterial);
                                starMesh.position.x = coordinates[i];
                                starMesh.position.y = coordinates[j];
                                starMesh.position.z = 0.01;
                                starMeshes.push(starMesh);
                            }
                        }
                    }
                    return starMeshes;
                };
                /**
                 * Record the mouse coordinates on mouse down.
                 * @param $event: DOM event
                 */
                Board3dComponent.prototype.onMousedown = function ($event) {
                    if (!this.active)
                        return;
                    this.mouseForClick.x = ($event.offsetX / this.size) * 2 - 1;
                    this.mouseForClick.y = -($event.offsetY / this.size) * 2 + 1;
                };
                /**
                 * If the mouse doesn't move during the click, add a stone to DOM if playable; a request will be sent.
                 * @param $event: dom event
                 */
                Board3dComponent.prototype.onMouseup = function ($event) {
                    if (!this.active)
                        return;
                    if (!this.mouseForClick.x || !this.mouseForClick.y
                        || this.mouseForClick.x != ($event.offsetX / this.size) * 2 - 1
                        || this.mouseForClick.y != -($event.offsetY / this.size) * 2 + 1)
                        return;
                    this.raycasterForClick.setFromCamera(this.mouseForClick, this.camera);
                    var intersects = this.raycasterForClick.intersectObjects(this.meshes);
                    if (intersects.length > 0 && intersects[0].object.index) {
                        console.log(intersects[0].object.index);
                        var data = {
                            method: "MOVE",
                            body: {
                                x: intersects[0].object.index[0],
                                y: intersects[0].object.index[1]
                            }
                        };
                        this.goService.board2core(data);
                    }
                };
                /**
                 * On mouse over, showcast the next move.
                 * @param $event: DOM event
                 */
                Board3dComponent.prototype.onMousemove = function ($event) {
                    if (!this.active)
                        return;
                    this.mouseForMove.x = ($event.offsetX / this.size) * 2 - 1;
                    this.mouseForMove.y = -($event.offsetY / this.size) * 2 + 1;
                    this.raycasterForMove.setFromCamera(this.mouseForMove, this.camera);
                    var intersects = this.raycasterForMove.intersectObjects(this.meshes);
                    if (!intersects.length || !intersects[0].object.index) {
                        if (this.intersectTemp && this.intersectTemp.material.opacity != 1) {
                            this.intersectTemp.material.opacity = 0;
                            this.intersectTemp = null;
                        }
                    }
                    else if (intersects[0].object.material.opacity != 1) {
                        if (this.intersectTemp && this.intersectTemp != intersects[0].object && this.intersectTemp.material.opacity != 1) {
                            this.intersectTemp.material.opacity = 0;
                        }
                        this.intersectTemp = intersects[0].object;
                        this.intersectTemp.material.color.setHex(this.turn == 1 ? 0x000000 : 0xffffff);
                        this.intersectTemp.material.opacity = 0.3;
                    }
                };
                /**
                 * Process data from subscription.
                 * @param data: {mothod; body}
                 */
                Board3dComponent.prototype.processData = function (data) {
                    switch (data.method) {
                        case "INIT":
                            this.dim = data.body.dim;
                            this.radius = 1.5 * (this.dim + 1);
                            this.init();
                            this.turn = data.body.turn;
                            this.active = true;
                            break;
                        case "RESET":
                            this.init();
                            break;
                        case "MOVERESP":
                            for (var i = 0; i < data.body.add.length; i++) {
                                if (data.body.add[i].c == 1) {
                                    this.meshes[this.dim * data.body.add[i].x + data.body.add[i].y].material.color.setHex(0x000000);
                                }
                                else {
                                    this.meshes[this.dim * data.body.add[i].x + data.body.add[i].y].material.color.setHex(0xffffff);
                                }
                                this.meshes[this.dim * data.body.add[i].x + data.body.add[i].y].material.opacity = 1;
                            }
                            for (var i = 0; i < data.body.remove.length; i++) {
                                this.meshes[this.dim * data.body.remove[i].x + data.body.remove[i].y].material.opacity = 0;
                            }
                            this.turn = data.body.turn;
                            break;
                    }
                };
                Board3dComponent = __decorate([
                    core_1.Component({
                        selector: 'ng-board3d',
                        template: '',
                        host: { '(mousedown)': 'onMousedown($event)',
                            '(mouseup)': 'onMouseup($event)',
                            '(mousemove)': 'onMousemove($event)' }
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, go_service_1.GoService])
                ], Board3dComponent);
                return Board3dComponent;
            }());
            exports_1("Board3dComponent", Board3dComponent);
        }
    }
});
//# sourceMappingURL=board3d.component.js.map