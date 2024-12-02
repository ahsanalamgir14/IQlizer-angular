"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var aws_amplify_1 = require("aws-amplify");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ListComponent = /** @class */ (function () {
    function ListComponent(productSvc, router, sanitizer) {
        this.productSvc = productSvc;
        this.router = router;
        this.sanitizer = sanitizer;
        this.productData = [];
        this.isLoading = true;
        this.displayedColumns = ['name', 'price', 'sku', 'category', 'upload'];
        //url: string = 'https://us-east-2.quicksight.aws.amazon.com/embedding/0d059dae5a964be2a2690e8f170255a0/start/analyses?code=AYABeHgTgtS9XMQouf2xNGq_BskAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy1lYXN0LTI6MjU5MzgxNDUwNDA2OmtleS8xZGQ4NmNiNy01MmE3LTQxMTItYTEyOC0zNTYzMzU0ODViZTkAuAECAQB4DdxVjF2aWiXFC5zLBOgTt1nyt51ucPSJkkn6lp9dUEkBb08QXOJRCg7vU7lPPSZ5QgAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDA46ojrcNkNhh5TKAgIBEIA7VoVrhU7as5hd97VACkFxYaTjmY0WqhmA6x8mlze_d03FcvndUu08_cJpcaz8yLG48JjOTmpfJrQMxWkCAAAAAAwAABAAAAAAAAAAAAAAAAAAsT41XhFjQeKG-BT0LPAbiv____8AAAABAAAAAAAAAAAAAAABAAAAm5FoMFHTQ4XqI42SDoicJlVQmikuX-m0D_SXreFbE_O7QzZtz__7M9Fq-enRFuTawW0IEoaO9nPIszU67tPI9uIe4Idiu459bcw2RaHLuDR0ejW4p1tqqv7uPQOQyavNMa02zYR93AklRX0cbifaoAC4eIxCnHXmwaYJe1OBJB6L86yHK1blmdyKGPJD4SxTQJKFKly78gnU8_tpqMzBZXLNkL-tS851DsAmgQ%3D%3D&identityprovider=quicksight&isauthcode=true';
        this.url = '';
        this.selectedFile = null;
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.productSvc.fetch().subscribe(function (data) {
            _this.productData = data;
            console.log(data);
            _this.isLoading = false;
            // this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        });
        try {
            var s = aws_amplify_1.Auth.currentSession()["catch"](function (err) {
                console.log('Failed to get current session. Err: ', err);
                return err;
            });
            var session$ = rxjs_1.from(s);
            var token$ = session$.pipe(operators_1.map(function (sesh) {
                return sesh && typeof sesh.getIdToken === 'function' && sesh.getIdToken();
            }));
            console.log(token$);
            // Subscribe to the token$ observable to get the actual token value
            token$.subscribe(function (token) {
                _this.username$ = of(token.payload && token.payload['cognito:username']);
                _this.companyName$ = of(token.payload && token.payload['custom:company-name']);
                _this.userRole$ = of(token.payload && token.payload['custom:userRole']);
                _this.isSubscribed$ = of(token.payload && token.payload['custom:isSubscribed']);
                // Log the user role after extracting it
                _this.userRole$.subscribe(function (userRole) {
                    console.log("user role:", userRole);
                });
                // Log the user role after extracting it
                _this.isSubscribed$.subscribe(function (isSubscribed) {
                    console.log("isSubscribed$:", isSubscribed);
                });
            });
        }
        finally {
        }
        onEdit(product, Product);
        {
            this.router.navigate(['products', 'edit', product.productId]);
            return false;
        }
        onViewDashboard(product, Product);
        {
            this.isLoading = true;
            this.productSvc.get(product.shardId + ':' + product.productId, 'embed', product.category).subscribe(function (data) {
                var embedurl = data['embedURL'];
                _this.isLoading = false;
                _this.router.navigate(['products', 'dashboard', embedurl]);
            });
        }
        openLink(product, Product);
        void {
            "this": .isLoading = true,
            "this": .productSvc.get(product.shardId + ':' + product.productId, 'console', product.category).subscribe(function (data) {
                var consoleurl = data['consoleURL'];
                console.log(consoleurl);
                _this.isLoading = false;
                _this.router.navigate(['products', 'dashboard', consoleurl]);
            })
        };
        getElementInIframe();
        {
            // Accessing the iframe element
            var iframe = document.getElementById('iframe');
            if (iframe)
                alert(iframe);
            var iframeElement_1 = this.myFrame.nativeElement;
            // Accessing an element inside the iframe by ID
            iframeElement_1.onload = function () {
                if (iframeElement_1 && iframeElement_1.contentDocument) {
                    var elementInsideIframe = iframeElement_1.contentDocument.getElementById('application-header');
                    if (elementInsideIframe) {
                        // Do something with the element inside the iframe
                        console.log(elementInsideIframe);
                    }
                    else {
                        console.error('Element not found inside the iframe.');
                    }
                }
            };
        }
    };
    ListComponent.prototype.openWindow = function (url) {
        // Use a timeout to ensure that the window.open is triggered by user interaction
        setTimeout(function () {
            var newWindow = window.open(url, '_blank');
            if (newWindow) {
                // Popup was not blocked, do further handling if needed
            }
            else {
                // Popup was blocked, inform the user or handle the situation
                alert('Popup was blocked. Please allow pop-ups for this site.');
            }
        }, 100);
    };
    ListComponent.prototype.onRemove = function (product) {
        var _this = this;
        this.isLoading = true;
        this.productSvc["delete"](product).subscribe(function (data1) {
            _this.productSvc.fetch().subscribe(function (data) {
                _this.productData = data;
                _this.isLoading = false;
            }, function (error1) {
                _this.isLoading = false;
                alert(error1.message);
                console.error(error1);
            });
        }, function (error) {
            _this.isLoading = false;
            alert(error.message);
            console.error(error);
        });
    };
    ListComponent.prototype.onCreate = function () {
        this.router.navigate(['products', 'create']);
    };
    ListComponent.prototype.updateIframeUrl = function (newUrl) {
        this.url = newUrl;
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(newUrl);
        console.log(newUrl);
    };
    ListComponent.prototype.onFileSelected = function (event, product) {
        var _this = this;
        this.isLoading = true;
        this.selectedFile = event.target.files[0];
        this.productSvc.upload(product, this.selectedFile).subscribe(function (data) {
            console.log('Done uploading');
            _this.isLoading = false;
        });
    };
    __decorate([
        core_1.ViewChild('iframe')
    ], ListComponent.prototype, "myFrame");
    ListComponent = __decorate([
        core_1.Component({
            selector: 'app-list',
            templateUrl: './list.component.html',
            styleUrls: ['./list.component.scss']
        })
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
