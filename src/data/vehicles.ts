/**
 * Vehicle platforms and engine generations.
 * Generations and year ranges mirror the live DAP mega-menu (captured Nov 2026),
 * each with the link to its live category. Miva equivalent: category tree per generation.
 */
export type PlatformId = "cummins" | "duramax" | "powerstroke" | "light-duty";

export interface Engine {
  id: string;
  platform: PlatformId;
  label: string;
  short: string;
  yearFrom: number;
  yearTo: number;
  liveUrl: string;
}

export interface Platform {
  id: PlatformId;
  name: string;
  make: string;
  tagline: string;
}

const L = "https://www.dieselautopower.com";

export const PLATFORMS: Platform[] = [
  { id: "cummins", name: "Cummins", make: "Dodge / Ram", tagline: "Our specialty — 12V, 24V and common rail" },
  { id: "duramax", name: "Duramax", make: "Chevrolet / GMC", tagline: "LB7 through L5P" },
  { id: "powerstroke", name: "Powerstroke", make: "Ford", tagline: "7.3L through 6.7L" },
  { id: "light-duty", name: "Light Duty", make: "EcoDiesel / 3.0L / 2.8L", tagline: "Ram 1500, Jeep, F-150, Colorado" },
];

export const ENGINES: Engine[] = [
  { id: "c12a", platform: "cummins", label: "1989-1993 Dodge Cummins 5.9L 12V", short: "5.9L 12V (1st Gen)", yearFrom: 1989, yearTo: 1993, liveUrl: `${L}/dodge-ram-cummins/1989-1993-5-9l-12-valve-dodge-cummins` },
  { id: "c12b", platform: "cummins", label: "1994-1998 Dodge Cummins 5.9L 12V", short: "5.9L 12V (P-Pump)", yearFrom: 1994, yearTo: 1998, liveUrl: `${L}/dodge-ram-cummins/1994-1998-5-9l-12-valve-dodge-cummins` },
  { id: "c24", platform: "cummins", label: "1998.5-2002 Dodge Cummins 5.9L 24V", short: "5.9L 24V (VP44)", yearFrom: 1998, yearTo: 2002, liveUrl: `${L}/dodge-ram-cummins/1998-5-2002-5-9l-24-valve-dodge-cummins` },
  { id: "c59", platform: "cummins", label: "2003-2007 Dodge Cummins 5.9L Common Rail", short: "5.9L Common Rail", yearFrom: 2003, yearTo: 2007, liveUrl: `${L}/dodge-ram-cummins/2003-2007-5-9l-common-rail-dodge-cummins` },
  { id: "c67a", platform: "cummins", label: "2007.5-2018 Dodge Cummins 6.7L", short: "6.7L (2007.5-2018)", yearFrom: 2007, yearTo: 2018, liveUrl: `${L}/dodge-ram-cummins/2007-5-2015-6-7l-common-rail-dodge-cummins` },
  { id: "c67b", platform: "cummins", label: "2019-2026 Ram Cummins 6.7L", short: "6.7L (2019+)", yearFrom: 2019, yearTo: 2026, liveUrl: `${L}/2019-2021-dodge-cummins-67l.html` },
  { id: "lb7", platform: "duramax", label: "2001-2004 LB7 Duramax 6.6L", short: "LB7", yearFrom: 2001, yearTo: 2004, liveUrl: `${L}/gmc-chevy-duramax/2001-2004-lb7-duramax` },
  { id: "lly", platform: "duramax", label: "2004.5-2005 LLY Duramax 6.6L", short: "LLY", yearFrom: 2004, yearTo: 2005, liveUrl: `${L}/gmc-chevy-duramax/2004-5-2005-lly-duramax` },
  { id: "lbz", platform: "duramax", label: "2006-2007 LBZ Duramax 6.6L", short: "LBZ", yearFrom: 2006, yearTo: 2007, liveUrl: `${L}/gmc-chevy-duramax/2006-2007-lbz-duramax` },
  { id: "lmm", platform: "duramax", label: "2007.5-2010 LMM Duramax 6.6L", short: "LMM", yearFrom: 2007, yearTo: 2010, liveUrl: `${L}/gmc-chevy-duramax/2007-5-2010-lmm-duramax` },
  { id: "lml", platform: "duramax", label: "2011-2016 LML Duramax 6.6L", short: "LML", yearFrom: 2011, yearTo: 2016, liveUrl: `${L}/gmc-chevy-duramax/2011-2015-lml-duramax` },
  { id: "l5pa", platform: "duramax", label: "2017-2019 L5P Duramax 6.6L", short: "L5P (2017-2019)", yearFrom: 2017, yearTo: 2019, liveUrl: `${L}/gmc-chevy-duramax/2017-2017-6-6l-l5p-duramax` },
  { id: "l5pb", platform: "duramax", label: "2020-2026 L5P Duramax 6.6L", short: "L5P (2020+)", yearFrom: 2020, yearTo: 2026, liveUrl: `${L}/2020-2021-l5p-duramax.html` },
  { id: "f73a", platform: "powerstroke", label: "1994.5-1997 Powerstroke 7.3L", short: "7.3L (1994.5-1997)", yearFrom: 1994, yearTo: 1997, liveUrl: `${L}/ford-powerstroke/1994-1997-7-3l-powerstroke` },
  { id: "f73b", platform: "powerstroke", label: "1999-2003 Powerstroke 7.3L", short: "7.3L (1999-2003)", yearFrom: 1999, yearTo: 2003, liveUrl: `${L}/ford-powerstroke/1999-2003-7-3l-powerstroke` },
  { id: "f60", platform: "powerstroke", label: "2003-2007 Powerstroke 6.0L", short: "6.0L", yearFrom: 2003, yearTo: 2007, liveUrl: `${L}/ford-powerstroke/2003-5-2007-6-0l-powerstroke` },
  { id: "f64", platform: "powerstroke", label: "2008-2010 Powerstroke 6.4L", short: "6.4L", yearFrom: 2008, yearTo: 2010, liveUrl: `${L}/ford-powerstroke/2008-2010-6-4l-powerstroke` },
  { id: "f67a", platform: "powerstroke", label: "2011-2016 Powerstroke 6.7L", short: "6.7L (2011-2016)", yearFrom: 2011, yearTo: 2016, liveUrl: `${L}/ford-powerstroke/2011-2016-6-7l-powerstroke` },
  { id: "f67b", platform: "powerstroke", label: "2017-2026 Powerstroke 6.7L", short: "6.7L (2017+)", yearFrom: 2017, yearTo: 2026, liveUrl: `${L}/ford-powerstroke/2017-2017-6-7l-powerstroke` },
  { id: "eco-ram", platform: "light-duty", label: "2014-2021 Ram 1500 EcoDiesel 3.0L", short: "Ram EcoDiesel 3.0L", yearFrom: 2014, yearTo: 2021, liveUrl: `${L}/light-duty/3-0l-ecodiesel` },
  { id: "eco-jeep", platform: "light-duty", label: "2014-2018 Grand Cherokee EcoDiesel 3.0L", short: "Jeep EcoDiesel 3.0L", yearFrom: 2014, yearTo: 2018, liveUrl: `${L}/light-duty/jeep-3-0l-ecodiesel` },
  { id: "f30", platform: "light-duty", label: "2018-2021 Ford Powerstroke 3.0L", short: "Ford 3.0L", yearFrom: 2018, yearTo: 2021, liveUrl: `${L}/light-duty/3-0l-ford` },
  { id: "d28", platform: "light-duty", label: "2016-2020 GM Duramax 2.8L", short: "Duramax 2.8L", yearFrom: 2016, yearTo: 2020, liveUrl: `${L}/light-duty/2-8l-duramax` },
];

export function yearsFor(platform: PlatformId): number[] {
  const engs = ENGINES.filter((e) => e.platform === platform);
  const min = Math.min(...engs.map((e) => e.yearFrom));
  const max = Math.max(...engs.map((e) => e.yearTo));
  const out: number[] = [];
  for (let y = max; y >= min; y--) out.push(y);
  return out;
}

export function enginesFor(platform: PlatformId, year?: number): Engine[] {
  return ENGINES.filter(
    (e) => e.platform === platform && (year === undefined || (year >= e.yearFrom && year <= e.yearTo)),
  );
}

export const platformById = (id?: string) => PLATFORMS.find((p) => p.id === id);
export const engineById = (id?: string) => ENGINES.find((e) => e.id === id);
