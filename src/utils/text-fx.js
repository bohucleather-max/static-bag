// Port of the mock's initTextFx (js/script.js): every heading marked `.txt-fx`
// is split into `.word` / `.letter` spans with a staggered transition-delay so
// theme.css can animate each letter once AOS adds `.aos-animate` to a parent.
export function initTextFx(scope = document) {
  scope.querySelectorAll('.txt-fx').forEach((element) => {
    let count = 0;
    const delay = 100;
    const stagger = 10;
    const words = element.textContent.trim().split(/\s+/);
    element.innerHTML = words.map((word) => {
      const letters = [...word].map((letter) => {
        const html = `<span class="letter" style="transition-delay:${delay + stagger * count}ms">${letter}</span>`;
        count += 1;
        return html;
      }).join('');
      count += 1;
      return `<span class="word">${letters}</span>`;
    }).join(`<span class="letter" style="transition-delay:${delay}ms">&nbsp;</span>`);
  });
}
