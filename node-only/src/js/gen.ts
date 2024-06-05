/**
 * Sets up the event listeners for the transcript links.
 */
const setupTranscript = (): void => {
  $(".transcript h1").on("click", (e) => {
    if ($(e.currentTarget).parent().hasClass("show")) {
      // Hide transcript
      $(e.currentTarget).parent().removeClass("show");
    } else {
      // Show transcript
      $(e.currentTarget).parent().addClass("show");
    }
  });
};

/**
 * Initializes the necessary event listeners and functions for the application.
 */
$(function (): void {
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

function hl_clear(): void {
  $("#message_list .message .body").html((i, e): string =>
    $(e).html().replace("<mark>", "").replace("</mark>", "")
  );
  // Setup transcript link events.
  setupTranscript();
}

/**
 * Searches the message list for the input query and highlights the matching text.
 */
function hl_search(): void {
  const term = $("input[name=query]")?.val()?.toString() ?? "";

  // Do search if term is set
  if (term !== "") {
    $("#message_list .message")
      .children(".body")
      .each((i, e): void => {
        $(e).html(
          $(e).html().replace(new RegExp(term, "ig"), "<mark>$&</mark>")
        );
      });

    // Setup transcript link events
    setupTranscript();
  }
}
