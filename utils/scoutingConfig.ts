/**
 * Scouting Configuration File
 * 
 * This file contains the centralized field definitions for all scouting phases.
 * Update this file each year to reflect the new game's scoring elements.
 * 
 * The Scout App and Super Scout both read field definitions from Firebase
 * (years/{YEAR}/scouting/{phase}), but this file serves as the canonical
 * reference for what should be stored there, and provides default values
 * for slider ranges, section groupings, and field metadata.
 * 
 * FIELD TYPES:
 *   - counter          : tap +/- integer counter (e.g. pieces scored)
 *   - boolean          : on/off toggle (e.g. crossed auto line)
 *   - slider           : range slider with min/max (e.g. fuel estimate)
 *   - radio            : single-select radio group (e.g. starting position)
 *   - selection        : dropdown/select (e.g. climb level)
 *   - timer            : cycle stopwatch (e.g. intake-to-score time)
 *   - text             : free-form text input (e.g. comments)
 *   - short            : single-line text input
 * 
 * FORMAT IN FIREBASE:
 *   Each field is stored as "Field Name:type" in an array, e.g.:
 *     "FUEL Scored:slider 0 200"
 *     "Crossed Line:boolean"
 *     "Starting Position:radio Left,Center,Right"
 */

export interface FieldDefinition {
  name: string;
  type: 'counter' | 'boolean' | 'slider' | 'radio' | 'selection' | 'timer' | 'text' | 'short';
  /** For slider type: minimum value */
  min?: number;
  /** For slider type: maximum value */
  max?: number;
  /** For slider type: step increment */
  step?: number;
  /** For radio/selection type: available options */
  options?: string[];
  /** Default value for this field */
  defaultValue?: any;
}

export interface SectionDefinition {
  sectionName: string;
  fields: FieldDefinition[];
}

export interface PhaseConfig {
  phaseName: string;
  phaseLabel: string;
  /** Duration string shown in header, e.g. "20s" */
  duration?: string;
  sections: SectionDefinition[];
}

// ============================================================
// 2026 SEASON CONFIGURATION
// Update this object each year with the new game's elements.
// ============================================================

export const SEASON_YEAR = '2026';

export const autonConfig: PhaseConfig = {
  phaseName: 'auton',
  phaseLabel: 'AUTO',
  duration: '20s',
  sections: [
    {
      sectionName: 'Setup',
      fields: [
        { name: 'Starting Position', type: 'radio', options: ['Left', 'Center', 'Right'], defaultValue: 'Left' },
        { name: 'Crossed Auto Line', type: 'boolean', defaultValue: false },
      ],
    },
    {
      sectionName: 'FUEL Scoring',
      fields: [
        { name: 'FUEL Preloaded', type: 'counter', min: 0, max: 8, defaultValue: 0 },
        { name: 'FUEL Scored in HUB', type: 'slider', min: 0, max: 60, step: 5, defaultValue: 0 },
        { name: 'FUEL Missed', type: 'slider', min: 0, max: 30, step: 5, defaultValue: 0 },
        { name: 'HP FUEL Scored', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 0 },
      ],
    },
    {
      sectionName: 'Climb',
      fields: [
        { name: 'Auto Climb Level', type: 'radio', options: ['None', 'Level 1'], defaultValue: 'None' },
      ],
    },
  ],
};

export const teleopConfig: PhaseConfig = {
  phaseName: 'teleop',
  phaseLabel: 'TELEOP',
  duration: '2:20',
  sections: [
    {
      sectionName: 'FUEL Scoring',
      fields: [
        { name: 'FUEL Scored in Active HUB', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 0 },
        { name: 'FUEL Missed', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 0 },
      ],
    },
    {
      sectionName: 'Human Player Scoring',
      fields: [
        { name: 'HP FUEL Scored', type: 'slider', min: 0, max: 200, step: 5, defaultValue: 0 },
      ],
    },
    {
      sectionName: 'Cycle Timer',
      fields: [
        { name: 'Intake to Score Cycle', type: 'timer', defaultValue: [] },
      ],
    },
    {
      sectionName: 'Strategy',
      fields: [
        { name: 'Primary Intake Source', type: 'radio', options: ['Floor', 'Human Player', 'Both'], defaultValue: 'Floor' },
        { name: 'Shooting Position', type: 'radio', options: ['Close', 'Mid', 'Far', 'Variable'], defaultValue: 'Close' },
      ],
    },
    {
      sectionName: 'Defense',
      fields: [
        { name: 'Played Defense', type: 'boolean', defaultValue: false },
        { name: 'Defense Rating', type: 'selection', options: ['None', 'Weak', 'Average', 'Strong'], defaultValue: 'None' },
        { name: 'Received Defense', type: 'boolean', defaultValue: false },
        { name: 'Defense Impact', type: 'selection', options: ['None', 'Low', 'Medium', 'High'], defaultValue: 'None' },
      ],
    },
    {
      sectionName: 'Robot Status',
      fields: [
        { name: 'Fouls Committed', type: 'counter', min: 0, max: 20, defaultValue: 0 },
        { name: 'Broke Down', type: 'boolean', defaultValue: false },
        { name: 'Tipped Over', type: 'boolean', defaultValue: false },
        { name: 'Teleop Notes', type: 'text', defaultValue: '' },
      ],
    },
  ],
};

