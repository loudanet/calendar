$(() => {
  $("button").on("click", (event) => {
    $(event.target).addClass("active");
    setTimeout(() => {
      $(event.target).removeClass("active");
    }, 1100);
  });
});

document.addEventListener("mousemove", (event) => {
  const x = event.pageX;
  const y = event.pageY;
  $("#x-axis-line").css("top", `${y}px`);
  $("#y-axis-line").css("left", `${x}px`);
});