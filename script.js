let team_number;

let option_template;
let new_option;
let current_data;

let scouting_data;
let current_stat;

var index = 1;

var team_number_element = document.getElementById("team_input");
var team_name_element = document.getElementById("team_name");
var team_rank_element = document.getElementById("team_rank");
var team_opr_element = document.getElementById("team_opr");
var team_epa_element = document.getElementById("team_epa");
var team_event_picker = document.getElementById("team_event_picker");
var graph_element = document.getElementById("graph");
var stat_picker = document.getElementById("stat_picker");

const currentDate = new Date();
const year = currentDate.getFullYear();
const APIKey = "UVsAfK9zInMmgPxhfmdEvqPThM51zgyZL7sP6mLFRTPAZtvzbwFyL6yifjbnvcbU";

setupStatPicker();
team_number_element.addEventListener("keypress", function(e) {
  if (e.code == "Enter") {
    team_number = team_number_element.value;
    fetchTeamInfo();
  }
});

team_event_picker.onchange = fetchEventInfo;
stat_picker.onchange = updateStatGraph;

window.onresize = function() {
  setup_graph(scouting_data);
}
