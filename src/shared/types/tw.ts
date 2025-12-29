export interface UI {
  InfoMessage(msg: string): void;
  SuccessMessage(msg: string, timeout?: number): void;
  ErrorMessage(msg: string, timeout?: number): void;
}

export interface InfoAlly {
  ally_id: number;
}

export interface Bonus {
  wood?: number;
  stone?: number;
  iron?: number;
  farm?: number;
  barracks?: number;
  stable?: number;
  garage?: number;
  storage?: number;
}

export interface Buildings {
  barracks: string;
  farm: string;
  garage: string;
  hide: string;
  iron: string;
  main: string;
  market: string;
  place: string;
  smith: string;
  snob: string;
  stable: string;
  statue: string;
  stone: string;
  storage: string;
  wall: string;
  wood: string;
}

export interface Village {
  bonus: Bonus;
  bonus_id: number;
  buildings: Buildings;
  coord: string;
  display_name: string;
  id: number;
  iron: number;
  iron_float: number;
  iron_prod: number;
  is_farm_upgradable: boolean;
  last_res_tick: number;
  modifications: number;
  name: string;
  player_id: number;
  points: number;
  pop: number;
  pop_max: number;
  stone: number;
  stone_float: number;
  stone_prod: number;
  storage_max: number;
  trader_away: number;
  wood: number;
  wood_float: number;
  wood_prod: number;
  x: number;
  y: number;
}

export interface Player {
  id: number;
  name: string;
  ally: string;
  ally_level: string;
  ally_member_count: number;
  email_valid: number;
}

export interface Feature {
  possible: boolean;
  active: boolean;
}

export interface GameData {
  rtl: boolean;
  csrf: string;
  device: string;
  features: {
    Premium: Feature;
    AccountManager: Feature;
    FarmAssistent: Feature;
  };
  group_id: number;
  link_base: string;
  link_base_pure: string;
  locale: string;
  majorVersion: string;
  market: string;
  mode: any;
  nav: {
    parent: number;
  };
  player: Player;
  pregame: boolean;
  quest: {
    use_questlines: boolean;
  };
  screen: string;
  time_generated: number;
  units: string[];
  version: string;
  village: Village;
  world: string;
}

export interface InfoPlayer {
  player_id: number;
}