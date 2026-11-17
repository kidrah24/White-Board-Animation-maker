export type IllustrationId =
  | "spinning_top"
  | "pills"
  | "flask_beaker"
  | "rv_van"
  | "ship_liner"
  | "iceberg"
  | "bat_emblem"
  | "lightning_bolt"
  | "glasses_scar"
  | "ring_band"
  | "volcano_mountain"
  | "lightsaber_sword"
  | "helmet_mask"
  | "rocket_spacecraft"
  | "black_hole_planet"
  | "clock_tower"
  | "sports_car"
  | "bicycle"
  | "moon_crescent"
  | "waffle_plate"
  | "monster_portal"
  | "cassette_tape"
  | "headphones"
  | "magnifying_glass"
  | "footprints"
  | "crown"
  | "throne_swords"
  | "dragon"
  | "shark_fin"
  | "dinosaur"
  | "umbrella"
  | "mask_theater"
  | "money_stack"
  | "vault_safe"
  | "television"
  | "camera_lens"
  | "newspaper"
  | "airplane"
  | "train_locomotive"
  | "bridge_city"
  | "city_skyline"
  | "house_mansion"
  | "island_palm"
  | "desert_cactus"
  | "forest_trees"
  | "ocean_waves"
  | "fire_flames"
  | "hourglass"
  | "brain_maze"
  | "eye_iris"
  | "skull_bones"
  | "sword_shield"
  | "bow_arrow"
  | "trophy_cup"
  | "microphone"
  | "chess_piece"
  | "key_lock"
  | "door_portal"
  | "letter_envelope"
  | "book_journal"
  | "prison_bars"
  | "police_badge"
  | "syringe_vial"
  | "robot_android"
  | "alien_ufo"
  | "coffee_mug"
  | "suitcase"
  | "balloon"
  | "guitar_instrument"
  | "telephone"
  | "ticket_stub"
  | "compass"
  | "heart_broken"
  | "puzzle_cube";

export interface IllustrationStrokeDef {
  d: string;
  role: "ink" | "detail" | "accent";
  width?: number;
}

