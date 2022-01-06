// index.js
// by Preston Hager

/* Change these values ONLY */

const LEVEL_SIZES = {
  "easy": [4, 5],
  "normal": [7, 10],
  "hard": [10, 15]
};

const COLOR_MAP = {
  "blue": "#262ceb",
  "green": "#38b833",
  "red": "#d11919",
  "yellow": "#e8e23f"
};

const KEY_VALUES = "#@TL";

/* DO NOT change below this line */

let selected_color = null;

$("#select-level-size").change((e) => {
  let size = LEVEL_SIZES[$(e.target).val()];
  $("#input-level-size-x").val(size[0]);
  $("#input-level-size-y").val(size[1]);
});

$("#button-update-map").click((e) => {
  create_gamemap();
});

$("#button-generate-file").click((e) => {
  // Generate the JSON file
  let size = [parseInt($("#input-level-size-x").val()), parseInt($("#input-level-size-y").val())];
  let map = {
    "size": size,
    "board": [],
    "key": {},
    "name": $("#input-level-name").val()
  };
  let key_index = 0;
  let reverse_key = {};
  for (let j=0; j<size[1]; j++) {
    let board_string = "";
    for (let i=0; i<size[0]; i++) {
      // Get the tile color
      let tile_color = $(`#tile-${i}-${j}`).attr("tile-color")
      if (tile_color === undefined) {
        continue;
      }
      // Check for it in the key
      if (Object.values(map.key).indexOf(tile_color) == -1) {
        // If it doesn't exist yet then create it in the key
        map.key[KEY_VALUES[key_index]] = tile_color;
        key_index += 1;
        reverse_key = Object.fromEntries(Object.entries(map.key).map(a => a.reverse()));
      }
      // Add the tile to the board string
      board_string += reverse_key[tile_color];
    }
    map.board.push(board_string);
  }
  console.log(map);
  // Download the JSON file
  let a = document.createElement("a");
  let file = new Blob([JSON.stringify(map, null, 4)], {type: 'text/plain'});
  a.href = URL.createObjectURL(file);
  a.download = `Level ${$("#input-level-number").val()}.json`;
  a.click();
});

$(".button-select-color").click((e) => {
  let color = $(e.target).text();
  selected_color = color;
  $("#selected-color").text(color);
});

$(document).ready((e) => {
  // Load the gamemap.
  create_gamemap();
});

function create_gamemap() {
  let size = [parseInt($("#input-level-size-x").val()), parseInt($("#input-level-size-y").val())];
  let gamemap = $("#gamemap");
  gamemap.empty();
  for (let j=0; j<size[1]; j++) {
    for (let i=0; i<size[0]; i++) {
      // Create tile
      let tile = $(`<div id="tile-${i}-${j}" class="tile"/>`);
      tile.css({"width": `${30/size[1]}em`, "height": `${30/size[1]}em`});
      gamemap.append(tile);
    }
    gamemap.append($("<br />"))
  }

  // We must rebind any new tiles after they exist
  $(".tile").click((e) => {
    let tile = $(e.target);
    tile.attr("tile-color", selected_color);
    tile.css("background-color", COLOR_MAP[selected_color]);
  });
}
