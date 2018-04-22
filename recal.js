function getData() {
    var times = document.getElementsByTagName('time');

    var room = document.querySelector('.field-name-field-session-room').textContent.trim();

    var title = document.querySelector('.field-name-title').textContent.trim();

    // make description
    var description = "";
    var track = document.querySelector('.field-name-field-session-track-ref');
    if (track) description += "Track: " + track.textContent.trim() + "\n";

    var topic = document.querySelector('.field-name-field-topic');
    if (topic) description += "Topic: " + topic.textContent.trim() + "\n";

    var speakers = document.querySelectorAll('.field-name-field-session-speaker a');
    if (speakers) description += "Speakers: " + Array.from(speakers).map(a => a.textContent).join(', '); + "\n";

    var moderator = document.querySelector('.field-name-field-moderator');
    if (moderator) description += "Moderator: " + moderator.textContent.trim() + "\n";

    var short_thesis = document.querySelector('.field-name-field-session-short-thesis .field__items');
    if (short_thesis) description += "\nShort Thesis: " + short_thesis.textContent.trim();

    return {
        'start': times[0].dateTime,
        'end': times[1].dateTime,
        'location': room,
        'title': title,
        'description': description
    }
}

function testRPC() {
    console.log("rpc works");
}