export const endgameConfig: PhaseConfig = {
  phaseName: 'endgame',
  phaseLabel: 'END GAME',
  duration: '30s',
  sections: [
    {
      sectionName: 'TOWER Climb',
      fields: [
        { name: 'Attempted Climb', type: 'boolean', defaultValue: false },
        { name: 'Final Climb Level', type: 'selection', options: ['None', 'Level 1', 'Level 2', 'Level 3'], defaultValue: 'None' },
        { name: 'Climb Time', type: 'counter', min: 0, max: 90, defaultValue: 0 },
      ],
    },
    {
      sectionName: 'Parking',
      fields: [
        { name: 'Parked', type: 'boolean', defaultValue: false },
      ],
    },
    {
      sectionName: 'End Game Scoring',
      fields: [
        { name: 'FUEL Scored in End Game', type: 'slider', min: 0, max: 100, step: 5, defaultValue: 0 },
      ],
    },
    {
      sectionName: 'Comments',
      fields: [
        { name: 'Match Comments', type: 'text', defaultValue: '' },
      ],
    },
  ],
};

export const pitScoutConfig: SectionDefinition[] = [
  {
    sectionName: 'Robot Specs',
    fields: [
      { name: 'Drivetrain Type', type: 'selection', options: ['Tank', 'Mecanum', 'Swerve', 'Other'], defaultValue: 'Tank' },
      { name: 'Robot Weight (lbs)', type: 'counter', min: 0, max: 150, defaultValue: 0 },
      { name: 'Robot Footprint', type: 'short', defaultValue: '' },
      { name: 'Hopper Volume', type: 'counter', min: 0, max: 50, defaultValue: 0 },
      { name: 'Firing Rate (per sec)', type: 'counter', min: 0, max: 20, defaultValue: 0 },
    ],
  },
  {
    sectionName: 'Capabilities',
    fields: [
      { name: 'Can Climb', type: 'boolean', defaultValue: false },
      { name: 'Max Climb Level', type: 'selection', options: ['None', 'Level 1', 'Level 2', 'Level 3'], defaultValue: 'None' },
      { name: 'Intake Type', type: 'selection', options: ['Ground', 'Human Player', 'Both', 'None'], defaultValue: 'None' },
      { name: 'Scoring Locations', type: 'selection', options: ['Low Hub', 'High Hub', 'Both'], defaultValue: 'Both' },
    ],
  },
  {
    sectionName: 'Strategy',
    fields: [
      { name: 'Primary Strategy', type: 'text', defaultValue: '' },
      { name: 'Auto Routine Description', type: 'text', defaultValue: '' },
      { name: 'Additional Notes', type: 'text', defaultValue: '' },
    ],
  },
];

/**
 * Converts a PhaseConfig to the Firebase-compatible format (array of "name:type" strings)
 * that the 2024 and earlier systems expected.
 */
export function phaseToFirebaseFormat(config: PhaseConfig): string[] {
  const result: string[] = [];
  for (const section of config.sections) {
    for (const field of section.fields) {
      let typeStr: string = field.type;
      if (field.type === 'slider' && field.min !== undefined && field.max !== undefined) {
        typeStr = `slider ${field.min} ${field.max}`;
      } else if ((field.type === 'radio' || field.type === 'selection') && field.options) {
        typeStr = `${field.type} ${field.options.join(',')}`;
      }
      result.push(`${field.name}:${typeStr}`);
    }
  }
  return result;
}
