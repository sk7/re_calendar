function getData() {
    var times = document.getElementsByTagName("time");

    return {
        "start": times[0].dateTime,
        "end": times[1].dateTime,
        "title": document.getElementsByClassName("field-name-title")[0].textContent.trim(),
        "track": document.getElementsByClassName("field-name-field-session-track-ref")[0].textContent.trim(),
        "room": document.getElementsByClassName("field-name-field-session-room")[0].textContent.trim(),
    }
}

function testRPC() {
    console.log("rpc works");
}

