import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

export class TemplateRenderer {
  private static templates = new Map<string, Handlebars.TemplateDelegate>();
  private static layout: Handlebars.TemplateDelegate;

  static init() {
    const templatesDir = path.join(__dirname, 'templates');

    // загружаем layout
    const layoutRaw = fs.readFileSync(
      path.join(templatesDir, 'layout.hbs'),
      'utf-8',
    );
    this.layout = Handlebars.compile(layoutRaw);

    // загружаем все шаблоны
    for (const file of fs.readdirSync(templatesDir)) {
      if (file === 'layout.hbs') continue;

      const raw = fs.readFileSync(path.join(templatesDir, file), 'utf-8');
      const compiled = Handlebars.compile(raw);

      this.templates.set(file.replace('.hbs', ''), compiled);
    }
  }

  static render(template: string, context: any) {
    const body = this.templates.get(template)!(context);
    return this.layout({ body });
  }
}
