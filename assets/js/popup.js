//
// Variables
//

var data = {};

//
// Init function
//

function init() {
    // Get local storage data
    var local_data = localStorage.data;
    if (local_data !== undefined) {
        data = JSON.parse(local_data);
    }
}

//
// On popup open
//

window.onload = function () {
    // Populate today
    populate_today();
    
    // Populate history
    populate_history();
}

//
// Returns th, st, nd, rd according to value
//

function nth(d) {
    if(d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
    }
}

//
// Inserts a thousand seperator
//

function thousands_sep(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//
// Populates data, to make sure we dont fuck anything up
//

function populate_data(year, month, day) {
    // Add year if none
    if (data['y' + year] === undefined) {
        data['y' + year] = {};
    }
    
    // Add month if none
    if (data['y' + year]['m' + month] === undefined) {
        data['y' + year]['m' + month] = {};
    }
    
    // Add date if none
    if (data['y' + year]['m' + month]['d' + day] === undefined) {
        data['y' + year]['m' + month]['d' + day] = [];
    }
}

//
// Returns the number of seaches for today
//

function get_number_of_searches(year, month, day) {
    // First populate
    populate_data(year, month, day);
    
    // Get the number of searches
    return data['y' + year]['m' + month]['d' + day].length;
}

//
// Populates the number of searches today
//

function populate_today() {
    // Get current date
    var d = new Date();
    
    // Get year, month, day
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    
    // Get number of searches
    var number_of_searches = get_number_of_searches(year, month, day);
    
    // Prettify number of searches
    var number_of_searches_pretty;
    if (number_of_searches == 0) {
        number_of_searches_pretty = 'No';
    }
    else {
        number_of_searches_pretty = thousands_sep(number_of_searches);
    }
    
    // Set to DOM
    $('#today-container').html(number_of_searches_pretty);
}

//
// Prettifies the number of searches
//

function prettify_count(n) {
    if (n == 0) {
        return 'No searches';
    }
    else {
        return thousands_sep(n) + ' search' + ((n == 1) ? '' : 'es');
    }
}

//
// Populates the numer of searches in the history table
//

function populate_history() {
    // Get current date
    var d = new Date();
    
    // Get year, month, day
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    
    // Storing the table here
    var table = '';
    
    // Check what months we are going to evaluate (we only display the three last at max)
    var months = [{year: year, month: month}];
    var d_temp = new Date();
    for (var i = 0; i < 2; i++) {
        d_temp.setDate(1);
        d_temp.setMonth(d_temp.getMonth()-1);
        if (check_month_count(d_temp.getFullYear(),
                              d_temp.getMonth())) {
            months.push({year: d_temp.getFullYear(), 
                               month: d_temp.getMonth()});
        }
    }
    
    // Loop the months and populate with content
    for (var i = 0; i < months.length; i++) {
        var month_name = months[i].month;
        var month_status = '';
        var month_caret = 'right';
        
        if (months[i].month == month && months[i].year == year) {
            // Current month
            month_name = 'This month';
            month_status = ' open';
            month_caret = 'down';
        }
        
        // Draw html
        table += '<div class="history-block history-top-block' + month_status + '">';
        table += '    <div class="history-info">';
        table += '        <div class="history-info-left">';
        table += '            <i class="fa fa-caret-' + month_caret + '"></i>';
        table += '            <p>' + month_name + '</p>';
        table += '        </div>';
        table += '        <div class="history-info-right">';
        table += '            <p>' + prettify_count(get_month_count(months[i].year, months[i].month)) + '</p>';
        table += '        </div>';
        table += '        <div class="clear"></div>';
        table += '    </div>';
        
        // Week
        table += populate_history_days(months[i].year, months[i].month);
        
        // Cloose container
        table += '</div>';
    }
    
    // Set content
    $('#history').html(table);
}

//
// Returns the number of days in a given month
//

function days_in_month(year, month) {
    return new Date(year, month, 0).getDate();
}

//
// Populates the number of searches for every day in a month
//

function populate_history_days(year, month) {
    // Get current date
    var d_today = new Date();
    var today_year = d_today.getFullYear();
    var today_month = d_today.getMonth();
    var today_day = d_today.getDate();
    
    // Get yesterday
    var d_yesterday = new Date();
    d_yesterday.setDate(d_yesterday.getDate() - 1);
    var yesterday_year = d_yesterday.getFullYear();
    var yesterday_month = d_yesterday.getMonth();
    var yesterday_day = d_yesterday.getDate();
    
    // For storing the html markup
    var inner_table = '';
    
    // Loop all the days in the month
    for (var i = days_in_month(year, month); i >= 1; i--) {
        // Get number of searches
        var number_of_searches = get_number_of_searches(year, month, i);
        
        // Only add those days that have any searches
        if (number_of_searches != 0) {
            // Switch out dates for today and yesterday
            var date_text = '';
            if (today_year == year && today_month == month && today_day == i) {
                date_text = 'Today';
            }
            else if (yesterday_year == year && yesterday_month == month && yesterday_day == i) {
                date_text = 'Yesterday';
            }
            else {
                date_text = i + nth(i);
            }
            
            // Html markup
            inner_table += '<div class="history-block history-inner-block">';
            inner_table += '    <div class="history-info">';
            inner_table += '        <div class="history-info-left">';
            inner_table += '            <p>' + date_text + '</p>';
            inner_table += '        </div>';
            inner_table += '        <div class="history-info-right">';
            inner_table += '            <p>' + prettify_count(number_of_searches) + '</p>';
            inner_table += '        </div>';
            inner_table += '        <div class="clear"></div>';
            inner_table += '    </div>';
            inner_table += '</div>';
        }
    }
    
    // Return the table
    return inner_table;
}

//
// Checks if a month has any searches at all
//

function check_month_count(year, month) {
    // Loop all the days in the month
    for (var i = 1; i <= days_in_month(year, month); i++) {
        // First populate
        populate_data(year, month, i);
        
        // Get number of seaches for this day
        if (get_number_of_searches(year, month, i) != 0) {
            // Searches found, return true
            return true;
        }
    }
    
    // This month has no searches
    return false;
}

//
// Returns the number of searches for a full month
//

function get_month_count(year, month) {
    // For storing the total value
    var num = 0;
    
    // Loop all the days in the month
    for (var i = 1; i <= new Date(year, month, 0).getDate(); i++) {
        // Add each day
        num += get_number_of_searches(year, month, i);
    }
    
    // Return the full number
    return num;
}

//
// jQuery ready
//

$(document).ready(function () {
    //
    // Toggle show/hide
    //
    
    $('#history').on('click', '.history-top-block > .history-info', function () {
        // Storing references
        var $that = $(this);
        var $caret = $that.find('i');
        
        // Check if we should hide or show
        if ($caret.hasClass('fa-caret-right')) {
            // Show
            $caret.removeClass('fa-caret-right');
            $caret.addClass('fa-caret-down');
            $that.parent().addClass('open');
        }
        else {
            // Hide
            $caret.removeClass('fa-caret-down');
            $caret.addClass('fa-caret-right');
            $that.parent().removeClass('open');
        }
    });
    
    //
    // Run!
    //
    
    init();
});
