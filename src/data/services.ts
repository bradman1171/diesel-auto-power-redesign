/** DAP Services listings captured from https://www.dieselautopower.com/injector-testing (Nov 2026). */
const L = "https://www.dieselautopower.com";
export interface Service { name: string; price: number; application: string; url: string }
export const SERVICES: Service[] = [
  { name: "DAP Common Rail Injector Testing Stage 1", price: 45, application: "Universal", url: `${L}/dap-common-rail-injector-testing-stage-1.html` },
  { name: "DAP Common Rail Injector Testing Stage 2", price: 69, application: "Universal", url: `${L}/dap-common-rail-injector-testing-stage-2.html` },
  { name: "DAP Common Rail Injector Testing Stage 3 (includes nozzle installation and re-test)", price: 89, application: "Universal", url: `${L}/dap-common-rail-injector-testing-stage-3-includes-nozzle-installation-and-re-test.html` },
  { name: "DAP Common Rail Injector Testing For LML, Ford 6.7L and Other PIEZO Injectors", price: 50, application: "Universal", url: `${L}/dap-common-rail-injector-testing-for-lml-ford-67l-and-other-piezo-injectors.html` },
  { name: "DAP HEUI Injector Testing For Ford 7.3L & 6.0L Injectors", price: 50, application: "Universal", url: `${L}/dap-huei-injector-testing-for-ford-73l-67l-injectors.html` },
  { name: "DAP Mechanical Testing for 12V and 24V Injectors (DAP Injectors Only)", price: 165, application: "1991.5-2002 Dodge RAM Cummins 5.9L", url: `${L}/dap-mechanical-testing-for-12v-and-24v-injectors-dap-injectors-only.html` },
  { name: "DAP Mechanical Testing for 12V and 24V Injectors (Non-DAP Injectors)", price: 215, application: "1991.5-2002 Dodge RAM Cummins 5.9L", url: `${L}/dap-mechanical-testing-for-12v-and-24v-injectors-non-dap-injectors.html` },
  { name: "S300 Turbo Rebuild and Balance Service", price: 399, application: "S300 turbochargers", url: `${L}/turbo-rebuild` },
  { name: "S400 Turbo Rebuild and Balance Service", price: 449, application: "Universal", url: `${L}/s400-turbo-rebuild-and-balance-service.html` },
];
