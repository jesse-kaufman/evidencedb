/**
 * Sets up the event listeners for the transcript links.
 */
const setupTranscript = () => {
    $(".transcript h1").on("click", (e) => {
        if ($(e.currentTarget).parent().hasClass("show")) {
            // Hide transcript
            $(e.currentTarget).parent().removeClass("show");
        }
        else {
            // Show transcript
            $(e.currentTarget).parent().addClass("show");
        }
    });
};
/**
 * Initializes the necessary event listeners and functions for the application.
 */
$(function () {
    /**
     * Attaches an event listener to the 'select' elements,
     * triggering a form submission when their value changes.
     */
    $("select").on("change", () => $("form").trigger("submit"));
    // Sets up the event listeners for the transcript links.
    setupTranscript();
    // Highlights matching messages based on the input query.
    hl_search();
});
function hl_clear() {
    $("#message_list .message .body").html((i, e) => $(e).html().replace("<mark>", "").replace("</mark>", ""));
    // Setup transcript link events.
    setupTranscript();
}
/**
 * Searches the message list for the input query and highlights the matching text.
 */
function hl_search() {
    var _a, _b, _c;
    const term = (_c = (_b = (_a = $("input[name=query]")) === null || _a === void 0 ? void 0 : _a.val()) === null || _b === void 0 ? void 0 : _b.toString()) !== null && _c !== void 0 ? _c : "";
    // Do search if term is set
    if (term !== "") {
        $("#message_list .message")
            .children(".body")
            .each((i, e) => {
            $(e).html($(e).html().replace(new RegExp(term, "ig"), "<mark>$&</mark>"));
        });
        // Setup transcript link events
        setupTranscript();
    }
}
