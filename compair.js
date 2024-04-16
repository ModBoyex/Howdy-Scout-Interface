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
    function updateTeam1Data() {
        console.log(valid_entries);

        resetTableValues();
        team1 = this.value;
        team1_data = getTeamScoutData(team1);

        let avg_val = {}
        for (let i = 0; i < team1_data.length; i++) {
            for (let [key, val] of Object.entries(team1_data[i])) {
                console.log(valid_entries.indexOf(key) !== -1, key);
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

            val.forEach(number => {
                sum += number;
            });
            avg_val[key] = (sum / val.length);
        }

        console.log(avg_val);
    }

    function updateTeam2Data() {
        resetTableValues();
        team2 = this.value;
        team2_data = getTeamScoutData(team2);
        console.log(team2_data);
    }

    async function resetTableValues() {
        for (let i = 1; i < valueRows.length; i++) {
            valueRows[i].children[0].textContent = "-";
            valueRows[i].children[1].textContent = "-";
            valueRows[i].children[2].textContent = "-";
            valueRows[i].children[3].textContent = "-";
            valueRows[i].children[3].className = "label";
        }

        scouting_data = await updateScoutingData();
        valid_entries = await getEntries();
    }
    await resetTableValues();

    console.log(valid_entries);
    for (let i = 1; i < valid_entries.length; i++) {

    }

    team1_element.addEventListener("change", updateTeam1Data);
    team2_element.addEventListener("change", updateTeam2Data);
}

main();