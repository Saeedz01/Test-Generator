import { describe, expect, it } from 'vitest';
import { buildTestPaperHtml } from './buildTestPaperHtml';

/** Rendered markup only — the <style> block also mentions class names. */
function bodyMarkup(html) {
  return html.replace(/<style>[\s\S]*?<\/style>/g, '');
}

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
    expect(html).toContain('q-text-bilingual');
    expect(html).toContain('question-both');
    expect(html).toContain('section-title-both');
    expect(html).toContain('options-both');
    expect(html).toContain('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)');
  });

  it('omits header when showPaperHeader is false', () => {
    const html = buildTestPaperHtml(
      { ...meta, showPaperHeader: false },
      questions,
    );
    const markup = bodyMarkup(html);
    expect(markup).toContain('sheet-questions-only');
    expect(markup).not.toContain('Test School');
    expect(markup).not.toContain('class="student-row"');
    expect(markup).not.toContain('Time Allowed');
    expect(markup).toContain('What is force?');
  });

  it('prints class/book/chapter line under the institute name', () => {
    const html = buildTestPaperHtml(
      {
        ...meta,
        className: '9th Grade',
        bookName: 'Chemistry',
        chapterName: 'Fundamentals of Chemistry',
      },
      questions,
    );
    expect(html).toContain('9th Grade');
    expect(html).toContain('Chemistry');
    expect(html).toContain('Fundamentals of Chemistry');
    expect(html).toContain('class="meta"');
  });
});
