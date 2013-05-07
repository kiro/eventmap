/**
 * Status modal. It displays a progress bar which is updated on every increment
 * call. total is the number of increment calls expected and onFinish is an
 * optional function that should be called when the status has reached 100%.
 **/
function Status(onFinish) {
    onFinish = onFinish || function() {};
    this.processed = 0;
    this.finish = function () {
        $('#status-modal').hide();
        onFinish();
    }
    
    $("#status-modal").modal({ show:true, keyboard:false, backdrop:false });
    $("#status-modal").show();
    $("#progress-bar").css("width", "0%");
}

/**
 * Sets the total number of increments expected.
 */
Status.prototype.setTotal = function(total) {
    this.total = total;
}

/**
 * Increments the progress bar and displays the info text.
 **/
Status.prototype.increment = function(info) {
    this.processed++;

    if (this.processed / this.total * 100 > 98 && this.processed < this.total) {
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout($.proxy(this.finish, this), 2000)
    }

    $("#progress-bar").css("width", Math.floor( (this.processed / this.total) * 100 ) + "%");
    $("#progress-info").html(info);
    
    if (this.processed == this.total) {
        setTimeout($.proxy(this.finish, this), 500);
    }
}