import { Pipe, PipeTransform } from '@angular/core';
import MarkdownIt from 'markdown-it';

@Pipe({
  standalone: true,
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  private md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
  });

  transform(value: string): string {
    let html = this.md.render(value || '');
    // Remove wrapping <p> tags only if they wrap entire block
    //  html = html.replace(/^<p>(.*?)<\/p>\n?$/s, '$1');
    html = html.replace(/<p>(.*?)<\/p>\n?/gs, '$1<br>');
    // Optional: remove last trailing <br> if not wanted
    html = html.replace(/<br>$/, '');
    return html;
  }
}
