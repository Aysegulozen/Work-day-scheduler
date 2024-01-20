$(document).ready(function () {
    // Display current date and time
    $('#currentDay').text(moment().format("dddd, MMMM Do "));
    
    // Generate time blocks and insert saved local storage data
    function generateTimeBlocks() {
        var hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    
        $.each(hours, function (index, hour) {
            // console.log(hour);
            var currentTimeBlock = moment().hour(hour);
            var eventKey = 'hour' + hour;
            var savedEvent = JSON.parse(localStorage.getItem(eventKey)) || "";


            // console.log(savedEvent);
            var timeBlockHTML = `<div class='row'>
                <div class='col-2 hour text-right' id='hour${hour}'><span>${currentTimeBlock.format("h A")}</span></div>
                <div class='col-8 event-group' id='timeblock${hour}'><textarea class='events col-12' id='eventblock${hour}'>${savedEvent}</textarea></div>
                <div class='col-2 save-delete' id='save-delete${hour}'>
                <button class='save-btn' data-hour='${hour}'><i class='fas fa-save' title='Save Event'></i> Save</button>
                </div>
            </div>`;

            $(".container").append(timeBlockHTML);
        });
    }

    // Color-code each time block based on past, present, and future when the time block is viewed.
    function auditTimeBlocks() {
        $(".event-group").each(function (index, element) {
            var currentTime = moment();
            var currentHour = moment().hour(9 + index);
            var $timeBlock = $(element);

            $timeBlock.removeClass("past present future");

            if (currentTime.isBetween(currentHour, currentHour.clone().add(1, 'hour'))) {
                $timeBlock.addClass("present");
            } else if (currentTime.isAfter(currentHour)) {
                $timeBlock.addClass("past");
            } else {
                $timeBlock.addClass("future");
            }
        });
    }

    // Save event to local storage
    function saveEvent(hour, event) {
        var eventKey = 'hour' + hour;
        localStorage.setItem(eventKey, JSON.stringify(event));
    }
    // Restore data from local storage
    function restoreData() {
        $(".event-group").each(function (index, element) {
            var hour = 9 + index;
            var eventKey = 'hour' + hour;
            var savedEvent = JSON.parse(localStorage.getItem(eventKey)) || "";
            $(element).find('.events').val(savedEvent);
        });
    }
    // Event listener for save button
    $(".container").on("click", ".save-btn", function () {
        var hour = $(this).data('hour');
        var event = $(this).closest('.row').find('.events').val().trim();
        saveEvent(hour, event);
    });

    generateTimeBlocks();
    restoreData();
    auditTimeBlocks();
    // Set interval to audit time blocks every minute
    setInterval(auditTimeBlocks, 60000);
});