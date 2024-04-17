const compairWidget = document.getElementsByClassName("compair_widget")[0];
const valueRows = document.getElementsByClassName("value_row");
const team1_element = document.getElementById("team1");
const team2_element = document.getElementById("team2");

const cloneRow = document.getElementById("clone_row");

let valid_entries;
let scouting_data;
let team1, team2;
let team1_data, team2_data;

async function main() {
	function calcDifs() {
		for (let i = 1; i < compairWidget.children.length; i++) {
			let child = compairWidget.children[i];
			if (child.children[1] === "-" || child.children[2] === "-") {
				child.children[3].textContent = "N/A";
			} else {
				let temp =
					child.children[2].textContent - child.children[1].textContent;
				temp = ((temp / child.children[1].textContent) * 100).toFixed(2);
				if (child.children[1].textContent > child.children[2].textContent) {
					child.children[3].className = "hi_val";
					temp = child.children;
				} else if (
					child.children[1].textContent < child.children[2].textContent
				) {
					child.children[3].className = "low_val";
				} else {
					child.children[3].className = "label";
				}
				child.children[3].textContent = temp;
			}
		}
	}

	function updateTeam1Data() {
		resetTableValues(1);
		team1 = this.value;
		team1_data = getTeamScoutData(team1);

		let avg_val = {};
		for (let i = 0; i < team1_data.length; i++) {
			for (let [key, val] of Object.entries(team1_data[i])) {
				if (valid_entries.indexOf(key) !== -1) {
					if (key in avg_val) {
						avg_val[key].push(val);
					} else {
						avg_val[key] = [val];
					}
				}
			}
		}

		for (let [key, val] of Object.entries(avg_val)) {
			let sum = 0;

			val.forEach((number) => {
				sum += number;
			});
			avg_val[key] = sum / val.length;
		}

		for (let i = 1; i < compairWidget.children.length; i++) {
			compairWidget.children[i].children[1].textContent =
				avg_val[compairWidget.children[i].children[0].textContent];
		}

		calcDifs();
	}

	function updateTeam2Data() {
		resetTableValues();
		team2 = this.value;
		team2_data = getTeamScoutData(team2);
		console.log(team2_data);
	}

	async function resetTableValues(column) {
		for (let i = 1; i < valueRows.length; i++) {
			valueRows[i].children[column].textContent = "-";
			valueRows[i].children[column].className = "label";
		}
	}
	await resetTableValues(0);
	await resetTableValues(1);
	await resetTableValues(2);
	await resetTableValues(3);
	scouting_data = await updateScoutingData();
	valid_entries = await getEntries();

	for (let i = 1; i < valid_entries.length; i++) {
		var clone = compairWidget.children[1].cloneNode(true);
		clone.children[0].textContent = valid_entries[i];
		clone.children[2].textContent = 1;
		compairWidget.appendChild(clone);
	}
	compairWidget.children[1].remove();

	team1_element.addEventListener("change", updateTeam1Data);
	team2_element.addEventListener("change", updateTeam2Data);
}

main();
