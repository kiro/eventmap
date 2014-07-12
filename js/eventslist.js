/**
 * Stores a list of events, also allows to filter them. Each event is an object
 * with the following fields
 *
 * artist : string
 * type : Concert/Festival
 * startDate : Date
 * location : {lat, lng}
 * venue : string
 * city: string
 * country : string
 * tags : [] string
 **/
function EventsList() {
    this.events = [];
}

/**
 * Adds an event to the event list. It transforms it from the songkick format
 * to internal format, that stores only the fields that are used.
 **/
EventsList.prototype.addEvent = function(songkickArtist, songkickEvent) {
    var eventCity = songkickEvent.location ? songkickEvent.location.city : "";
    var lastComma = eventCity.lastIndexOf(",");
    
    var city = $.trim(eventCity.substring(0, lastComma));
    var country = $.trim(eventCity.substring(lastComma + 1));
    
    var event = {
        artist : songkickArtist.displayName,
        location : {
            lat : songkickEvent.location ? songkickEvent.location.lat : 0,
            lng : songkickEvent.location ? songkickEvent.location.lng : 0
        },
        venue : songkickEvent.venue ? songkickEvent.venue.displayName : "",
        type : songkickEvent.type,
        city : city,
        country : country,
        startDate : new Date(songkickEvent.start ? songkickEvent.start.date : Date.now()),
        tags: songkickArtist.tags,
        url: {
            songkick: songkickEvent.uri        
        }     
    }
    
    this.events.push(event);
    return event;
}

/**
 * Gets a list of suggestions that can be used ina typeahead for the added
 * events.
 */
EventsList.prototype.getSuggestions = function() {
    var suggestions = {};
    
    util.each(this.events, function(event) {
        util.eachValue(event, function(value) {
            if (util.is_string(value)) {
                suggestions[value] = 1;
            }
        })
    });

    return util.keys(suggestions);
}

/**
 * Gets all events in the event list.
 */
EventsList.prototype.getEvents = function() {
    return this.events;
}


