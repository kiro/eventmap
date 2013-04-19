/**
 * Status modal. It displays a progress bar which is updated on every increment
 * call. total is the number of increment calls expected and onFinish is an
 * optional function that should be called when the status has reached 100%.
 **/
function Status(onFinish) {
    this.processed = 0;
    this.onFinish = onFinish || function() {};
    
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
 * Incremets the progress bar and displays the info text.
 **/
Status.prototype.increment = function(info) {
    this.processed++;
    
    $("#progress-bar").css("width", Math.floor( (this.processed / this.total) * 100 ) + "%");
    $("#progress-info").html(info);
    
    if (this.processed == this.total) {        
        function finish() {
            $('#status-modal').hide();
            this.onFinish();
        }
        
        setTimeout($.proxy(finish, this), 500);
    }
}