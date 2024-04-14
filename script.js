let team_name;
let team_number;
let team_events;

let currentDate = new Date();
let year = currentDate.getFullYear();
let index = 1;

let option_template;
let new_option;
let current_data;

let scouting_data;

var team_number_element = document.getElementById("team_input");
var team_name_element = document.getElementById("team_name");
var team_rank_element = document.getElementById("team_rank");
var team_opr_element = document.getElementById("team_opr");
var team_epa_element = document.getElementById("team_epa");
var team_event_picker = document.getElementById("team_event_picker");

const APIKey =
	"UVsAfK9zInMmgPxhfmdEvqPThM51zgyZL7sP6mLFRTPAZtvzbwFyL6yifjbnvcbU";

async function requestBlueAllianceAPI(url, apiKey) {
	try {
		const response = await fetch(url, {
			headers: { "X-TBA-Auth-Key": apiKey },
		});

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

function addEventsToList(event) {
	new_option = option_template.cloneNode();
	new_option.id = index;
	new_option.textContent = event.name;
	new_option.value = event.key;
	team_event_picker.appendChild(new_option);

	index += 1;
}

function resetStats() {
	team_rank_element.textContent = "-";
	team_opr_element.textContent = "-";
	team_epa_element.textContent = "-";
}

// Function to fetch team information from Blue Alliance API
async function fetchTeamInfo() {
	updateScoutingData();
	scouting_data = getTeamScoutData(team_number);
	// API endpoint for team information
	const team_info_url = `https://www.thebluealliance.com/api/v3/team/frc${team_number}`;
	const team_events_url = `https://www.thebluealliance.com/api/v3/team/frc${team_number}/events/${year}`;

	resetStats();

	try {
		current_data = await requestBlueAllianceAPI(team_info_url, APIKey);
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
		current_data = await requestBlueAllianceAPI(team_events_url, APIKey);
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
		current_data = await requestBlueAllianceAPI(event_rank_url, APIKey);
	} catch (error) {
		console.error(error);
		team_rank_element.textContent = "N/A";
	}
	if (!current_data) {
		team_rank_element.textContent = "N/A";
	} else {
		ranking = current_data.rankings.find(
			(rank) => rank.team_key === `frc${team_number}`,
		).rank;
		team_rank_element.textContent = `${ranking}`;
	}

	try {
		current_data = await requestBlueAllianceAPI(event_opr_url, APIKey);
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
		current_data = await requestBlueAllianceAPI(event_epa_url, APIKey);
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

async function updateScoutingData() {
	//TODO: put code here to get scouting data from website
	return {
		data: [
			{
				primary_key: "118-2024txcmp1_qm1-blue1-Saragh E",
				frc_team: "118",
				event_key: "2024txcmp1",
				match_key: "2024txcmp1_qm1",
				driver_station: "blue1",
				comp_level: "qm",
				match_number: 1,
				auto_moved: "Yes", // important value
				auto_amp: 0, // important value
				auto_speaker: 2, // important value
				auto_midfield_pickups: 1,
				tele_amp: 3, // important value
				tele_amp_miss: 0, // important value
				tele_speaker: 2, // important value
				tele_speaker_miss: 5, // important value
				tele_trap: 1, // important value
				tele_climb: "Climb", // important value
				defender_rating: 0,
				mech_failure: " ",
				scouted_by: "Saragh E",
				tele_assist: 4, // important value
			},
		],
	};
}

function getTeamScoutData(team_num) {
	// return scouting_data.filter((matchData) => matchData.frc_team == team_num);
}

scouting_data = updateScoutingData();
team_number_element.addEventListener("keypress", function (e) {
	if (e.code == "Enter") {
		team_number = team_number_element.value;
		fetchTeamInfo();
	}
});
team_event_picker.onchange = fetchEventInfo;
