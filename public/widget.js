(function () {

  const iframe = document.createElement("iframe");

  iframe.src =
    "https://nuform-chatbot-frontend2.vercel.app";

  iframe.style.position = "fixed";
  iframe.style.bottom = "20px";
  iframe.style.right = "20px";
  iframe.style.width = "380px";
  iframe.style.height = "600px";
  iframe.style.border = "none";
  iframe.style.zIndex = "999999";
  iframe.style.background = "transparent";

  document.body.appendChild(iframe);

})();