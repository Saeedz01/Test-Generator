/**
 * @jest-environment jsdom
 */
import { buildTestPaperHtml } from './buildTestPaperHtml';

describe('buildTestPaperHtml language', () => {
  const questions = [
    {
      id: '1',
      type: 'mcq',
      statement: 'What is force?',
      statementUr: 'قوت کیا ہے؟',
      marks: 1,
      options: [
        { en: 'Push', ur: 'دھکا' },
        { en: 'Pull', ur: 'کھینچنا' },
        { en: 'Both', ur: 'دونوں' },
        { en: 'None', ur: 'کوئی نہیں' },
      ],
    },
  ];

  const meta = {
    instituteName: 'Test School',
    className: '9th',
    timeAllowed: '1 hour',
    totalMarks: 1,
    copiesPerPage: 1,
  };

  it('renders English statements by default', () => {
    const html = buildTestPaperHtml(meta, questions);
    expect(html).toContain('What is force?');
    expect(html).toContain('Push');
  });

  it('renders Urdu when paperLanguage is ur', () => {
    const html = buildTestPaperHtml(
      { ...meta, paperLanguage: 'ur' },
      questions,
    );
    expect(html).toContain('قوت کیا ہے؟');
    expect(html).toContain('دھکا');
    expect(html).toContain('Noto Nastaliq Urdu');
    expect(html).toContain('lang="ur"');
  });

  it('renders both languages when paperLanguage is both', () => {
    const html = buildTestPaperHtml(
      { ...meta, paperLanguage: 'both' },
      questions,
    );
    expect(html).toContain('What is force?');
    expect(html).toContain('قوت کیا ہے؟');
    expect(html).toContain('Push');
    expect(html).toContain('دھکا');
  });
});
