/**
 * features/test-generator — summary UI + printable PDF helpers.
 */
export { TestSummary, GenerateTestModal } from "./components";
export { buildTestPaperHtml } from "./utils/buildTestPaperHtml";
export { generatePdf } from "./utils/generatePdf";
export {
  loadTestSettings,
  saveTestSettings,
  loadInstitutes,
  rememberInstitute,
  applyMarksConfig,
} from "./utils/testSettingsStorage";
