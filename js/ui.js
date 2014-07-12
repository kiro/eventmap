/**
 * Initializes the document.
 */
$(document).ready(function() {
    var eventsMap = new EventsMap(); 
    initializeSearchBox(eventsMap);    
})

/**
 * Initializes the search box.
 **/
function initializeSearchBox(eventsMap) {
    $("#search-button").click(function() {
        window.location.hash = $("#search-box").val();
        $("#search-button").addClass("disabled");
        $("#search-box").attr("disabled", "");
        $("#search-box").blur();
        $("#no-results-alert").css("display", "none");
        eventsMap.clear();
        
        var eventsList = new EventsList();    
        var filter = new Filter();
        var songkick = new Songkick($("#search-box").val(), eventsList, eventsMap);
        
        songkick.showEventsForTrackerArtists(function() {
            $("#search-button").removeClass("disabled");
            $("#search-box").removeAttr("disabled");
            filter.show(eventsList);            
        });
        
        $("#filter-button").click(function() {
            var matchingEvents = eventsList.getEvents().filter($.proxy(filter.isMatching, filter));
            eventsMap.clear();
            if (matchingEvents.length == 0) {
                $("#no-results-alert").css("display", "block")
            } else {
                $("#no-results-alert").css("display", "none");
                eventsMap.addEvents(matchingEvents);
            }
            return false;
        });
        
        return false;
    });
    
    $("#search-box").keydown(function(event){
        if(event.keyCode == 13){
            $("#search-button").click();
        }
    });

    var hash = window.location.hash.slice(1);

    if (hash) {
        $("#search-box").val(hash);
        $("#search-button").click();
    }    
}
