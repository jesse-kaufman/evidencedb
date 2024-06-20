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

  $("body .transcript .line").on("click", (e): void => {
    let timestamp;
    let h;
    let m;
    let s;
    const time = $(e.currentTarget).children(".time").html();
    const video = <HTMLVideoElement>(
      $(e.currentTarget).closest(".evidenceItem").find("video")[0]
    );
    console.log(video);
    const isVideoPlaying = Boolean(
      video.currentTime > 0 &&
        !video.paused &&
        !video.ended &&
        video.readyState > 2
    );

    if (time.match(/\d\d:\d\d:\d\d/)) {
      h = parseInt(time.split(":")[0]);
      m = parseInt(time.split(":")[1]);
      s = parseInt(time.split(":")[2]);
    } else {
      h = 0;
      m = parseInt(time.split(":")[0]);
      s = parseInt(time.split(":")[1]);
    }

    timestamp = h * 3600 + m * 60 + s;

    // Set the video player to the requested timestamp
    video.currentTime = timestamp;

    // If the video is not playing, play the video.
    if (!isVideoPlaying) video.play();
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
  }
};

/**
 * Initializes the necessary event listeners and functions for the application.
 */
$(async (): Promise<void> => {
  /**
   * Attaches an event listener to the 'select' elements,
   * triggering a form submission when their value changes.
   */
  $("select").on("change", () => $("form").trigger("submit"));

  // Highlights matching messages based on the input query.
  highlightSearch();

  // Sets up the event listeners for the transcript links.
  setupTranscript();
});
