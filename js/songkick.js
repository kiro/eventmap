/**
 * Wrapper around the songkick api.
 */
function Songkick(user, eventsList, eventsMap) {
    this.apiKey = "hZ2Fewy4geaBhLCS";
    this.user = user;
    this.eventsList = eventsList;
    this.eventsMap = eventsMap;
    this.events = [];
    this.lastfm = new LastFM();
}

/**
 * Displays all future events for the tracked artists.
 */
Songkick.prototype.showEventsForTrackerArtists = function(onFinish) {        
    var trackingsUrl = "http://api.songkick.com/api/3.0/users/" + this.user +"/artists/tracked.json?location=clientip&apikey=" + this.apiKey + "&jsoncallback=?";
    var status = new Status(onFinish);    
    
    function initializeStatus(firstPage) {
        status.setTotal(firstPage.resultsPage.totalEntries);
    }
    
    function addEvent(songkickArtist) {
        return function(songkickEvent) {            
            var event = this.eventsList.addEvent(songkickArtist, songkickEvent);
            this.eventsMap.addEvent(event);
        }
    }
    
    function updateStatus(artist) {
        return function() {
            status.increment(artist.displayName);          
        }
    }   
    
    function showEvents(artist) {
        if (artist.onTourUntil != null) { 
            this.lastfm.getTags(artist.displayName, $.proxy(function(tags) {        
                artist.tags = tags;           
                var eventsUrl = "http://api.songkick.com/api/3.0/artists/" + artist.id + "/calendar.json?apikey=" + this.apiKey + "&jsoncallback=?";                            
                this.forEachItem({ url:eventsUrl, processItem:addEvent(artist), onFinish:updateStatus(artist) });
            }, this));
        } else {
            updateStatus(artist)();
        }
    }
    
    this.forEachItem({url:trackingsUrl, processItem:showEvents, onStart:initializeStatus});
}

/**
 * Iterates through paginated resutls and calls processItem for each result.
 */
Songkick.prototype.forEachItem = function(params) {
    var processItem = $.proxy(params.processItem, this);
    var onStart = $.proxy(params.onStart || function(){}, this);
    var onFinish = $.proxy(params.onFinish || function(){}, this);     
    
    var totalPages;
    var processedPages = 0;
    
    function processPage(data) {
        var results = util.getFirstProperty(data.resultsPage.results);              
        util.each(results, processItem);
        
        if (++processedPages == totalPages) {
            onFinish();
        }
    }
    
    function forEachPage(firstPage) {
        totalPages = Math.ceil(firstPage.resultsPage.totalEntries / firstPage.resultsPage.perPage);
        
        onStart(firstPage);
               
        processPage(firstPage);                     
        for (var page = 2; page <= totalPages; page++) {
            $.getJSON(params.url + "&page=" + page, processPage);
        }
    }
    
    $.getJSON(params.url, forEachPage);
}


