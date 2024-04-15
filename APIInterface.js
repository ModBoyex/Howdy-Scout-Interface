async function requestAPI(url, apiKey) {
	try {
		const response = await fetch(url, {headers: {"X-TBA-Auth-Key": apiKey}});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		return data; // Return the data directly

	} catch (error) {
		console.error(`${url} had a problem.`, error);
		throw error; // Re-throw the error to propagate it to the caller
	}
}

function resetStats() {
  team_rank_element.textContent = "-";
  team_opr_element.textContent = "-";
  team_epa_element.textContent = "-";
}

function addEventsToList(event) {
	new_option = option_template.cloneNode();
	new_option.id = index;
	new_option.textContent = event.name;
	new_option.value = event.key;
	team_event_picker.appendChild(new_option);

	index += 1;
}

// Function to fetch team information from Blue Alliance API
async function fetchTeamInfo() {
  scouting_data = await updateScoutingData();
  scouting_data = getTeamScoutData(team_number);
  setup_graph(scouting_data);

  // API endpoint for team information
  const team_info_url = `https://www.thebluealliance.com/api/v3/team/frc${team_number}`;
  const team_events_url = `https://www.thebluealliance.com/api/v3/team/frc${team_number}/events/${year}`;

  resetStats();

  try {
    current_data = await requestAPI(team_info_url, APIKey);
  } catch (error) {
    console.error(error);
    team_name_element.textContent = "N/A";
  }
  if (!current_data) {
    team_name_element.textContent = "N/A";
  } else {
    team_name_element.innerHTML = current_data.nickname;
  }

  try {
    current_data = await requestAPI(team_events_url, APIKey);
  } catch (error) {
    console.error(error);
    team_event_element.textContent = "N/A";
  }
  if (!current_data) {
    team_event_picker.textContent = "N/A";
  } else {
    option_template = document.getElementsByTagName("option")[0].cloneNode();
    while (team_event_picker.firstChild) {
      team_event_picker.firstChild.remove();
    }
    option_template.textContent = "Pick an Event";
    team_event_picker.appendChild(option_template);
    current_data.forEach(addEventsToList);
  }
}

async function fetchEventInfo() {
  // API endpoint for team information
  const event_opr_url = `https://www.thebluealliance.com/api/v3/event/${this.value}/oprs`;
  const event_rank_url = `https://www.thebluealliance.com/api/v3/event/${this.value}/rankings`;
  const event_epa_url = `https://api.statbotics.io/v3/team_event/${team_number}/${this.value}`;

  resetStats();

  try {
    current_data = await requestAPI(event_rank_url, APIKey);
  } catch (error) {
    console.error(error);
    team_rank_element.textContent = "N/A";
  }
  if (!current_data) {
    team_rank_element.textContent = "N/A";
  } else {
    ranking = current_data.rankings.find(
        (rank) => rank.team_key === `frc${team_number}`, )
      .rank;
    team_rank_element.textContent = `${ranking}`;
  }

  try {
    current_data = await requestAPI(event_opr_url, APIKey);
  } catch (error) {
    console.error(error);
    team_opr_element.textContent = "N/A";
  }
  if (!current_data) {
    team_opr_element.textContent = "N/A";
  } else {
    team_opr_element.textContent = `${Number(current_data.oprs[`frc${team_number}`].toFixed(2))}`;
  }

  try {
    current_data = await requestAPI(event_epa_url, APIKey);
  } catch (error) {
    console.error(error);
    team_epa_element.textContent = "N/A";
  }
  if (!current_data) {
    team_epa_element.textContent = "N/A";
  } else {
    team_epa_element.textContent = `${current_data.epa.stats.mean}`;
  }
}