/**
 * The team. Single source of truth for names, titles, photos and bios, so the
 * about page and the home team strip can never drift apart.
 */

import team from '../content/data/team.json';

/** EDITABLE IN THE CMS: src/content/data/team.json. */
export const TEAM = team.members;
