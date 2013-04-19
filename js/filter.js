/**
 * Represents teh filter dialogue. It can can show it, and match events agains it.
 */
function Filter(eventList) {
    this.fromDate = $("#from-date");
    this.toDate =  $("#to-date");
    this.weekend = $("#weekend");
    this.filter = $("#filter-text");
    this.filterDiv = $("#filter-div");
    
    util.each([this.fromDate, this.toDate, this.filter], function(element) {
        element.val("");        
    });
    
    this.fromDate.datepicker();
    this.toDate.datepicker();
    this.filterDiv.css('display', 'none');
}

Filter.prototype.fromDateFilter = function(event) {    
    return this.fromDate.val() ? new Date(this.fromDate.val()) <= event.startDate : true;
}
    
Filter.prototype.toDateFilter = function(event) {    
    return this.toDate.val() ? new Date(this.toDate.val()) >= event.startDate : true;        
}   
    
Filter.prototype.weekendFilter = function(event) {
    var day = event.startDate.getDay();
    return this.weekend.is(':checked') ? (day == 5 || day == 6) : true;
}

Filter.prototype.stringMatchFilter = function(event) {
    var match = this.filter.val().toLowerCase();
    
    function matches(value) {
        return (util.is_string(value)) ? (value.toLowerCase().indexOf(match) != -1) : false;
    }
        
    return match ? util.or(util.values(event), matches) : true;
}

/**
 * Shows the filter menu.
 */
Filter.prototype.show = function(eventsList) {
    this.filterDiv.show();
    var suggestions = eventsList.getSuggestions();
    this.filter.typeahead();
    // the source is set here, so it can be updated
    this.filter.data('typeahead').source = suggestions;
}

/**
 * Checks if event is matching all filters.
 */
Filter.prototype.isMatching = function(event) {
    var filters = [$.proxy(this.fromDateFilter, this),
                   $.proxy(this.toDateFilter, this),
                   $.proxy(this.weekendFilter, this),
                   $.proxy(this.stringMatchFilter, this)];
        
    return util.and(filters, function(filter) {
        var result = filter(event);
        return result;
    });
}
