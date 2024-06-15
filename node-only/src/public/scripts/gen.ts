/**
 * Sets up the event listeners for the transcript links.
 */
const setupTranscript = (): void => {
  $("body.list .transcript h2").on("click", (e) => {
    if ($(e.currentTarget).parent().hasClass("show")) {
      // Hide transcript
      $(e.currentTarget).parent().removeClass("show");
    } else {
      // Show transcript
      $(e.currentTarget).parent().addClass("show");
    }
  });
};

const wrapSearchTerm = (e: HTMLElement, term: string): void => {
  $(e).html().replace(new RegExp(term, "ig"), "<mark>$&</mark>");
};

/**
 * Searches the message list for the input query and highlights the matching text.
 */
const highlightSearch = (): void => {
  const term = $("input[name=query]")?.val()?.toString() ?? "";

  // Do search if term is set
  if (term) {
    $("#message_list .message")
      .children(".body")
      .each((i, e): void => wrapSearchTerm(e, term));

    // Setup transcript link events
    setupTranscript();
  }
};

/**
 * Initializes the necessary event listeners and functions for the application.
 */
$((): void => {
  /**
   * Attaches an event listener to the 'select' elements,
   * triggering a form submission when their value changes.
   */
  $("select").on("change", () => $("form").trigger("submit"));

  // Sets up the event listeners for the transcript links.
  setupTranscript();

  // Highlights matching messages based on the input query.
  highlightSearch();
});
