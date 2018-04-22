function getData() {
    var times = document.getElementsByTagName("time");

    return {
        "from_time": times[0].dateTime,
        "to_time": times[1].dateTime,
        "title": document.getElementsByClassName("field-name-title")[0].textContent.trim(),
        "track": document.getElementsByClassName("field-name-field-session-track-ref")[0].textContent.trim()
    }
}

function testRPC() {
    console.log("rpc works");
}