// All illustrations are crafted inside a 200x200 coordinate space (x: 15..185, y: 15..185)
export const ILLUSTRATION_LIBRARY: Record<IllustrationId, IllustrationStrokeDef[]> = {
  spinning_top: [
    { d: "M 95 28 L 105 28 L 105 58 L 95 58 Z", role: "ink", width: 4 },
    { d: "M 42 74 C 42 54, 158 54, 158 74 C 158 92, 42 92, 42 74 Z", role: "ink", width: 4.5 },
    { d: "M 44 78 L 100 162 L 156 78", role: "ink", width: 4.5 },
    { d: "M 66 96 C 85 104, 115 104, 134 96", role: "detail", width: 3 },
    { d: "M 80 120 C 94 126, 106 126, 120 120", role: "detail", width: 3 },
    { d: "M 26 66 Q 16 74 28 82", role: "accent", width: 3.5 },
    { d: "M 174 66 Q 184 74 172 82", role: "accent", width: 3.5 },
    { d: "M 64 166 Q 100 178 136 166", role: "accent", width: 3.5 },
  ],
  pills: [
    { d: "M 36 105 L 68 73 A 18 18 0 0 1 94 99 L 62 131 A 18 18 0 0 1 36 105 Z", role: "ink", width: 4.5 },
    { d: "M 52 89 L 78 115", role: "ink", width: 3.5 },
    { d: "M 46 102 L 62 86", role: "accent", width: 5 },
    { d: "M 108 99 L 140 67 A 18 18 0 0 1 166 93 L 134 125 A 18 18 0 0 1 108 99 Z", role: "ink", width: 4.5 },
    { d: "M 124 83 L 150 109", role: "ink", width: 3.5 },
    { d: "M 136 106 L 152 90", role: "detail", width: 5 },
    { d: "M 88 148 Q 100 138 112 148", role: "accent", width: 3.5 },
  ],
  flask_beaker: [
    { d: "M 80 30 L 120 30", role: "ink", width: 4.5 },
    { d: "M 86 30 L 86 72 L 42 152 Q 36 165 50 168 L 150 168 Q 164 165 158 152 L 114 72 L 114 30", role: "ink", width: 4.5 },
    { d: "M 56 132 Q 80 124 100 132 T 144 132 L 152 156 Q 154 162 146 162 L 54 162 Q 46 162 48 156 Z", role: "accent", width: 4 },
    { d: "M 92 106 A 5 5 0 1 1 91.9 106 Z", role: "accent", width: 3 },
    { d: "M 108 92 A 4 4 0 1 1 107.9 92 Z", role: "accent", width: 3 },
    { d: "M 98 18 A 6 6 0 1 1 97.9 18 Z", role: "detail", width: 2.5 },
    { d: "M 70 144 L 84 144 M 112 148 L 128 148", role: "detail", width: 3 },
  ],
  rv_van: [
    { d: "M 24 134 L 24 72 Q 24 58 40 58 L 146 58 L 176 92 L 176 134 Z", role: "ink", width: 4.5 },
    { d: "M 134 58 L 134 94 L 176 94", role: "ink", width: 3.5 },
    { d: "M 42 74 L 78 74 L 78 98 L 42 98 Z", role: "detail", width: 3 },
    { d: "M 92 74 L 118 74 L 118 98 L 92 98 Z", role: "detail", width: 3 },
    { d: "M 24 110 L 176 110", role: "accent", width: 4 },
    { d: "M 54 144 A 15 15 0 1 1 53.9 144 Z", role: "ink", width: 4.5 },
    { d: "M 144 144 A 15 15 0 1 1 143.9 144 Z", role: "ink", width: 4.5 },
    { d: "M 64 56 L 64 42 M 64 36 C 54 26, 76 22, 68 12", role: "accent", width: 3.5 },
  ],
  ship_liner: [
    { d: "M 22 118 L 178 118 L 154 156 L 40 156 Z", role: "ink", width: 4.5 },
    { d: "M 46 118 L 46 96 L 150 96 L 158 118", role: "ink", width: 4 },
    { d: "M 62 96 L 62 78 L 132 78 L 138 96", role: "detail", width: 3.5 },
    { d: "M 70 78 L 74 52 L 86 52 L 88 78", role: "accent", width: 4 },
    { d: "M 100 78 L 104 52 L 116 52 L 118 78", role: "accent", width: 4 },
    { d: "M 78 44 Q 90 34 104 38 M 108 44 Q 122 32 138 36", role: "detail", width: 3 },
    { d: "M 18 164 Q 44 156 70 164 T 122 164 T 182 164", role: "accent", width: 3.5 },
  ],
  iceberg: [
    { d: "M 22 96 L 178 96", role: "accent", width: 3.5 },
    { d: "M 58 96 L 86 38 L 108 62 L 128 34 L 152 96", role: "ink", width: 4.5 },
    { d: "M 58 96 L 42 134 L 78 176 L 126 168 L 160 124 L 152 96", role: "ink", width: 4 },
    { d: "M 86 38 L 96 96 L 78 176", role: "detail", width: 3 },
    { d: "M 128 34 L 118 96 L 126 168", role: "detail", width: 3 },
  ],
  bat_emblem: [
    { d: "M 100 100 A 68 68 0 1 1 99.9 100 Z", role: "accent", width: 4 },
    {
      d: "M 100 76 L 94 64 L 90 76 C 72 78, 56 70, 44 82 C 58 92, 62 106, 52 118 C 70 110, 86 114, 100 132 C 114 114, 130 110, 148 118 C 138 106, 142 92, 156 82 C 144 70, 128 78, 110 76 L 106 64 Z",
      role: "ink",
      width: 4.5,
    },
    { d: "M 70 164 L 84 128 M 130 164 L 116 128", role: "detail", width: 3 },
  ],
  lightning_bolt: [
    { d: "M 116 24 L 54 106 L 96 106 L 78 176 L 146 88 L 102 88 Z", role: "accent", width: 5 },
    { d: "M 52 52 L 38 44 M 156 132 L 170 140 M 44 138 L 32 148", role: "ink", width: 3.5 },
  ],
  glasses_scar: [
    { d: "M 104 24 L 90 46 L 104 46 L 94 68", role: "accent", width: 4.5 },
    { d: "M 62 122 A 28 28 0 1 1 61.9 122 Z", role: "ink", width: 4.5 },
    { d: "M 138 122 A 28 28 0 1 1 137.9 122 Z", role: "ink", width: 4.5 },
    { d: "M 90 120 Q 100 112 110 120", role: "ink", width: 4 },
    { d: "M 22 114 L 34 120 M 166 120 L 178 114", role: "detail", width: 3.5 },
  ],
  ring_band: [
    { d: "M 100 48 A 54 54 0 1 1 99.9 48 Z", role: "accent", width: 6 },
    { d: "M 100 64 A 38 38 0 1 1 99.9 64 Z", role: "ink", width: 3.5 },
    { d: "M 100 22 L 100 34 M 148 44 L 158 34 M 52 44 L 42 34", role: "accent", width: 3.5 },
    { d: "M 74 102 Q 100 116 126 102", role: "detail", width: 2.5 },
  ],
  volcano_mountain: [
    { d: "M 24 166 L 76 68 L 124 68 L 176 166 Z", role: "ink", width: 4.5 },
    { d: "M 76 68 Q 100 76 124 68", role: "ink", width: 4 },
    { d: "M 86 72 L 78 114 L 96 104 L 104 130 L 116 96 L 114 72", role: "accent", width: 4 },
    { d: "M 78 54 C 66 36, 92 22, 104 34 C 118 22, 140 38, 126 54", role: "detail", width: 3.5 },
  ],
  lightsaber_sword: [
    { d: "M 42 158 L 76 124 L 86 134 L 52 168 Z", role: "ink", width: 4.5 },
    { d: "M 64 136 L 74 146", role: "detail", width: 3 },
    { d: "M 82 128 L 164 46", role: "accent", width: 7 },
    { d: "M 152 34 L 162 24 M 176 58 L 186 48 M 136 52 L 146 42", role: "accent", width: 3 },
  ],
  helmet_mask: [
    { d: "M 54 100 C 52 44, 148 44, 146 100 L 166 146 L 126 158 L 100 144 L 74 158 L 34 146 Z", role: "ink", width: 4.5 },
    { d: "M 100 46 L 100 116", role: "detail", width: 3 },
    { d: "M 68 98 L 92 104 L 88 114 L 66 110 Z", role: "accent", width: 4 },
    { d: "M 132 98 L 108 104 L 112 114 L 134 110 Z", role: "accent", width: 4 },
    { d: "M 86 128 L 100 118 L 114 128 Z", role: "ink", width: 3.5 },
  ],
  rocket_spacecraft: [
    { d: "M 100 22 C 124 46, 130 92, 122 132 L 78 132 C 70 92, 76 46, 100 22 Z", role: "ink", width: 4.5 },
    { d: "M 78 108 L 54 138 L 78 132", role: "accent", width: 4 },
    { d: "M 122 108 L 146 138 L 122 132", role: "accent", width: 4 },
    { d: "M 100 64 A 12 12 0 1 1 99.9 64 Z", role: "ink", width: 4 },
    { d: "M 86 134 L 100 174 L 114 134", role: "accent", width: 4 },
    { d: "M 70 168 Q 100 156 130 168", role: "detail", width: 3 },
  ],
  black_hole_planet: [
    { d: "M 100 66 A 34 34 0 1 1 99.9 66 Z", role: "ink", width: 5 },
    { d: "M 22 100 C 42 74, 158 74, 178 100 C 158 126, 42 126, 22 100 Z", role: "accent", width: 4 },
    { d: "M 42 100 C 66 86, 134 86, 158 100", role: "detail", width: 2.5 },
    { d: "M 36 46 L 44 46 M 40 42 L 40 50 M 156 152 L 164 152 M 160 148 L 160 156", role: "accent", width: 3 },
  ],
  clock_tower: [
    { d: "M 66 174 L 66 64 L 100 26 L 134 64 L 134 174 Z", role: "ink", width: 4.5 },
    { d: "M 100 78 A 22 22 0 1 1 99.9 78 Z", role: "ink", width: 4 },
    { d: "M 100 84 L 100 100 L 114 100", role: "accent", width: 4 },
    { d: "M 82 138 L 118 138 M 82 154 L 118 154", role: "detail", width: 3 },
    { d: "M 42 42 L 54 50 M 158 42 L 146 50", role: "accent", width: 3 },
  ],
  sports_car: [
    { d: "M 24 128 L 32 104 L 66 96 L 94 74 L 142 74 L 170 102 L 178 128 Z", role: "ink", width: 4.5 },
    { d: "M 72 96 L 96 78 L 136 78 L 156 96 Z", role: "detail", width: 3 },
    { d: "M 54 130 A 15 15 0 1 1 53.9 130 Z", role: "ink", width: 4.5 },
    { d: "M 146 130 A 15 15 0 1 1 145.9 130 Z", role: "ink", width: 4.5 },
    { d: "M 18 112 L 38 112 M 16 122 L 30 122", role: "accent", width: 3.5 },
    { d: "M 92 74 L 74 44 L 110 64", role: "accent", width: 3.5 },
  ],
  bicycle: [
    { d: "M 48 112 A 26 26 0 1 1 47.9 112 Z", role: "ink", width: 4.5 },
    { d: "M 152 112 A 26 26 0 1 1 151.9 112 Z", role: "ink", width: 4.5 },
    { d: "M 48 138 L 94 138 L 132 88 L 76 88 Z", role: "accent", width: 4 },
    { d: "M 94 138 L 72 72 L 60 72", role: "ink", width: 4 },
    { d: "M 152 138 L 128 66 L 146 62", role: "ink", width: 4 },
  ],
  moon_crescent: [
    { d: "M 118 34 A 62 62 0 1 0 156 142 A 48 48 0 1 1 118 34 Z", role: "ink", width: 4.5 },
    { d: "M 134 56 L 142 56 M 138 52 L 138 60", role: "accent", width: 3.5 },
    { d: "M 158 88 L 168 88 M 163 83 L 163 93", role: "accent", width: 3.5 },
    { d: "M 70 86 A 8 8 0 1 1 69.9 86 Z", role: "detail", width: 2.5 },
  ],
  waffle_plate: [
    { d: "M 100 34 A 66 66 0 1 1 99.9 34 Z", role: "ink", width: 4.5 },
    { d: "M 54 78 L 146 78 M 48 100 L 152 100 M 54 122 L 146 122", role: "detail", width: 3 },
    { d: "M 78 54 L 78 146 M 100 48 L 100 152 M 122 54 L 122 146", role: "detail", width: 3 },
    { d: "M 88 86 L 114 86 L 114 112 L 88 112 Z", role: "accent", width: 4 },
  ],
  monster_portal: [
    { d: "M 100 28 C 128 48, 128 152, 100 172 C 72 152, 72 48, 100 28 Z", role: "accent", width: 5 },
    { d: "M 100 28 L 92 78 L 108 116 L 96 170", role: "ink", width: 3.5 },
    { d: "M 42 56 Q 66 80 82 96 M 42 138 Q 66 118 82 104", role: "ink", width: 3.5 },
    { d: "M 158 56 Q 134 80 118 96 M 158 138 Q 134 118 118 104", role: "ink", width: 3.5 },
  ],
  cassette_tape: [
    { d: "M 26 54 L 174 54 L 174 146 L 26 146 Z", role: "ink", width: 4.5 },
    { d: "M 42 70 L 158 70 L 158 114 L 42 114 Z", role: "detail", width: 3 },
    { d: "M 70 80 A 12 12 0 1 1 69.9 80 Z", role: "accent", width: 4 },
    { d: "M 130 80 A 12 12 0 1 1 129.9 80 Z", role: "accent", width: 4 },
    { d: "M 48 146 L 58 126 L 142 126 L 152 146", role: "ink", width: 3.5 },
  ],
  headphones: [
    { d: "M 44 112 C 44 46, 156 46, 156 112", role: "ink", width: 5 },
    { d: "M 34 104 L 54 104 L 54 152 L 34 152 Z", role: "accent", width: 4.5 },
    { d: "M 146 104 L 166 104 L 166 152 L 146 152 Z", role: "accent", width: 4.5 },
    { d: "M 88 128 L 88 94 L 116 88 L 116 122", role: "detail", width: 3.5 },
    { d: "M 80 128 A 8 6 0 1 1 79.9 128 Z M 108 122 A 8 6 0 1 1 107.9 122 Z", role: "detail", width: 3.5 },
  ],
  magnifying_glass: [
    { d: "M 86 38 A 46 46 0 1 1 85.9 38 Z", role: "ink", width: 5 },
    { d: "M 86 50 A 34 34 0 1 1 85.9 50 Z", role: "accent", width: 3 },
    { d: "M 118 118 L 166 166", role: "ink", width: 8 },
    { d: "M 66 66 Q 76 58 92 62", role: "detail", width: 3 },
  ],
  footprints: [
    { d: "M 54 134 C 46 114, 70 104, 76 124 C 78 136, 58 142, 54 134 Z", role: "ink", width: 4 },
    { d: "M 58 148 L 76 146 L 74 162 L 58 162 Z", role: "ink", width: 3.5 },
    { d: "M 122 68 C 114 48, 138 38, 144 58 C 146 70, 126 76, 122 68 Z", role: "accent", width: 4 },
    { d: "M 126 82 L 144 80 L 142 96 L 126 96 Z", role: "accent", width: 3.5 },
    { d: "M 88 112 Q 100 96 114 88", role: "detail", width: 3 },
  ],
  crown: [
    { d: "M 32 140 L 42 64 L 74 102 L 100 46 L 126 102 L 158 64 L 168 140 Z", role: "ink", width: 4.5 },
    { d: "M 32 154 L 168 154", role: "ink", width: 5 },
    { d: "M 100 36 A 6 6 0 1 1 99.9 36 Z", role: "accent", width: 4 },
    { d: "M 42 54 A 5 5 0 1 1 41.9 54 Z M 158 54 A 5 5 0 1 1 157.9 54 Z", role: "accent", width: 3.5 },
    { d: "M 64 124 L 74 114 L 84 124 L 74 134 Z M 116 124 L 126 114 L 136 124 L 126 134 Z", role: "accent", width: 3 },
  ],
  throne_swords: [
    { d: "M 70 156 L 70 64 L 100 34 L 130 64 L 130 156 Z", role: "ink", width: 4 },
    { d: "M 54 120 L 146 120 L 146 164 L 54 164 Z", role: "ink", width: 4.5 },
    { d: "M 36 44 L 164 164", role: "accent", width: 4.5 },
    { d: "M 164 44 L 36 164", role: "accent", width: 4.5 },
    { d: "M 100 22 L 100 116", role: "detail", width: 3 },
  ],
  dragon: [
    { d: "M 58 146 C 46 116, 78 90, 96 64 L 124 44 L 144 56 L 122 72 L 132 104 L 104 156 Z", role: "ink", width: 4.5 },
    { d: "M 78 90 C 44 64, 30 40, 56 30 C 70 46, 82 64, 92 78", role: "ink", width: 4 },
    { d: "M 144 54 C 166 56, 178 46, 184 62 C 170 72, 162 66, 146 66", role: "accent", width: 4.5 },
    { d: "M 122 52 A 3 3 0 1 1 121.9 52 Z", role: "accent", width: 3 },
  ],
  shark_fin: [
    { d: "M 64 130 C 72 80, 102 48, 128 38 C 118 76, 122 104, 138 130 Z", role: "ink", width: 4.5 },
    { d: "M 22 134 Q 52 120 82 134 T 142 134 T 182 134", role: "accent", width: 4 },
    { d: "M 34 154 Q 68 144 102 154 T 170 154", role: "detail", width: 3 },
  ],
  dinosaur: [
    { d: "M 48 156 L 64 114 C 66 86, 84 68, 108 56 L 116 32 L 160 32 L 164 56 L 134 60 L 162 72 L 130 78 L 116 118 L 124 156", role: "ink", width: 4.5 },
    { d: "M 64 114 L 30 132 L 56 132", role: "ink", width: 4 },
    { d: "M 128 42 A 4 4 0 1 1 127.9 42 Z", role: "accent", width: 3.5 },
    { d: "M 134 60 L 140 66 L 146 60 L 152 66", role: "accent", width: 2.5 },
  ],
  umbrella: [
    { d: "M 32 102 C 38 42, 162 42, 168 102 Q 134 90 100 102 Q 66 90 32 102 Z", role: "accent", width: 4.5 },
    { d: "M 100 44 L 100 154 C 100 172, 122 172, 122 154", role: "ink", width: 4.5 },
    { d: "M 44 36 L 38 48 M 156 34 L 150 46 M 100 24 L 100 34", role: "detail", width: 3 },
  ],
  mask_theater: [
    { d: "M 46 52 C 46 34, 154 34, 154 52 L 146 124 C 138 158, 62 158, 54 124 Z", role: "ink", width: 4.5 },
    { d: "M 70 84 Q 82 76 92 84 M 108 84 Q 118 76 130 84", role: "ink", width: 3.5 },
    { d: "M 74 120 Q 100 142 126 120", role: "accent", width: 4.5 },
    { d: "M 92 102 L 108 102 L 100 92 Z", role: "detail", width: 3 },
  ],
  money_stack: [
    { d: "M 30 68 L 170 68 L 170 124 L 30 124 Z", role: "ink", width: 4.5 },
    { d: "M 36 134 L 164 134 M 42 146 L 158 146", role: "detail", width: 3.5 },
    { d: "M 86 68 L 114 68 L 114 124 L 86 124 Z", role: "accent", width: 4 },
    { d: "M 100 84 C 90 84, 90 96, 100 96 C 110 96, 110 108, 100 108 M 100 78 L 100 114", role: "ink", width: 3 },
  ],
  vault_safe: [
    { d: "M 34 34 L 166 34 L 166 166 L 34 166 Z", role: "ink", width: 5 },
    { d: "M 50 50 L 150 50 L 150 150 L 50 150 Z", role: "detail", width: 3 },
    { d: "M 100 72 A 28 28 0 1 1 99.9 72 Z", role: "accent", width: 4 },
    { d: "M 82 100 L 118 100 M 100 82 L 100 118", role: "ink", width: 3.5 },
  ],
  television: [
    { d: "M 30 64 L 170 64 L 170 156 L 30 156 Z", role: "ink", width: 4.5 },
    { d: "M 46 80 L 132 80 L 132 140 L 46 140 Z", role: "accent", width: 4 },
    { d: "M 100 64 L 72 28 M 100 64 L 128 28", role: "ink", width: 4 },
    { d: "M 150 92 A 6 6 0 1 1 149.9 92 Z M 150 116 A 6 6 0 1 1 149.9 116 Z", role: "detail", width: 3.5 },
  ],
  camera_lens: [
    { d: "M 28 62 L 68 62 L 78 44 L 122 44 L 132 62 L 172 62 L 172 154 L 28 154 Z", role: "ink", width: 4.5 },
    { d: "M 100 74 A 34 34 0 1 1 99.9 74 Z", role: "ink", width: 4 },
    { d: "M 100 88 A 20 20 0 1 1 99.9 88 Z", role: "accent", width: 4 },
    { d: "M 146 76 A 5 5 0 1 1 145.9 76 Z", role: "accent", width: 3.5 },
  ],
  newspaper: [
    { d: "M 34 36 L 154 36 L 154 162 L 34 162 Z", role: "ink", width: 4.5 },
    { d: "M 154 58 L 170 58 L 170 156 Q 170 164 154 162", role: "detail", width: 3.5 },
    { d: "M 50 54 L 138 54 L 138 72 L 50 72 Z", role: "accent", width: 4 },
    { d: "M 50 88 L 90 88 L 90 124 L 50 124 Z", role: "ink", width: 3 },
    { d: "M 102 92 L 138 92 M 102 108 L 138 108 M 102 124 L 138 124 M 50 142 L 138 142", role: "detail", width: 3 },
  ],
  airplane: [
    { d: "M 100 24 L 112 72 L 176 112 L 176 128 L 112 106 L 112 146 L 134 164 L 134 176 L 100 164 L 66 176 L 66 164 L 88 146 L 88 106 L 24 128 L 24 112 L 88 72 Z", role: "ink", width: 4.5 },
    { d: "M 100 42 L 100 150", role: "accent", width: 3 },
  ],
  train_locomotive: [
    { d: "M 54 142 L 54 54 Q 54 38 100 38 Q 146 38 146 54 L 146 142 Z", role: "ink", width: 4.5 },
    { d: "M 68 58 L 132 58 L 132 92 L 68 92 Z", role: "accent", width: 4 },
    { d: "M 74 118 A 7 7 0 1 1 73.9 118 Z M 126 118 A 7 7 0 1 1 125.9 118 Z", role: "accent", width: 3.5 },
    { d: "M 58 142 L 36 174 M 142 142 L 164 174 M 46 160 L 154 160", role: "ink", width: 4 },
  ],
  bridge_city: [
    { d: "M 20 132 L 180 132", role: "ink", width: 5 },
    { d: "M 58 158 L 58 54 M 142 158 L 142 54", role: "ink", width: 5 },
    { d: "M 20 112 Q 38 102 58 58 Q 100 124 142 58 Q 162 102 180 112", role: "accent", width: 4 },
    { d: "M 80 100 L 80 132 M 100 106 L 100 132 M 120 100 L 120 132", role: "detail", width: 2.5 },
  ],
  city_skyline: [
    { d: "M 24 164 L 176 164", role: "ink", width: 4.5 },
    { d: "M 32 164 L 32 86 L 66 86 L 66 164", role: "ink", width: 4 },
    { d: "M 74 164 L 74 42 L 120 42 L 120 164 M 97 42 L 97 22", role: "ink", width: 4.5 },
    { d: "M 128 164 L 128 72 L 166 72 L 166 164", role: "ink", width: 4 },
    { d: "M 86 62 L 108 62 M 86 82 L 108 82 M 86 102 L 108 102 M 44 104 L 54 104 M 140 92 L 154 92", role: "accent", width: 3.5 },
  ],
  house_mansion: [
    { d: "M 34 94 L 100 34 L 166 94", role: "ink", width: 5 },
    { d: "M 48 84 L 48 164 L 152 164 L 152 84", role: "ink", width: 4.5 },
    { d: "M 86 164 L 86 118 L 114 118 L 114 164", role: "accent", width: 4 },
    { d: "M 62 100 L 82 100 L 82 120 L 62 120 Z M 118 100 L 138 100 L 138 120 L 118 120 Z", role: "detail", width: 3 },
  ],
  island_palm: [
    { d: "M 22 152 Q 56 140 90 152 T 178 152", role: "accent", width: 4 },
    { d: "M 44 146 Q 100 116 156 146", role: "ink", width: 4.5 },
    { d: "M 98 134 Q 106 96 92 66", role: "ink", width: 4.5 },
    { d: "M 92 66 Q 64 52 46 72 M 92 66 Q 74 36 58 46 M 92 66 Q 124 44 142 66 M 92 66 Q 124 72 138 90", role: "accent", width: 4 },
  ],
  desert_cactus: [
    { d: "M 24 164 L 176 164", role: "ink", width: 4 },
    { d: "M 90 164 L 90 54 A 10 10 0 0 1 110 54 L 110 164", role: "ink", width: 4.5 },
    { d: "M 90 114 L 66 114 Q 58 114 58 104 L 58 84 A 8 8 0 0 1 74 84 L 74 100 L 90 100", role: "ink", width: 4 },
    { d: "M 110 98 L 134 98 Q 142 98 142 88 L 142 68 A 8 8 0 0 0 126 68 L 126 84 L 110 84", role: "ink", width: 4 },
    { d: "M 146 34 A 14 14 0 1 1 145.9 34 Z", role: "accent", width: 4 },
  ],
  forest_trees: [
    { d: "M 24 162 L 176 162", role: "ink", width: 4 },
    { d: "M 54 144 L 30 144 L 54 96 L 38 96 L 54 56 L 70 96 L 54 96 L 78 144 Z", role: "ink", width: 4 },
    { d: "M 100 148 L 70 148 L 100 84 L 78 84 L 100 32 L 122 84 L 100 84 L 130 148 Z", role: "accent", width: 4.5 },
    { d: "M 146 144 L 126 144 L 146 100 L 132 100 L 146 64 L 160 100 L 146 100 L 166 144 Z", role: "ink", width: 4 },
    { d: "M 54 144 L 54 162 M 100 148 L 100 162 M 146 144 L 146 162", role: "ink", width: 4 },
  ],
  ocean_waves: [
    { d: "M 22 92 Q 58 64 96 92 T 178 92", role: "ink", width: 4.5 },
    { d: "M 22 126 Q 58 98 96 126 T 178 126", role: "accent", width: 4.5 },
    { d: "M 22 158 Q 58 134 96 158 T 178 158", role: "detail", width: 3.5 },
  ],
  fire_flames: [
    { d: "M 100 24 C 138 64, 158 106, 134 150 C 122 168, 78 168, 66 150 C 42 106, 62 68, 86 48 C 84 72, 102 74, 100 24 Z", role: "accent", width: 5 },
    { d: "M 100 84 C 118 106, 122 130, 108 148 C 94 156, 82 144, 86 126 C 88 112, 98 104, 100 84 Z", role: "ink", width: 4 },
  ],
  hourglass: [
    { d: "M 54 32 L 146 32 M 54 168 L 146 168", role: "ink", width: 5 },
    { d: "M 64 32 C 64 78, 94 94, 94 100 C 94 106, 64 122, 64 168", role: "ink", width: 4.5 },
    { d: "M 136 32 C 136 78, 106 94, 106 100 C 106 106, 136 122, 136 168", role: "ink", width: 4.5 },
    { d: "M 74 162 L 100 132 L 126 162 Z", role: "accent", width: 4 },
    { d: "M 100 100 L 100 132", role: "accent", width: 3 },
  ],
  brain_maze: [
    { d: "M 100 44 C 66 44, 42 68, 42 98 C 42 124, 58 144, 84 148 L 84 164 L 116 164 L 116 148 C 142 144, 158 124, 158 98 C 158 68, 134 44, 100 44 Z", role: "ink", width: 4.5 },
    { d: "M 100 44 L 100 148", role: "detail", width: 3 },
    { d: "M 64 84 Q 82 72 90 92 Q 72 110 60 102", role: "accent", width: 3.5 },
    { d: "M 136 84 Q 118 72 110 92 Q 128 110 140 102", role: "accent", width: 3.5 },
  ],
  eye_iris: [
    { d: "M 22 100 Q 100 36 178 100 Q 100 164 22 100 Z", role: "ink", width: 5 },
    { d: "M 100 68 A 32 32 0 1 1 99.9 68 Z", role: "accent", width: 4.5 },
    { d: "M 100 86 A 14 14 0 1 1 99.9 86 Z", role: "ink", width: 5 },
    { d: "M 110 86 A 4 4 0 1 1 109.9 86 Z", role: "detail", width: 2.5 },
  ],
  skull_bones: [
    { d: "M 54 114 C 46 56, 154 56, 146 114 L 130 134 L 130 160 L 70 160 L 70 134 Z", role: "ink", width: 4.5 },
    { d: "M 78 96 A 12 12 0 1 1 77.9 96 Z", role: "accent", width: 4 },
    { d: "M 122 96 A 12 12 0 1 1 121.9 96 Z", role: "accent", width: 4 },
    { d: "M 94 128 L 100 116 L 106 128 Z", role: "ink", width: 3 },
    { d: "M 86 144 L 86 160 M 100 144 L 100 160 M 114 144 L 114 160", role: "detail", width: 3 },
  ],
  sword_shield: [
    { d: "M 48 44 L 152 44 L 152 106 C 152 142, 100 170, 100 170 C 100 170, 48 142, 48 106 Z", role: "ink", width: 4.5 },
    { d: "M 100 44 L 100 170 M 48 96 L 152 96", role: "accent", width: 4 },
  ],
  bow_arrow: [
    { d: "M 66 34 C 134 54, 134 146, 66 166", role: "ink", width: 5 },
    { d: "M 66 34 L 66 166", role: "detail", width: 2.5 },
    { d: "M 42 100 L 166 100", role: "accent", width: 4.5 },
    { d: "M 148 86 L 168 100 L 148 114", role: "accent", width: 4 },
  ],
  trophy_cup: [
    { d: "M 62 36 L 138 36 L 132 96 C 128 120, 72 120, 68 96 Z", role: "accent", width: 4.5 },
    { d: "M 64 48 C 36 48, 36 88, 66 88", role: "ink", width: 4 },
    { d: "M 136 48 C 164 48, 164 88, 134 88", role: "ink", width: 4 },
    { d: "M 100 116 L 100 148 M 70 148 L 130 148 L 138 168 L 62 168 Z", role: "ink", width: 4.5 },
  ],
  microphone: [
    { d: "M 80 48 A 20 20 0 0 1 120 48 L 120 88 A 20 20 0 0 1 80 88 Z", role: "ink", width: 4.5 },
    { d: "M 80 68 L 120 68 M 100 28 L 100 108", role: "detail", width: 2.5 },
    { d: "M 66 78 C 66 122, 134 122, 134 78", role: "accent", width: 4 },
    { d: "M 100 118 L 100 162 M 74 162 L 126 162", role: "ink", width: 4.5 },
    { d: "M 46 56 Q 36 70 46 84 M 154 56 Q 164 70 154 84", role: "accent", width: 3 },
  ],
  chess_piece: [
    { d: "M 100 24 L 100 44 M 90 34 L 110 34", role: "accent", width: 4 },
    { d: "M 78 52 L 122 52 L 114 76 L 126 142 L 74 142 L 86 76 Z", role: "ink", width: 4.5 },
    { d: "M 58 142 L 142 142 L 148 164 L 52 164 Z", role: "ink", width: 4.5 },
    { d: "M 32 174 L 168 174", role: "detail", width: 3.5 },
  ],
  key_lock: [
    { d: "M 56 88 L 144 88 L 144 162 L 56 162 Z", role: "ink", width: 4.5 },
    { d: "M 72 88 L 72 60 A 28 28 0 0 1 128 60 L 128 88", role: "ink", width: 4.5 },
    { d: "M 100 112 A 10 10 0 1 1 99.9 112 Z M 100 130 L 100 146", role: "accent", width: 4.5 },
  ],
  door_portal: [
    { d: "M 58 168 L 58 32 L 142 32 L 142 168", role: "ink", width: 4.5 },
    { d: "M 58 32 L 116 44 L 116 154 L 58 168", role: "ink", width: 4 },
    { d: "M 116 44 L 164 26 M 116 154 L 164 174", role: "accent", width: 3.5 },
    { d: "M 102 100 A 4 4 0 1 1 101.9 100 Z", role: "accent", width: 4 },
  ],
  letter_envelope: [
    { d: "M 26 54 L 174 54 L 174 148 L 26 148 Z", role: "ink", width: 4.5 },
    { d: "M 26 54 L 100 110 L 174 54", role: "ink", width: 4 },
    { d: "M 100 98 A 12 12 0 1 1 99.9 98 Z", role: "accent", width: 5 },
  ],
  book_journal: [
    { d: "M 100 54 C 76 42, 46 42, 26 52 L 26 152 C 46 142, 76 142, 100 156 C 124 142, 154 142, 174 152 L 174 52 C 154 42, 124 42, 100 54 Z", role: "ink", width: 4.5 },
    { d: "M 100 54 L 100 156", role: "ink", width: 3.5 },
    { d: "M 42 78 L 84 74 M 42 98 L 84 94 M 42 118 L 84 114", role: "detail", width: 3 },
    { d: "M 116 74 L 158 78 M 116 94 L 158 98 M 116 114 L 158 118", role: "accent", width: 3 },
  ],
  prison_bars: [
    { d: "M 26 36 L 174 36 M 26 164 L 174 164", role: "ink", width: 5 },
    { d: "M 46 36 L 46 164 M 73 36 L 73 164 M 100 36 L 100 164 M 127 36 L 127 164 M 154 36 L 154 164", role: "ink", width: 4.5 },
    { d: "M 73 96 L 127 96", role: "accent", width: 4.5 },
  ],
  police_badge: [
    { d: "M 100 24 L 122 68 L 170 76 L 136 110 L 144 158 L 100 136 L 56 158 L 64 110 L 30 76 L 78 68 Z", role: "ink", width: 4.5 },
    { d: "M 100 68 A 30 30 0 1 1 99.9 68 Z", role: "accent", width: 4 },
  ],
  syringe_vial: [
    { d: "M 76 42 L 124 42 M 82 42 L 82 62 L 66 76 L 66 162 Q 66 170 74 170 L 126 170 Q 134 170 134 162 L 134 76 L 118 62 L 118 42", role: "ink", width: 4.5 },
    { d: "M 66 114 L 134 114 L 134 162 L 66 162 Z", role: "accent", width: 4 },
    { d: "M 82 136 L 118 136 M 100 122 L 100 150", role: "ink", width: 3.5 },
  ],
  robot_android: [
    { d: "M 48 64 L 152 64 L 152 152 L 48 152 Z", role: "ink", width: 4.5 },
    { d: "M 100 64 L 100 38 M 100 26 A 6 6 0 1 1 99.9 26 Z", role: "accent", width: 4 },
    { d: "M 64 88 L 136 88 L 136 112 L 64 112 Z", role: "accent", width: 4 },
    { d: "M 74 130 L 126 130 M 88 124 L 88 136 M 112 124 L 112 136", role: "detail", width: 3 },
  ],
  alien_ufo: [
    { d: "M 66 84 C 66 44, 134 44, 134 84", role: "ink", width: 4.5 },
    { d: "M 24 98 C 24 78, 176 78, 176 98 C 176 118, 24 118, 24 98 Z", role: "ink", width: 4.5 },
    { d: "M 62 98 A 5 5 0 1 1 61.9 98 Z M 100 98 A 5 5 0 1 1 99.9 98 Z M 138 98 A 5 5 0 1 1 137.9 98 Z", role: "accent", width: 3.5 },
    { d: "M 78 118 L 54 172 M 122 118 L 146 172 M 100 118 L 100 172", role: "accent", width: 3 },
  ],
  coffee_mug: [
    { d: "M 46 68 L 134 68 L 134 148 Q 134 166 112 166 L 68 166 Q 46 166 46 148 Z", role: "ink", width: 4.5 },
    { d: "M 134 84 C 164 84, 164 132, 134 132", role: "ink", width: 4.5 },
    { d: "M 70 52 Q 62 38 74 26 M 92 52 Q 84 38 96 26 M 114 52 Q 106 38 118 26", role: "accent", width: 3.5 },
  ],
  suitcase: [
    { d: "M 32 68 L 168 68 L 168 156 L 32 156 Z", role: "ink", width: 4.5 },
    { d: "M 78 68 L 78 44 L 122 44 L 122 68", role: "ink", width: 4.5 },
    { d: "M 62 68 L 62 156 M 138 68 L 138 156", role: "accent", width: 4 },
  ],
  balloon: [
    { d: "M 100 26 C 64 26, 52 60, 56 84 C 60 110, 88 126, 100 132 C 112 126, 140 110, 144 84 C 148 60, 136 26, 100 26 Z", role: "accent", width: 5 },
    { d: "M 100 132 Q 112 148 94 162 T 104 182", role: "ink", width: 3.5 },
    { d: "M 76 52 Q 68 66 74 82", role: "detail", width: 3 },
  ],
  guitar_instrument: [
    { d: "M 136 28 L 154 46 L 106 94", role: "ink", width: 4.5 },
    { d: "M 74 94 C 52 88, 34 114, 48 136 C 34 156, 58 176, 82 162 C 102 174, 128 154, 114 132 C 126 112, 104 86, 84 96", role: "ink", width: 4.5 },
    { d: "M 82 114 A 10 10 0 1 1 81.9 114 Z", role: "accent", width: 4 },
  ],
  telephone: [
    { d: "M 42 74 C 42 46, 158 46, 158 74 L 146 92 L 126 84 C 114 74, 86 74, 74 84 L 54 92 Z", role: "ink", width: 4.5 },
    { d: "M 54 98 L 42 156 L 158 156 L 146 98 Z", role: "ink", width: 4.5 },
    { d: "M 100 110 A 18 18 0 1 1 99.9 110 Z", role: "accent", width: 4 },
  ],
  ticket_stub: [
    { d: "M 26 66 L 174 66 L 174 90 A 10 10 0 0 0 174 110 L 174 136 L 26 136 L 26 110 A 10 10 0 0 0 26 90 Z", role: "ink", width: 4.5 },
    { d: "M 132 66 L 132 136", role: "detail", width: 3 },
    { d: "M 52 90 L 108 90 M 52 112 L 108 112", role: "accent", width: 4 },
  ],
  compass: [
    { d: "M 100 30 A 70 70 0 1 1 99.9 30 Z", role: "ink", width: 4.5 },
    { d: "M 100 44 L 112 100 L 100 156 L 88 100 Z", role: "accent", width: 4 },
    { d: "M 88 100 L 112 100", role: "ink", width: 3 },
  ],
  heart_broken: [
    { d: "M 100 162 C 44 124, 28 84, 52 54 C 72 34, 94 48, 100 64 C 106 48, 128 34, 148 54 C 172 84, 156 124, 100 162 Z", role: "accent", width: 5 },
    { d: "M 100 64 L 90 92 L 110 112 L 96 146", role: "ink", width: 3.5 },
  ],
  puzzle_cube: [
    { d: "M 100 32 L 160 66 L 160 134 L 100 168 L 40 134 L 40 66 Z", role: "ink", width: 4.5 },
    { d: "M 40 66 L 100 100 L 160 66 M 100 100 L 100 168", role: "ink", width: 4 },
    { d: "M 70 49 L 130 83 M 130 49 L 70 83", role: "accent", width: 3 },
  ],
};

export const ILLUSTRATION_IDS = Object.keys(ILLUSTRATION_LIBRARY) as IllustrationId[];
