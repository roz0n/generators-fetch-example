let servedRequests = 0;
let hasErrored = false;

// Build UI
function render() {
  const body = document.querySelector("main");
  const container = document.createElement("div");
  const button = document.createElement("button");  
  const rule = document.createElement("hr");
  const text = document.createTextNode(`Served ${servedRequests} requests`);
  const error = document.createTextNode(`Error fetching data`);

  if (hasErrored) {
    container.appendChild(error);
  } else {            
      container.appendChild(text);
      container.appendChild(rule);
      container.appendChild(button);

      button.innerHTML = "Get data";
      button.addEventListener("click", async () => {
          return await dataGenerator.next().then(() => render());
      });
  }

  if (body.hasChildNodes()) body.innerHTML = "";
  body.appendChild(container);
}

async function* getData() {
  // Get reddit soccer -> football -> baseball data in that order
  let soccerData, footballData, baseballData;

  try {
    soccerData = await fetch(`https://www.reddit.com/r/soccer.json`).then(res => res.json());
    servedRequests++;
    yield soccerData;

    footballData = await fetch(`https://www.reddit.com/r/nfl.json`).then(res => res.json());
    servedRequests++;
    yield footballData;

    baseballData = await fetch(`https://www.reddit.com/r/baseball.json`).then(res => res.json());
    servedRequests++;
    yield baseballData;
  } catch (error) {
    hasErrored = true;
    console.error(`Error fetching data`, error);
  }
}

// Use generator
const dataGenerator = getData();

// Start app
(() => {
  render();
})();