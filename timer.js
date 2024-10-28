/*--------------------------------------------START-------------------------------------------------------*/
var StayTimer = /** @class */ (function () {
    function StayTimer(elementId) {
        this.startTime = Date.now();
        this.timerElement = document.getElementById(elementId);
        this.updateTimer();
    }
    StayTimer.prototype.updateTimer = function () {
        var _this = this;
        if (this.timerElement) {
            var currentTime = Date.now();
            var elapsedTime = Math.floor((currentTime - this.startTime) / 1000); // in seconds
            var hours = Math.floor(elapsedTime / 3600);
            var minutes = Math.floor((elapsedTime % 3600) / 60);
            var seconds = elapsedTime % 60;
            this.timerElement.textContent = "Duration of stay: ".concat(this.pad(hours), ":").concat(this.pad(minutes), ":").concat(this.pad(seconds));
        }
        setTimeout(function () { return _this.updateTimer(); }, 1000);
    };
    StayTimer.prototype.pad = function (num) {
        return num < 10 ? "0".concat(num) : num.toString();
    };
    return StayTimer;
}());
window.onload = function () {
    new StayTimer('stayTimer');
};
