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
  | "puzzle_cube"
  | "scooter_vespa"
  | "cricket_bat_ball"
  | "coin_toss"
  | "diya_lamp"
  | "palace_arch"
  | "paint_palette"
  | "piano_keys"
  | "gold_medal"
  | "motorcycle_sidecar"
  | "wedding_garland"
  | "radio_transistor"
  | "stethoscope"
  | "mustard_field"
  | "paper_kite";

export type MarkerFillRole =
  | "accentSoft"
  | "accentMid"
  | "warm"
  | "cool"
  | "gold"
  | "emerald"
  | "crimson"
  | "slate"
  | "smoke";

export interface IllustrationStrokeDef {
  d: string;
  role: "ink" | "detail" | "accent";
  width?: number;
  fill?: MarkerFillRole;
}

// Hand-illustrated multi-layer dry-erase artwork crafted in a 200x200 coordinate space
// with marker watercolor fills, shading cross-hatches, motion lines, and ground shadows.
export const ILLUSTRATION_LIBRARY: Record<IllustrationId, IllustrationStrokeDef[]> = {
  spinning_top: [
    { d: "M 54 170 C 78 164, 122 164, 146 170 C 122 178, 78 178, 54 170 Z", role: "detail", width: 2.5, fill: "smoke" },
    { d: "M 94 24 L 106 24 L 106 58 L 94 58 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 40 74 C 40 52, 160 52, 160 74 C 160 94, 40 94, 40 74 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 42 78 L 100 164 L 158 78", role: "ink", width: 5, fill: "accentSoft" },
    { d: "M 64 96 C 85 106, 115 106, 136 96", role: "detail", width: 3 },
    { d: "M 78 118 C 93 126, 107 126, 122 118", role: "detail", width: 3 },
    { d: "M 88 138 C 96 143, 104 143, 112 138", role: "detail", width: 2.5 },
    { d: "M 24 62 Q 12 74 26 86 M 32 54 Q 24 62 30 70", role: "accent", width: 3.5 },
    { d: "M 176 62 Q 188 74 174 86 M 168 54 Q 176 62 170 70", role: "accent", width: 3.5 },
    { d: "M 60 166 Q 100 182 140 166", role: "accent", width: 3.5 },
  ],
  pills: [
    { d: "M 30 112 L 64 78 A 20 20 0 0 1 92 106 L 58 140 A 20 20 0 0 1 30 112 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 47 95 L 75 123 L 58 140 A 20 20 0 0 1 30 112 Z", role: "ink", width: 3.5, fill: "smoke" },
    { d: "M 42 110 Q 52 98 62 90", role: "detail", width: 3 },
    { d: "M 106 102 L 140 68 A 20 20 0 0 1 168 96 L 134 130 A 20 20 0 0 1 106 102 Z", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 123 85 L 151 113 L 134 130 A 20 20 0 0 1 106 102 Z", role: "ink", width: 3.5, fill: "smoke" },
    { d: "M 136 88 Q 146 78 156 86", role: "detail", width: 3 },
    { d: "M 82 54 L 100 38 L 118 54", role: "accent", width: 3.5 },
    { d: "M 80 152 Q 100 140 120 152", role: "accent", width: 3.5 },
  ],
  flask_beaker: [
    { d: "M 44 174 C 76 170, 124 170, 156 174", role: "detail", width: 3 },
    { d: "M 76 28 L 124 28 L 122 36 L 78 36 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 84 36 L 84 74 L 40 152 Q 34 166 50 170 L 150 170 Q 166 166 160 152 L 116 74 L 116 36", role: "ink", width: 5, fill: "smoke" },
    { d: "M 56 128 Q 80 120 100 128 T 144 128 L 154 156 Q 156 164 146 164 L 54 164 Q 44 164 46 156 Z", role: "accent", width: 4, fill: "accentMid" },
    { d: "M 90 104 A 6 6 0 1 1 89.9 104 Z", role: "accent", width: 3.5, fill: "cool" },
    { d: "M 110 92 A 5 5 0 1 1 109.9 92 Z", role: "accent", width: 3.5, fill: "cool" },
    { d: "M 96 18 A 7 7 0 1 1 95.9 18 Z", role: "detail", width: 3 },
    { d: "M 114 14 A 4 4 0 1 1 113.9 14 Z", role: "detail", width: 2.5 },
    { d: "M 74 86 L 56 120", role: "detail", width: 2.5 },
    { d: "M 64 142 L 82 142 M 114 146 L 132 146 M 114 54 L 106 54 M 114 66 L 106 66", role: "detail", width: 3 },
  ],
  rv_van: [
    { d: "M 18 158 L 182 158", role: "detail", width: 3 },
    { d: "M 68 42 L 112 42 L 112 56 L 68 56 Z", role: "ink", width: 3.5, fill: "slate" },
    { d: "M 54 34 C 42 22, 68 18, 60 10 M 76 34 C 68 20, 92 18, 84 8", role: "accent", width: 3.5 },
    { d: "M 22 136 L 22 72 Q 22 56 40 56 L 144 56 L 178 92 L 178 136 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 24 106 L 176 106 L 176 118 L 24 118 Z", role: "accent", width: 3.5, fill: "accentMid" },
    { d: "M 134 56 L 134 94 L 178 94", role: "ink", width: 4, fill: "cool" },
    { d: "M 38 70 L 76 70 L 76 96 L 38 96 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 90 70 L 120 70 L 120 96 L 90 96 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 46 76 L 64 76 M 46 84 L 64 84", role: "detail", width: 2.5 },
    { d: "M 54 142 A 16 16 0 1 1 53.9 142 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 54 142 A 6 6 0 1 1 53.9 142 Z", role: "detail", width: 3 },
    { d: "M 144 142 A 16 16 0 1 1 143.9 142 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 144 142 A 6 6 0 1 1 143.9 142 Z", role: "detail", width: 3 },
  ],
  ship_liner: [
    { d: "M 20 118 L 180 118 L 154 158 L 38 158 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 36 138 L 166 138", role: "accent", width: 3.5 },
    { d: "M 44 118 L 44 94 L 152 94 L 160 118", role: "ink", width: 4, fill: "smoke" },
    { d: "M 60 94 L 60 76 L 134 76 L 140 94", role: "ink", width: 3.5, fill: "warm" },
    { d: "M 68 76 L 72 46 L 86 46 L 88 76 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 98 76 L 102 46 L 116 46 L 118 76 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 58 106 A 3 3 0 1 1 57.9 106 Z M 78 106 A 3 3 0 1 1 77.9 106 Z M 98 106 A 3 3 0 1 1 97.9 106 Z M 118 106 A 3 3 0 1 1 117.9 106 Z", role: "detail", width: 2.5 },
    { d: "M 78 38 C 86 24, 108 26, 120 20 M 108 38 C 118 24, 138 24, 152 18", role: "detail", width: 3 },
    { d: "M 14 164 Q 44 152 74 164 T 134 164 T 186 164", role: "accent", width: 4 },
    { d: "M 26 176 Q 60 168 94 176 T 174 176", role: "detail", width: 2.5 },
  ],
  iceberg: [
    { d: "M 56 96 L 84 32 L 108 60 L 130 28 L 154 96 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 56 96 L 38 134 L 78 178 L 128 170 L 164 126 L 154 96 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 18 96 Q 48 88 78 96 T 138 96 T 184 96", role: "accent", width: 4 },
    { d: "M 84 32 L 96 96 L 78 178", role: "detail", width: 3 },
    { d: "M 130 28 L 118 96 L 128 170", role: "detail", width: 3 },
    { d: "M 98 112 L 122 104 M 92 132 L 134 122 M 86 152 L 124 144", role: "detail", width: 2.5 },
  ],
  bat_emblem: [
    { d: "M 100 28 A 72 72 0 1 1 99.9 28 Z", role: "accent", width: 5, fill: "gold" },
    { d: "M 100 38 A 62 62 0 1 1 99.9 38 Z", role: "ink", width: 3 },
    {
      d: "M 100 72 L 93 58 L 88 72 C 70 76, 52 66, 38 80 C 54 92, 58 108, 46 122 C 66 112, 84 116, 100 138 C 116 116, 134 112, 154 122 C 142 108, 146 92, 162 80 C 148 66, 130 76, 112 72 L 107 58 Z",
      role: "ink",
      width: 5,
      fill: "slate",
    },
    { d: "M 58 94 L 84 96 M 142 94 L 116 96", role: "detail", width: 2.5 },
    { d: "M 52 178 L 76 138 M 148 178 L 124 138", role: "accent", width: 3.5 },
  ],
  lightning_bolt: [
    { d: "M 118 20 L 50 106 L 96 106 L 76 180 L 152 86 L 104 86 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 108 38 L 72 96 L 104 96 L 92 148", role: "accent", width: 3.5 },
    { d: "M 48 48 L 30 38 M 40 72 L 24 72 M 156 126 L 174 136 M 160 98 L 178 96", role: "accent", width: 3.5 },
    { d: "M 44 142 L 28 156", role: "detail", width: 3 },
  ],
  glasses_scar: [
    { d: "M 108 20 L 90 48 L 108 48 L 94 74", role: "accent", width: 5 },
    { d: "M 62 94 A 28 28 0 1 1 61.9 94 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 138 94 A 28 28 0 1 1 137.9 94 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 50 112 L 66 104 M 126 112 L 142 104", role: "detail", width: 3 },
    { d: "M 90 120 Q 100 110 110 120", role: "ink", width: 4.5 },
    { d: "M 18 112 L 34 118 M 166 118 L 182 112", role: "ink", width: 4 },
    { d: "M 64 164 Q 100 176 136 164", role: "accent", width: 3 },
  ],
  ring_band: [
    { d: "M 100 44 A 56 56 0 1 1 99.9 44 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 100 62 A 38 38 0 1 1 99.9 62 Z", role: "ink", width: 4.5, fill: "smoke" },
    { d: "M 70 100 Q 100 120 130 100", role: "accent", width: 3.5 },
    { d: "M 64 88 Q 100 104 136 88", role: "detail", width: 2.5 },
    { d: "M 100 16 L 100 32 M 150 40 L 162 28 M 50 40 L 38 28 M 166 100 L 180 100 M 20 100 L 34 100", role: "accent", width: 3.5 },
  ],
  volcano_mountain: [
    { d: "M 20 168 L 72 68 L 128 68 L 180 168 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 72 68 Q 100 78 128 68", role: "ink", width: 4 },
    { d: "M 86 72 L 76 118 L 96 106 L 106 138 L 120 100 L 114 72 Z", role: "accent", width: 4, fill: "crimson" },
    { d: "M 52 146 L 78 146 M 122 146 L 148 146", role: "detail", width: 3 },
    { d: "M 76 54 C 58 34, 88 18, 102 32 C 118 16, 146 36, 128 54", role: "ink", width: 3.5, fill: "smoke" },
    { d: "M 88 46 L 76 28 M 114 44 L 126 26", role: "accent", width: 3.5 },
  ],
  lightsaber_sword: [
    { d: "M 36 164 L 74 126 L 86 138 L 48 176 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 48 152 L 60 164 M 58 142 L 70 154 M 68 132 L 80 144", role: "detail", width: 3 },
    { d: "M 82 130 L 166 46", role: "accent", width: 10 },
    { d: "M 82 130 L 166 46", role: "ink", width: 3 },
    { d: "M 148 30 L 160 18 M 182 62 L 192 52 M 126 52 L 138 40 M 156 82 L 168 70", role: "accent", width: 3.5 },
  ],
  helmet_mask: [
    { d: "M 52 100 C 50 40, 150 40, 148 100 L 168 150 L 128 164 L 100 148 L 72 164 L 32 150 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 100 44 L 100 116", role: "detail", width: 3.5 },
    { d: "M 64 96 L 94 104 L 88 116 L 62 110 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 136 96 L 106 104 L 112 116 L 138 110 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 82 134 L 100 120 L 118 134 Z", role: "ink", width: 4, fill: "accentMid" },
    { d: "M 72 64 C 84 56, 116 56, 128 64", role: "detail", width: 3 },
  ],
  rocket_spacecraft: [
    { d: "M 100 18 C 126 44, 134 94, 124 134 L 76 134 C 66 94, 74 44, 100 18 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 86 44 L 114 44", role: "accent", width: 4 },
    { d: "M 76 108 L 48 142 L 76 134 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 124 108 L 152 142 L 124 134 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 100 66 A 14 14 0 1 1 99.9 66 Z", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 82 136 L 100 180 L 118 136 Z", role: "accent", width: 4, fill: "gold" },
    { d: "M 66 172 Q 100 158 134 172", role: "detail", width: 3 },
    { d: "M 36 44 L 44 44 M 40 40 L 40 48 M 156 54 L 164 54 M 160 50 L 160 58", role: "accent", width: 3 },
  ],
  black_hole_planet: [
    { d: "M 100 64 A 36 36 0 1 1 99.9 64 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 16 100 C 40 70, 160 70, 184 100 C 160 130, 40 130, 16 100 Z", role: "accent", width: 4.5, fill: "accentSoft" },
    { d: "M 36 100 C 64 84, 136 84, 164 100", role: "detail", width: 3 },
    { d: "M 54 52 C 74 36, 126 36, 146 52", role: "detail", width: 2.5 },
    { d: "M 32 42 L 42 42 M 37 37 L 37 47 M 158 152 L 168 152 M 163 147 L 163 157 M 156 44 L 162 44 M 159 41 L 159 47", role: "accent", width: 3 },
  ],
  clock_tower: [
    { d: "M 64 176 L 64 64 L 100 22 L 136 64 L 136 176 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 64 64 L 136 64", role: "ink", width: 4 },
    { d: "M 100 76 A 24 24 0 1 1 99.9 76 Z", role: "ink", width: 4.5, fill: "smoke" },
    { d: "M 100 84 L 100 100 L 116 100", role: "accent", width: 4.5 },
    { d: "M 82 138 L 82 176 L 118 176 L 118 138 Q 100 124 82 138 Z", role: "ink", width: 3.5, fill: "slate" },
    { d: "M 36 38 L 54 50 M 164 38 L 146 50 M 100 10 L 100 20", role: "accent", width: 3.5 },
  ],
  sports_car: [
    { d: "M 18 148 L 184 148", role: "detail", width: 3 },
    { d: "M 22 130 L 30 102 L 64 94 L 94 70 L 144 70 L 172 100 L 180 130 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 70 94 L 96 76 L 138 76 L 158 94 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 28 112 L 174 112", role: "accent", width: 4 },
    { d: "M 54 132 A 16 16 0 1 1 53.9 132 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 146 132 A 16 16 0 1 1 145.9 132 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 14 106 L 38 106 M 10 120 L 30 120 M 14 140 L 42 140", role: "accent", width: 3.5 },
    { d: "M 96 68 L 76 34 L 116 58", role: "accent", width: 4 },
  ],
  bicycle: [
    { d: "M 22 166 L 178 166", role: "detail", width: 2.5 },
    { d: "M 48 112 A 28 28 0 1 1 47.9 112 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 152 112 A 28 28 0 1 1 151.9 112 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 48 140 L 94 140 L 132 88 L 76 88 Z", role: "accent", width: 4.5 },
    { d: "M 94 140 L 72 70 L 56 70", role: "ink", width: 4.5 },
    { d: "M 152 140 L 128 62 L 150 58", role: "ink", width: 4.5 },
    { d: "M 48 112 L 48 168 M 20 140 L 76 140 M 152 112 L 152 168 M 124 140 L 180 140", role: "detail", width: 2 },
  ],
  moon_crescent: [
    { d: "M 118 30 A 64 64 0 1 0 158 146 A 50 50 0 1 1 118 30 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 70 86 A 8 8 0 1 1 69.9 86 Z", role: "detail", width: 2.5 },
    { d: "M 88 124 A 6 6 0 1 1 87.9 124 Z", role: "detail", width: 2.5 },
    { d: "M 134 52 L 146 52 M 140 46 L 140 58", role: "accent", width: 3.5 },
    { d: "M 160 88 L 174 88 M 167 81 L 167 95", role: "accent", width: 3.5 },
    { d: "M 34 42 L 42 42 M 38 38 L 38 46", role: "detail", width: 3 },
  ],
  waffle_plate: [
    { d: "M 100 28 A 72 72 0 1 1 99.9 28 Z", role: "ink", width: 4.5, fill: "smoke" },
    { d: "M 100 42 A 58 58 0 1 1 99.9 42 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 52 78 L 148 78 M 46 100 L 154 100 M 52 122 L 148 122", role: "detail", width: 3 },
    { d: "M 78 52 L 78 148 M 100 46 L 100 154 M 122 52 L 122 148", role: "detail", width: 3 },
    { d: "M 86 86 L 114 86 L 114 114 L 86 114 Z", role: "ink", width: 3.5, fill: "warm" },
    { d: "M 76 114 Q 100 132 126 112", role: "accent", width: 3.5 },
  ],
  monster_portal: [
    { d: "M 100 22 C 134 44, 134 156, 100 178 C 66 156, 66 44, 100 22 Z", role: "accent", width: 5, fill: "crimson" },
    { d: "M 100 42 C 118 60, 118 140, 100 158 C 82 140, 82 60, 100 42 Z", role: "ink", width: 3.5, fill: "slate" },
    { d: "M 100 28 L 90 78 L 110 116 L 94 170", role: "accent", width: 3.5 },
    { d: "M 36 52 Q 64 78 82 96 M 36 144 Q 64 120 82 104", role: "ink", width: 4 },
    { d: "M 164 52 Q 136 78 118 96 M 164 144 Q 136 120 118 104", role: "ink", width: 4 },
  ],
  cassette_tape: [
    { d: "M 24 52 L 176 52 L 176 148 L 24 148 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 38 66 L 162 66 L 162 114 L 38 114 Z", role: "ink", width: 3.5, fill: "warm" },
    { d: "M 68 78 A 14 14 0 1 1 67.9 78 Z", role: "ink", width: 4, fill: "smoke" },
    { d: "M 132 78 A 14 14 0 1 1 131.9 78 Z", role: "ink", width: 4, fill: "smoke" },
    { d: "M 82 92 L 118 92", role: "accent", width: 4 },
    { d: "M 48 148 L 60 126 L 140 126 L 152 148 Z", role: "ink", width: 3.5, fill: "accentSoft" },
  ],
  headphones: [
    { d: "M 42 114 C 42 40, 158 40, 158 114", role: "ink", width: 6 },
    { d: "M 52 110 C 52 54, 148 54, 148 110", role: "detail", width: 3 },
    { d: "M 28 102 L 54 102 L 54 156 L 28 156 Q 18 128 28 102 Z", role: "ink", width: 4.5, fill: "accentMid" },
    { d: "M 146 102 L 172 102 Q 182 128 172 156 L 146 156 Z", role: "ink", width: 4.5, fill: "accentMid" },
    { d: "M 86 130 L 86 92 L 118 84 L 118 122", role: "accent", width: 4 },
    { d: "M 78 130 A 9 6 0 1 1 77.9 130 Z M 110 122 A 9 6 0 1 1 109.9 122 Z", role: "accent", width: 4 },
  ],
  magnifying_glass: [
    { d: "M 84 34 A 48 48 0 1 1 83.9 34 Z", role: "ink", width: 5.5, fill: "cool" },
    { d: "M 84 48 A 34 34 0 1 1 83.9 48 Z", role: "accent", width: 3 },
    { d: "M 118 118 L 168 168", role: "ink", width: 10 },
    { d: "M 62 66 Q 74 56 92 60", role: "detail", width: 3.5 },
    { d: "M 74 84 L 96 84 M 74 96 L 88 96", role: "detail", width: 3 },
  ],
  footprints: [
    { d: "M 48 134 C 38 110, 68 98, 76 122 C 80 136, 54 144, 48 134 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 54 150 L 76 148 L 74 166 L 54 166 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 122 66 C 112 42, 142 30, 150 54 C 154 68, 128 76, 122 66 Z", role: "ink", width: 4.5, fill: "accentMid" },
    { d: "M 128 82 L 150 80 L 148 98 L 128 98 Z", role: "ink", width: 4, fill: "accentMid" },
    { d: "M 86 116 Q 100 96 116 86", role: "accent", width: 3.5 },
  ],
  crown: [
    { d: "M 28 144 L 40 62 L 74 104 L 100 42 L 126 104 L 160 62 L 172 144 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 28 158 L 172 158 L 172 144 L 28 144 Z", role: "ink", width: 4.5, fill: "warm" },
    { d: "M 100 32 A 7 7 0 1 1 99.9 32 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 40 50 A 6 6 0 1 1 39.9 50 Z M 160 50 A 6 6 0 1 1 159.9 50 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 62 124 L 74 112 L 86 124 L 74 136 Z M 114 124 L 126 112 L 138 124 L 126 136 Z", role: "accent", width: 3.5, fill: "crimson" },
  ],
  throne_swords: [
    { d: "M 68 158 L 68 62 L 100 30 L 132 62 L 132 158 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 52 118 L 148 118 L 148 166 L 52 166 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 32 40 L 168 168 M 28 54 L 50 32", role: "accent", width: 5 },
    { d: "M 168 40 L 32 168 M 150 32 L 172 54", role: "accent", width: 5 },
    { d: "M 100 18 L 100 116", role: "detail", width: 3.5 },
    { d: "M 78 72 L 122 72 M 78 92 L 122 92", role: "detail", width: 3 },
  ],
  dragon: [
    { d: "M 54 150 C 42 118, 76 90, 96 62 L 126 40 L 148 54 L 124 72 L 136 108 L 106 160 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 76 90 C 38 60, 22 36, 52 24 C 68 44, 82 64, 94 78", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 52 54 L 78 72 M 44 68 L 72 80", role: "detail", width: 2.5 },
    { d: "M 148 52 C 170 54, 182 44, 188 62 C 174 74, 164 68, 148 68 Z", role: "accent", width: 4.5, fill: "gold" },
    { d: "M 124 50 A 4 4 0 1 1 123.9 50 Z", role: "accent", width: 3.5 },
    { d: "M 64 134 L 54 128 M 72 118 L 60 112 M 82 100 L 70 94", role: "detail", width: 3 },
  ],
  shark_fin: [
    { d: "M 60 132 C 70 76, 102 42, 130 32 C 120 74, 124 104, 142 132 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 92 78 L 116 66 M 86 98 L 118 86", role: "detail", width: 2.5 },
    { d: "M 16 136 Q 48 118 80 136 T 144 136 T 186 136", role: "accent", width: 4.5 },
    { d: "M 28 156 Q 64 144 100 156 T 174 156", role: "detail", width: 3 },
    { d: "M 42 172 Q 72 164 102 172 T 162 172", role: "detail", width: 2.5 },
  ],
  dinosaur: [
    { d: "M 46 160 L 62 114 C 64 84, 84 66, 108 54 L 116 28 L 164 28 L 168 54 L 136 58 L 166 72 L 132 78 L 118 120 L 126 160 Z", role: "ink", width: 5, fill: "emerald" },
    { d: "M 62 114 L 24 136 L 54 136", role: "ink", width: 4.5 },
    { d: "M 130 40 A 4 4 0 1 1 129.9 40 Z", role: "accent", width: 4 },
    { d: "M 136 58 L 142 66 L 148 58 L 154 66 L 160 58", role: "accent", width: 3 },
    { d: "M 86 112 L 106 112 M 80 128 L 102 128 M 36 168 L 148 168", role: "detail", width: 3 },
  ],
  umbrella: [
    { d: "M 26 104 C 34 38, 166 38, 174 104 Q 136 90 100 104 Q 64 90 26 104 Z", role: "ink", width: 5, fill: "accentMid" },
    { d: "M 100 42 C 86 68, 84 88, 84 100 M 100 42 C 114 68, 116 88, 116 100", role: "detail", width: 2.5 },
    { d: "M 100 42 L 100 156 C 100 176, 124 176, 124 156", role: "ink", width: 5 },
    { d: "M 42 32 L 34 48 M 158 30 L 150 46 M 72 22 L 66 36 M 128 22 L 122 36", role: "accent", width: 3 },
  ],
  mask_theater: [
    { d: "M 44 50 C 44 30, 156 30, 156 50 L 148 126 C 138 162, 62 162, 52 126 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 66 84 Q 80 72 92 84 M 108 84 Q 120 72 134 84", role: "ink", width: 4 },
    { d: "M 70 116 Q 100 144 130 116 Q 100 126 70 116 Z", role: "accent", width: 4.5, fill: "crimson" },
    { d: "M 92 102 L 108 102 L 100 90 Z", role: "detail", width: 3 },
    { d: "M 66 96 L 78 96 M 122 96 L 134 96", role: "accent", width: 3 },
  ],
  money_stack: [
    { d: "M 26 64 L 174 64 L 174 122 L 26 122 Z", role: "ink", width: 5, fill: "emerald" },
    { d: "M 32 134 L 168 134 M 38 146 L 162 146 M 44 158 L 156 158", role: "detail", width: 3.5 },
    { d: "M 84 64 L 116 64 L 116 122 L 84 122 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 100 80 C 88 80, 88 94, 100 94 C 112 94, 112 108, 100 108 M 100 74 L 100 114", role: "ink", width: 3.5 },
    { d: "M 44 80 A 5 5 0 1 1 43.9 80 Z M 156 106 A 5 5 0 1 1 155.9 106 Z", role: "detail", width: 2.5 },
  ],
  vault_safe: [
    { d: "M 30 30 L 170 30 L 170 170 L 30 170 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 48 48 L 152 48 L 152 152 L 48 152 Z", role: "ink", width: 3.5, fill: "smoke" },
    { d: "M 100 70 A 30 30 0 1 1 99.9 70 Z", role: "ink", width: 4.5, fill: "gold" },
    { d: "M 78 100 L 122 100 M 100 78 L 100 122", role: "ink", width: 4 },
    { d: "M 36 66 L 44 66 M 36 134 L 44 134", role: "accent", width: 4 },
  ],
  television: [
    { d: "M 26 62 L 174 62 L 174 158 L 26 158 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 42 78 L 134 78 L 134 142 L 42 142 Z", role: "ink", width: 4, fill: "cool" },
    { d: "M 56 96 L 88 96 M 56 112 L 116 112 M 56 128 L 96 128", role: "accent", width: 3 },
    { d: "M 100 62 L 68 24 M 100 62 L 132 24", role: "ink", width: 4.5 },
    { d: "M 152 90 A 7 7 0 1 1 151.9 90 Z M 152 118 A 7 7 0 1 1 151.9 118 Z", role: "accent", width: 3.5 },
    { d: "M 54 158 L 46 172 M 146 158 L 154 172", role: "ink", width: 4 },
  ],
  camera_lens: [
    { d: "M 24 60 L 66 60 L 78 40 L 122 40 L 134 60 L 176 60 L 176 158 L 24 158 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 100 72 A 38 38 0 1 1 99.9 72 Z", role: "ink", width: 4.5, fill: "smoke" },
    { d: "M 100 86 A 24 24 0 1 1 99.9 86 Z", role: "ink", width: 4, fill: "cool" },
    { d: "M 88 94 Q 100 84 114 96", role: "detail", width: 2.5 },
    { d: "M 150 76 A 6 6 0 1 1 149.9 76 Z", role: "accent", width: 4, fill: "crimson" },
    { d: "M 42 60 L 58 60 L 58 50 L 42 50 Z", role: "ink", width: 3.5 },
  ],
  newspaper: [
    { d: "M 32 34 L 154 34 L 154 164 L 32 164 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 154 56 L 172 56 L 172 158 Q 172 166 154 164", role: "ink", width: 3.5, fill: "warm" },
    { d: "M 48 52 L 138 52 L 138 72 L 48 72 Z", role: "ink", width: 4, fill: "accentSoft" },
    { d: "M 48 86 L 92 86 L 92 126 L 48 126 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 104 90 L 138 90 M 104 106 L 138 106 M 104 122 L 138 122 M 48 142 L 138 142", role: "detail", width: 3 },
  ],
  airplane: [
    { d: "M 100 20 L 114 70 L 180 112 L 180 130 L 114 106 L 114 148 L 138 166 L 138 178 L 100 166 L 62 178 L 62 166 L 86 148 L 86 106 L 20 130 L 20 112 L 86 70 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 92 42 Q 100 34 108 42", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 100 50 L 100 156", role: "accent", width: 3.5 },
    { d: "M 54 114 L 54 126 M 146 114 L 146 126", role: "ink", width: 4 },
    { d: "M 34 52 Q 52 38 70 48 Q 86 38 98 48", role: "detail", width: 2.5 },
    { d: "M 54 176 L 54 188 M 146 176 L 146 188", role: "accent", width: 3 },
  ],
  train_locomotive: [
    { d: "M 52 142 L 52 52 Q 52 34 100 34 Q 148 34 148 52 L 148 142 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 66 56 L 134 56 L 134 92 L 66 92 Z", role: "ink", width: 4, fill: "cool" },
    { d: "M 72 118 A 8 8 0 1 1 71.9 118 Z M 128 118 A 8 8 0 1 1 127.9 118 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 58 142 L 32 176 M 142 142 L 168 176 M 44 160 L 156 160 M 38 172 L 162 172", role: "ink", width: 4 },
    { d: "M 84 18 Q 100 10 116 18", role: "accent", width: 3.5 },
  ],
  bridge_city: [
    { d: "M 16 132 L 184 132 L 184 142 L 16 142 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 56 164 L 56 48 M 144 164 L 144 48", role: "ink", width: 6 },
    { d: "M 16 112 Q 36 100 56 54 Q 100 124 144 54 Q 164 100 184 112", role: "accent", width: 4.5 },
    { d: "M 78 98 L 78 132 M 100 106 L 100 132 M 122 98 L 122 132", role: "detail", width: 2.5 },
    { d: "M 22 168 Q 62 158 102 168 T 178 168", role: "accent", width: 3 },
  ],
  city_skyline: [
    { d: "M 20 166 L 180 166", role: "ink", width: 5 },
    { d: "M 30 166 L 30 84 L 66 84 L 66 166 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 74 166 L 74 38 L 122 38 L 122 166 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 98 38 L 98 16", role: "ink", width: 4 },
    { d: "M 130 166 L 130 68 L 168 68 L 168 166 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 86 58 L 110 58 M 86 78 L 110 78 M 86 98 L 110 98 M 86 118 L 110 118 M 42 102 L 54 102 M 142 90 L 156 90 M 142 110 L 156 110", role: "accent", width: 3.5 },
  ],
  house_mansion: [
    { d: "M 30 96 L 100 32 L 170 96 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 46 96 L 46 166 L 154 166 L 154 96 Z", role: "ink", width: 4.5, fill: "warm" },
    { d: "M 84 166 L 84 118 L 116 118 L 116 166 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 60 106 L 80 106 L 80 126 L 60 126 Z M 120 106 L 140 106 L 140 126 L 120 126 Z", role: "ink", width: 3, fill: "gold" },
    { d: "M 134 54 L 134 32 L 148 32 L 148 66", role: "ink", width: 3.5 },
    { d: "M 24 166 L 176 166", role: "detail", width: 3 },
  ],
  island_palm: [
    { d: "M 16 154 Q 52 140 88 154 T 184 154", role: "accent", width: 4.5 },
    { d: "M 40 148 Q 100 112 160 148 Z", role: "ink", width: 4.5, fill: "gold" },
    { d: "M 96 134 Q 108 92 92 60", role: "ink", width: 6 },
    { d: "M 92 60 Q 62 46 42 68 M 92 60 Q 72 30 52 40 M 92 60 Q 126 38 146 64 M 92 60 Q 126 68 142 90", role: "ink", width: 4.5 },
    { d: "M 42 68 Q 66 64 92 60 Q 118 68 142 90", role: "accent", width: 3.5, fill: "emerald" },
    { d: "M 148 28 A 12 12 0 1 1 147.9 28 Z", role: "accent", width: 3.5, fill: "gold" },
  ],
  desert_cactus: [
    { d: "M 20 166 L 180 166", role: "ink", width: 4.5 },
    { d: "M 88 166 L 88 52 A 12 12 0 0 1 112 52 L 112 166 Z", role: "ink", width: 5, fill: "emerald" },
    { d: "M 88 114 L 62 114 Q 52 114 52 102 L 52 80 A 9 9 0 0 1 70 80 L 70 98 L 88 98", role: "ink", width: 4.5, fill: "emerald" },
    { d: "M 112 98 L 138 98 Q 148 98 148 86 L 148 64 A 9 9 0 0 0 130 64 L 130 82 L 112 82", role: "ink", width: 4.5, fill: "emerald" },
    { d: "M 100 66 L 100 144 M 60 88 L 60 106 M 140 72 L 140 90", role: "detail", width: 2.5 },
    { d: "M 148 26 A 14 14 0 1 1 147.9 26 Z", role: "accent", width: 4, fill: "gold" },
  ],
  forest_trees: [
    { d: "M 20 164 L 180 164", role: "ink", width: 4.5 },
    { d: "M 52 146 L 26 146 L 52 94 L 34 94 L 52 52 L 70 94 L 52 94 L 78 146 Z", role: "ink", width: 4, fill: "emerald" },
    { d: "M 100 150 L 68 150 L 100 82 L 76 82 L 100 26 L 124 82 L 100 82 L 132 150 Z", role: "ink", width: 4.5, fill: "emerald" },
    { d: "M 148 146 L 124 146 L 148 98 L 132 98 L 148 58 L 164 98 L 148 98 L 172 146 Z", role: "ink", width: 4, fill: "emerald" },
    { d: "M 52 146 L 52 164 M 100 150 L 100 164 M 148 146 L 148 164", role: "ink", width: 5 },
    { d: "M 38 42 Q 44 36 50 42 Q 56 36 62 42", role: "detail", width: 2.5 },
  ],
  ocean_waves: [
    { d: "M 18 92 Q 56 58 96 92 T 182 92 L 182 170 L 18 170 Z", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 18 124 Q 56 94 96 124 T 182 124", role: "accent", width: 4.5 },
    { d: "M 24 152 Q 60 128 98 152 T 176 152", role: "detail", width: 3.5 },
    { d: "M 116 58 Q 134 44 150 58", role: "detail", width: 3 },
  ],
  fire_flames: [
    { d: "M 100 18 C 142 62, 162 108, 136 154 C 122 172, 78 172, 64 154 C 38 108, 58 66, 84 44 C 82 70, 102 72, 100 18 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 100 78 C 120 102, 126 130, 110 150 C 94 160, 80 146, 84 126 C 86 110, 98 100, 100 78 Z", role: "accent", width: 4, fill: "gold" },
    { d: "M 56 54 A 3 3 0 1 1 55.9 54 Z M 146 44 A 4 4 0 1 1 145.9 44 Z M 156 88 A 3 3 0 1 1 155.9 88 Z", role: "accent", width: 3 },
    { d: "M 54 172 L 146 172", role: "ink", width: 4 },
  ],
  hourglass: [
    { d: "M 50 28 L 150 28 L 150 38 L 50 38 Z", role: "ink", width: 4.5, fill: "warm" },
    { d: "M 50 162 L 150 162 L 150 172 L 50 172 Z", role: "ink", width: 4.5, fill: "warm" },
    { d: "M 62 38 C 62 82, 94 94, 94 100 C 94 106, 62 118, 62 162", role: "ink", width: 4.5 },
    { d: "M 138 38 C 138 82, 106 94, 106 100 C 106 106, 138 118, 138 162", role: "ink", width: 4.5 },
    { d: "M 74 64 L 126 64 Q 112 88 100 94 Q 88 88 74 64 Z", role: "accent", width: 3, fill: "gold" },
    { d: "M 72 160 L 100 128 L 128 160 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 100 100 L 100 128", role: "accent", width: 3 },
  ],
  brain_maze: [
    { d: "M 100 40 C 64 40, 38 66, 38 98 C 38 126, 56 146, 84 150 L 84 166 L 116 166 L 116 150 C 144 146, 162 126, 162 98 C 162 66, 136 40, 100 40 Z", role: "ink", width: 5, fill: "accentSoft" },
    { d: "M 100 40 L 100 150", role: "detail", width: 3 },
    { d: "M 60 80 Q 82 68 90 90 Q 70 112 56 102 M 66 122 Q 82 116 90 132", role: "accent", width: 3.5 },
    { d: "M 140 80 Q 118 68 110 90 Q 130 112 144 102 M 134 122 Q 118 116 110 132", role: "accent", width: 3.5 },
    { d: "M 64 26 L 60 14 M 100 22 L 100 10 M 136 26 L 140 14", role: "accent", width: 3 },
  ],
  eye_iris: [
    { d: "M 16 100 Q 100 28 184 100 Q 100 172 16 100 Z", role: "ink", width: 5.5, fill: "smoke" },
    { d: "M 100 62 A 38 38 0 1 1 99.9 62 Z", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 100 84 A 16 16 0 1 1 99.9 84 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 110 82 A 5 5 0 1 1 109.9 82 Z", role: "detail", width: 3, fill: "smoke" },
    { d: "M 42 54 L 34 42 M 100 34 L 100 20 M 158 54 L 166 42", role: "accent", width: 3.5 },
  ],
  skull_bones: [
    { d: "M 50 114 C 42 50, 158 50, 150 114 L 132 136 L 132 164 L 68 164 L 68 136 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 76 92 A 14 14 0 1 1 75.9 92 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 124 92 A 14 14 0 1 1 123.9 92 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 93 128 L 100 114 L 107 128 Z", role: "ink", width: 3.5, fill: "slate" },
    { d: "M 84 146 L 84 164 M 100 146 L 100 164 M 116 146 L 116 164", role: "detail", width: 3 },
    { d: "M 32 162 L 168 136 M 32 136 L 168 162", role: "accent", width: 3.5 },
  ],
  sword_shield: [
    { d: "M 136 22 L 154 40 L 66 128 L 48 110 Z", role: "ink", width: 4, fill: "smoke" },
    { d: "M 44 106 L 70 132 M 36 140 L 58 118", role: "ink", width: 5 },
    { d: "M 46 44 L 154 44 L 154 108 C 154 144, 100 174, 100 174 C 100 174, 46 144, 46 108 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 58 56 L 142 56 L 142 104 C 142 132, 100 156, 100 156 C 100 156, 58 132, 58 104 Z", role: "ink", width: 3, fill: "crimson" },
    { d: "M 100 44 L 100 172 M 46 98 L 154 98", role: "accent", width: 4.5 },
  ],
  bow_arrow: [
    { d: "M 64 28 C 138 50, 138 150, 64 172", role: "ink", width: 6 },
    { d: "M 64 28 L 64 172", role: "detail", width: 2.5 },
    { d: "M 38 100 L 168 100", role: "accent", width: 5 },
    { d: "M 148 84 L 172 100 L 148 116 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 38 100 L 26 88 M 38 100 L 26 112", role: "accent", width: 3.5 },
  ],
  trophy_cup: [
    { d: "M 58 32 L 142 32 L 134 98 C 130 124, 70 124, 66 98 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 60 44 C 30 44, 30 90, 64 90", role: "ink", width: 4.5 },
    { d: "M 140 44 C 170 44, 170 90, 136 90", role: "ink", width: 4.5 },
    { d: "M 100 118 L 100 148 M 66 148 L 134 148 L 144 170 L 56 170 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 100 54 L 106 68 L 120 70 L 110 80 L 112 94 L 100 86 L 88 94 L 90 80 L 80 70 L 94 68 Z", role: "accent", width: 3.5 },
  ],
  microphone: [
    { d: "M 78 46 A 22 22 0 0 1 122 46 L 122 90 A 22 22 0 0 1 78 90 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 78 68 L 122 68 M 78 52 L 122 52 M 78 84 L 122 84 M 100 24 L 100 112", role: "detail", width: 2.5 },
    { d: "M 64 78 C 64 124, 136 124, 136 78", role: "accent", width: 4.5 },
    { d: "M 100 118 L 100 164 M 70 164 L 130 164", role: "ink", width: 5 },
    { d: "M 44 52 Q 32 70 44 88 M 32 42 Q 18 70 32 98 M 156 52 Q 168 70 156 88 M 168 42 Q 182 70 168 98", role: "accent", width: 3 },
  ],
  chess_piece: [
    { d: "M 100 18 L 100 42 M 88 30 L 112 30", role: "accent", width: 4.5 },
    { d: "M 76 50 L 124 50 L 116 76 L 130 142 L 70 142 L 84 76 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 54 142 L 146 142 L 154 166 L 46 166 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 26 176 L 174 176", role: "ink", width: 4 },
    { d: "M 40 176 L 54 166 M 80 176 L 88 166 M 120 176 L 112 166 M 160 176 L 146 166", role: "detail", width: 3 },
  ],
  key_lock: [
    { d: "M 70 88 L 70 58 A 30 30 0 0 1 130 58 L 130 88", role: "ink", width: 6 },
    { d: "M 52 88 L 148 88 L 148 166 L 52 166 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 64 100 L 136 100", role: "detail", width: 2.5 },
    { d: "M 100 112 A 11 11 0 1 1 99.9 112 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 94 128 L 106 128 L 108 150 L 92 150 Z", role: "ink", width: 3.5, fill: "slate" },
  ],
  door_portal: [
    { d: "M 54 170 L 54 30 L 146 30 L 146 170 Z", role: "ink", width: 5, fill: "accentSoft" },
    { d: "M 54 30 L 118 44 L 118 156 L 54 170 Z", role: "ink", width: 4.5, fill: "warm" },
    { d: "M 118 44 L 170 24 M 118 156 L 170 176 M 126 76 L 170 76 M 126 124 L 170 124", role: "accent", width: 3.5 },
    { d: "M 102 98 A 5 5 0 1 1 101.9 98 Z", role: "ink", width: 4, fill: "gold" },
  ],
  letter_envelope: [
    { d: "M 22 50 L 178 50 L 178 152 L 22 152 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 22 50 L 100 112 L 178 50", role: "ink", width: 4.5 },
    { d: "M 22 152 L 74 96 M 178 152 L 126 96", role: "detail", width: 3 },
    { d: "M 100 94 A 15 15 0 1 1 99.9 94 Z", role: "ink", width: 4.5, fill: "crimson" },
  ],
  book_journal: [
    { d: "M 100 52 C 74 38, 44 38, 22 50 L 22 156 C 44 144, 74 144, 100 160 C 126 144, 156 144, 178 156 L 178 50 C 156 38, 126 38, 100 52 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 100 52 L 100 160", role: "ink", width: 4 },
    { d: "M 40 76 L 84 72 M 40 96 L 84 92 M 40 116 L 84 112 M 40 134 L 72 132", role: "detail", width: 3 },
    { d: "M 116 72 L 160 76 M 116 92 L 160 96 M 116 112 L 160 116 M 116 132 L 148 134", role: "accent", width: 3 },
  ],
  prison_bars: [
    { d: "M 32 40 L 168 40 L 168 164 L 32 164 Z", role: "detail", width: 2.5, fill: "slate" },
    { d: "M 22 34 L 178 34 M 22 166 L 178 166", role: "ink", width: 6 },
    { d: "M 44 34 L 44 166 M 72 34 L 72 166 M 100 34 L 100 166 M 128 34 L 128 166 M 156 34 L 156 166", role: "ink", width: 5 },
    { d: "M 64 94 A 16 12 0 0 1 82 94 M 118 94 A 16 12 0 0 1 136 94", role: "accent", width: 4 },
  ],
  police_badge: [
    { d: "M 100 18 L 124 66 L 176 74 L 138 112 L 148 164 L 100 140 L 52 164 L 62 112 L 24 74 L 76 66 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 100 66 A 32 32 0 1 1 99.9 66 Z", role: "ink", width: 4, fill: "cool" },
    { d: "M 82 98 L 118 98 M 100 82 L 100 114", role: "accent", width: 3.5 },
  ],
  syringe_vial: [
    { d: "M 74 38 L 126 38 L 126 48 L 74 48 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 80 48 L 80 64 L 62 78 L 62 164 Q 62 174 74 174 L 126 174 Q 138 174 138 164 L 138 78 L 120 64 L 120 48", role: "ink", width: 5, fill: "smoke" },
    { d: "M 62 114 L 138 114 L 138 164 L 62 164 Z", role: "ink", width: 4, fill: "accentMid" },
    { d: "M 82 138 L 118 138 M 100 122 L 100 154", role: "ink", width: 4 },
    { d: "M 64 92 L 78 92 M 64 104 L 74 104", role: "detail", width: 3 },
  ],
  robot_android: [
    { d: "M 100 62 L 100 34 M 100 20 A 8 8 0 1 1 99.9 20 Z", role: "accent", width: 4.5, fill: "crimson" },
    { d: "M 44 62 L 156 62 L 156 156 L 44 156 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 28 92 L 44 92 L 44 128 L 28 128 Z M 156 92 L 172 92 L 172 128 L 156 128 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 60 86 L 140 86 L 140 114 L 60 114 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 72 132 L 128 132 M 86 124 L 86 140 M 100 124 L 100 140 M 114 124 L 114 140", role: "detail", width: 3 },
  ],
  alien_ufo: [
    { d: "M 64 84 C 64 40, 136 40, 136 84", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 20 98 C 20 76, 180 76, 180 98 C 180 120, 20 120, 20 98 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 60 98 A 6 6 0 1 1 59.9 98 Z M 100 98 A 6 6 0 1 1 99.9 98 Z M 140 98 A 6 6 0 1 1 139.9 98 Z", role: "accent", width: 4, fill: "gold" },
    { d: "M 78 120 L 44 178 L 156 178 L 122 120 Z", role: "accent", width: 3.5, fill: "accentSoft" },
    { d: "M 100 120 L 100 176", role: "detail", width: 2.5 },
  ],
  coffee_mug: [
    { d: "M 42 68 L 134 68 L 134 150 Q 134 168 112 168 L 64 168 Q 42 168 42 150 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 134 84 C 168 84, 168 134, 134 134", role: "ink", width: 5 },
    { d: "M 50 76 L 126 76", role: "ink", width: 3.5, fill: "slate" },
    { d: "M 68 50 Q 58 34 72 20 M 90 50 Q 80 34 94 20 M 112 50 Q 102 34 116 20", role: "accent", width: 3.5 },
    { d: "M 32 174 L 146 174", role: "detail", width: 3 },
  ],
  suitcase: [
    { d: "M 76 66 L 76 40 L 124 40 L 124 66", role: "ink", width: 5 },
    { d: "M 28 66 L 172 66 L 172 160 L 28 160 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 60 66 L 60 160 M 140 66 L 140 160", role: "accent", width: 4.5 },
    { d: "M 80 100 L 116 100 L 116 124 L 80 124 Z", role: "ink", width: 3, fill: "gold" },
  ],
  balloon: [
    { d: "M 100 22 C 62 22, 48 58, 52 84 C 58 112, 86 128, 100 134 C 114 128, 142 112, 148 84 C 152 58, 138 22, 100 22 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 92 134 L 108 134 L 100 144 Z", role: "ink", width: 3.5, fill: "crimson" },
    { d: "M 100 144 Q 116 158 92 170 T 106 188", role: "ink", width: 3.5 },
    { d: "M 74 48 Q 64 64 72 84", role: "detail", width: 3.5 },
  ],
  guitar_instrument: [
    { d: "M 138 24 L 158 44 L 108 94", role: "ink", width: 5 },
    { d: "M 74 94 C 50 86, 30 114, 46 138 C 30 160, 56 180, 82 164 C 104 178, 132 156, 116 132 C 128 110, 106 84, 84 96 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 82 114 A 11 11 0 1 1 81.9 114 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 148 34 L 84 98", role: "detail", width: 2.5 },
    { d: "M 34 74 Q 42 62 52 72", role: "accent", width: 3.5 },
  ],
  telephone: [
    { d: "M 38 74 C 38 42, 162 42, 162 74 L 148 94 L 126 84 C 114 72, 86 72, 74 84 L 52 94 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 52 98 L 38 160 L 162 160 L 148 98 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 100 108 A 20 20 0 1 1 99.9 108 Z", role: "ink", width: 4, fill: "smoke" },
    { d: "M 100 128 L 112 128", role: "accent", width: 3.5 },
    { d: "M 32 42 Q 24 32 38 24 M 168 42 Q 176 32 162 24", role: "accent", width: 3 },
  ],
  ticket_stub: [
    { d: "M 22 64 L 178 64 L 178 88 A 12 12 0 0 0 178 112 L 178 138 L 22 138 L 22 112 A 12 12 0 0 0 22 88 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 130 64 L 130 138", role: "detail", width: 3 },
    { d: "M 48 88 L 108 88 M 48 112 L 108 112", role: "accent", width: 4.5 },
    { d: "M 148 94 L 154 100 L 148 106", role: "ink", width: 3 },
  ],
  compass: [
    { d: "M 100 26 A 74 74 0 1 1 99.9 26 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 100 40 A 60 60 0 1 1 99.9 40 Z", role: "ink", width: 3, fill: "smoke" },
    { d: "M 100 44 L 114 100 L 86 100 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 86 100 L 114 100 L 100 156 Z", role: "ink", width: 4, fill: "slate" },
  ],
  heart_broken: [
    { d: "M 100 166 C 40 126, 22 84, 48 52 C 70 30, 94 46, 100 64 C 106 46, 130 30, 152 52 C 178 84, 160 126, 100 166 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 100 64 L 88 94 L 114 114 L 94 152", role: "ink", width: 4.5 },
    { d: "M 64 62 Q 54 74 60 88", role: "detail", width: 3 },
  ],
  puzzle_cube: [
    { d: "M 100 28 L 164 64 L 164 136 L 100 172 L 36 136 L 36 64 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 36 64 L 100 100 L 164 64 L 100 28 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 100 100 L 100 172 L 164 136 L 164 64 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 68 46 L 132 82 M 132 46 L 68 82", role: "detail", width: 2.5 },
    { d: "M 100 136 L 164 100 M 36 100 L 100 136", role: "detail", width: 2.5 },
  ],
  scooter_vespa: [
    { d: "M 18 164 L 182 164", role: "detail", width: 3 },
    { d: "M 118 46 L 146 46 L 152 60 L 134 114 L 152 134", role: "ink", width: 5 },
    { d: "M 148 56 A 10 10 0 1 1 147.9 56 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 42 104 Q 68 90 96 104 L 110 132 L 42 132 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 54 96 L 94 96 L 98 106 L 52 106 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 96 122 L 128 122 L 136 86 L 152 94 L 144 136 L 50 136", role: "ink", width: 4.5, fill: "accentSoft" },
    { d: "M 56 140 A 18 18 0 1 1 55.9 140 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 56 140 A 7 7 0 1 1 55.9 140 Z", role: "detail", width: 3 },
    { d: "M 144 140 A 18 18 0 1 1 143.9 140 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 144 140 A 7 7 0 1 1 143.9 140 Z", role: "detail", width: 3 },
    { d: "M 22 128 L 36 128 M 16 140 L 32 140", role: "accent", width: 3.5 },
  ],
  cricket_bat_ball: [
    { d: "M 24 166 L 176 166", role: "detail", width: 3 },
    { d: "M 122 64 L 122 162 M 138 64 L 138 162 M 154 64 L 154 162", role: "ink", width: 4.5 },
    { d: "M 118 62 L 138 62 M 138 62 L 158 62", role: "accent", width: 4 },
    { d: "M 48 162 L 72 68 L 96 74 L 74 166 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 80 70 L 90 26 L 100 28 L 88 72", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 70 96 L 80 98 M 64 122 L 74 124", role: "detail", width: 3 },
    { d: "M 152 126 A 16 16 0 1 1 151.9 126 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 140 138 Q 152 144 164 138", role: "detail", width: 2.5 },
  ],
  coin_toss: [
    { d: "M 100 54 A 46 46 0 1 1 99.9 54 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 100 68 A 32 32 0 1 1 99.9 68 Z", role: "ink", width: 3, fill: "warm" },
    { d: "M 86 92 L 100 78 L 114 92 L 108 114 L 92 114 Z", role: "accent", width: 4, fill: "accentMid" },
    { d: "M 100 18 Q 124 30 112 46", role: "accent", width: 3.5 },
    { d: "M 112 46 L 104 38 M 112 46 L 122 44", role: "accent", width: 3.5 },
    { d: "M 42 158 Q 100 184 158 158", role: "accent", width: 3.5 },
    { d: "M 56 172 L 144 172", role: "detail", width: 2.5 },
  ],
  diya_lamp: [
    { d: "M 100 32 C 118 52, 122 76, 100 88 C 78 76, 82 52, 100 32 Z", role: "accent", width: 4.5, fill: "gold" },
    { d: "M 100 54 C 108 64, 108 78, 100 84 C 92 78, 92 64, 100 54 Z", role: "accent", width: 3, fill: "crimson" },
    { d: "M 32 104 L 168 104 C 160 144, 134 158, 100 158 C 66 158, 40 144, 32 104 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 64 158 L 136 158 L 144 172 L 56 172 Z", role: "ink", width: 4.5, fill: "accentSoft" },
    { d: "M 54 122 Q 78 134 100 122 T 146 122", role: "detail", width: 3 },
    { d: "M 100 14 L 100 24 M 64 34 L 74 44 M 136 34 L 126 44 M 44 66 L 58 68 M 156 66 L 142 68", role: "accent", width: 3 },
  ],
  palace_arch: [
    { d: "M 20 170 L 180 170", role: "ink", width: 4.5 },
    { d: "M 34 170 L 34 86 L 166 86 L 166 170", role: "ink", width: 5, fill: "warm" },
    { d: "M 100 22 C 122 44, 134 64, 132 86 L 68 86 C 66 64, 78 44, 100 22 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 50 48 C 60 58, 62 72, 60 86 L 36 86 C 34 72, 40 58, 50 48 Z", role: "ink", width: 4, fill: "accentSoft" },
    { d: "M 150 48 C 160 58, 166 72, 164 86 L 140 86 C 138 72, 140 58, 150 48 Z", role: "ink", width: 4, fill: "accentSoft" },
    { d: "M 74 170 L 74 126 Q 100 96 126 126 L 126 170 Z", role: "ink", width: 4.5, fill: "slate" },
    { d: "M 100 10 L 100 22 M 50 38 L 50 48 M 150 38 L 150 48", role: "accent", width: 3.5 },
  ],
  paint_palette: [
    {
      d: "M 104 34 C 54 34, 24 68, 28 108 C 32 146, 70 166, 114 162 C 136 160, 142 142, 130 130 C 120 120, 134 106, 150 108 C 172 110, 178 82, 166 62 C 154 42, 132 34, 104 34 Z",
      role: "ink",
      width: 5,
      fill: "warm",
    },
    { d: "M 144 124 A 11 11 0 1 1 143.9 124 Z", role: "ink", width: 3.5, fill: "smoke" },
    { d: "M 64 74 A 10 10 0 1 1 63.9 74 Z", role: "accent", width: 3.5, fill: "crimson" },
    { d: "M 96 58 A 10 10 0 1 1 95.9 58 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 130 66 A 10 10 0 1 1 129.9 66 Z", role: "accent", width: 3.5, fill: "cool" },
    { d: "M 62 112 A 10 10 0 1 1 61.9 112 Z", role: "accent", width: 3.5, fill: "emerald" },
    { d: "M 148 30 L 82 144 L 74 160 L 92 150 L 158 36 Z", role: "ink", width: 4, fill: "slate" },
  ],
  piano_keys: [
    { d: "M 24 44 L 176 44 L 176 156 L 24 156 Z", role: "ink", width: 5, fill: "smoke" },
    { d: "M 54 44 L 54 156 M 84 44 L 84 156 M 114 44 L 114 156 M 144 44 L 144 156", role: "ink", width: 3 },
    { d: "M 44 44 L 64 44 L 64 110 L 44 110 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 74 44 L 94 44 L 94 110 L 74 110 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 134 44 L 154 44 L 154 110 L 134 110 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 78 24 Q 88 14 98 22 M 118 28 Q 128 18 138 26", role: "accent", width: 3.5 },
  ],
  gold_medal: [
    { d: "M 54 22 L 86 22 L 106 76 L 78 76 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 146 22 L 114 22 L 94 76 L 122 76 Z", role: "ink", width: 4.5, fill: "cool" },
    { d: "M 100 72 A 48 48 0 1 1 99.9 72 Z", role: "ink", width: 5, fill: "gold" },
    { d: "M 100 84 A 36 36 0 1 1 99.9 84 Z", role: "detail", width: 2.5 },
    { d: "M 100 94 L 107 110 L 124 112 L 111 124 L 114 140 L 100 132 L 86 140 L 89 124 L 76 112 L 93 110 Z", role: "accent", width: 3.5, fill: "accentMid" },
    { d: "M 36 106 L 46 106 M 41 101 L 41 111 M 154 106 L 164 106 M 159 101 L 159 111", role: "accent", width: 3 },
  ],
  motorcycle_sidecar: [
    { d: "M 16 158 L 184 158", role: "detail", width: 3 },
    { d: "M 48 124 A 22 22 0 1 1 47.9 124 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 152 124 A 22 22 0 1 1 151.9 124 Z", role: "ink", width: 5, fill: "slate" },
    { d: "M 48 144 L 84 96 L 130 96 L 152 144", role: "ink", width: 5 },
    { d: "M 72 86 C 84 72, 114 72, 126 86 L 116 102 L 78 102 Z", role: "ink", width: 4.5, fill: "crimson" },
    { d: "M 118 66 L 140 60 L 132 96", role: "ink", width: 4.5 },
    { d: "M 148 76 A 9 9 0 1 1 147.9 76 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 54 114 L 104 114 L 110 138 L 48 138 Z", role: "ink", width: 4, fill: "accentSoft" },
    { d: "M 20 112 L 42 112 M 14 126 L 34 126", role: "accent", width: 3.5 },
  ],
  wedding_garland: [
    { d: "M 44 42 C 44 128, 156 128, 156 42", role: "ink", width: 4 },
    { d: "M 58 64 A 13 13 0 1 1 57.9 64 Z", role: "ink", width: 3.5, fill: "gold" },
    { d: "M 76 92 A 14 14 0 1 1 75.9 92 Z", role: "ink", width: 3.5, fill: "accentMid" },
    { d: "M 100 104 A 15 15 0 1 1 99.9 104 Z", role: "ink", width: 4, fill: "crimson" },
    { d: "M 124 92 A 14 14 0 1 1 123.9 92 Z", role: "ink", width: 3.5, fill: "accentMid" },
    { d: "M 142 64 A 13 13 0 1 1 141.9 64 Z", role: "ink", width: 3.5, fill: "gold" },
    { d: "M 100 132 L 100 162 M 88 150 L 100 168 L 112 150", role: "accent", width: 3.5, fill: "emerald" },
    { d: "M 32 34 L 56 34 M 144 34 L 168 34", role: "detail", width: 3 },
  ],
  radio_transistor: [
    { d: "M 136 56 L 168 20", role: "ink", width: 4 },
    { d: "M 168 20 A 5 5 0 1 1 167.9 20 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 28 60 L 172 60 L 172 156 L 28 156 Z", role: "ink", width: 5, fill: "warm" },
    { d: "M 46 82 L 92 82 L 92 134 L 46 134 Z", role: "ink", width: 4, fill: "slate" },
    { d: "M 54 96 L 84 96 M 54 108 L 84 108 M 54 120 L 84 120", role: "detail", width: 2.5 },
    { d: "M 110 82 L 154 82 L 154 102 L 110 102 Z", role: "ink", width: 3.5, fill: "cool" },
    { d: "M 124 82 L 124 102", role: "accent", width: 3 },
    { d: "M 132 118 A 14 14 0 1 1 131.9 118 Z", role: "ink", width: 4, fill: "gold" },
    { d: "M 14 78 Q 4 98 14 118 M 186 78 Q 196 98 186 118", role: "accent", width: 3 },
  ],
  stethoscope: [
    { d: "M 54 32 L 48 76 C 46 116, 114 116, 112 76 L 106 32", role: "ink", width: 5 },
    { d: "M 48 32 L 60 32 M 100 32 L 112 32", role: "accent", width: 5 },
    { d: "M 80 106 C 80 158, 146 164, 146 124 L 146 106", role: "ink", width: 5 },
    { d: "M 146 80 A 18 18 0 1 1 145.9 80 Z", role: "ink", width: 5, fill: "cool" },
    { d: "M 146 90 A 8 8 0 1 1 145.9 90 Z", role: "accent", width: 3, fill: "crimson" },
  ],
  mustard_field: [
    { d: "M 18 158 Q 100 132 182 158 L 182 174 L 18 174 Z", role: "ink", width: 4, fill: "emerald" },
    { d: "M 48 148 L 44 82 M 74 142 L 72 64 M 100 140 L 100 54 M 126 142 L 128 66 M 152 148 L 156 84", role: "ink", width: 3.5 },
    { d: "M 44 68 A 12 12 0 1 1 43.9 68 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 72 50 A 14 14 0 1 1 71.9 50 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 100 40 A 15 15 0 1 1 99.9 40 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 128 52 A 14 14 0 1 1 127.9 52 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 156 70 A 12 12 0 1 1 155.9 70 Z", role: "accent", width: 3.5, fill: "gold" },
    { d: "M 32 34 Q 60 24 88 34 M 120 28 Q 148 18 174 30", role: "detail", width: 2.5 },
  ],
  paper_kite: [
    { d: "M 100 22 L 158 76 L 100 136 L 42 76 Z", role: "ink", width: 5, fill: "crimson" },
    { d: "M 100 22 L 158 76 L 100 76 Z", role: "ink", width: 3.5, fill: "gold" },
    { d: "M 100 22 L 100 136 M 42 76 L 158 76", role: "ink", width: 3.5 },
    { d: "M 100 136 L 86 154 L 114 154 Z", role: "ink", width: 4, fill: "cool" },
    { d: "M 100 154 Q 124 166 94 176 T 116 192", role: "accent", width: 3.5 },
    { d: "M 34 38 Q 48 26 64 34", role: "detail", width: 2.5 },
  ],
};

export const ILLUSTRATION_IDS = Object.keys(ILLUSTRATION_LIBRARY) as IllustrationId[];
