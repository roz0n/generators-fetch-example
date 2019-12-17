let servedRequests = 0;
let hasErrored = false;
let hasCompleted = false;
let requestedData = {};
let generator = null;

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
      return await generator.next().then(data => {
        const subreddit = data.value && data.value.data.children[0]["data"]["subreddit"];
        subreddit && (requestedData[subreddit] = data.value);

        if (data.done) {
          hasCompleted = true;
          console.info(
            `Successfully fetched data from ${servedRequests} sources`,
            requestedData
          );
        }

        render();
      });
    });
  }

  if (body.hasChildNodes()) body.innerHTML = "";

  if (hasCompleted) {
    const completedContainer = document.createElement("div");
    const text = document.createTextNode("All done!");

    completedContainer.appendChild(text);
    body.appendChild(completedContainer);
  } else {
    body.appendChild(container);
  }
}

async function* getData() {
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
generator = getData();

// Start app
(() => render())();