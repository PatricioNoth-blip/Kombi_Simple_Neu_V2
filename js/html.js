// Kombi V2 – kleine Hilfen zum sicheren Zusammensetzen von HTML

export const esc = (text) => String(text).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const zahlText = (x) => String(x).replace('.', ',');

export const anzahlText = (n, einheit) =>
  (n === 1 && einheit === 'Portionen' ? '1 Portion' : `${n} ${einheit}`);

export function personenRegler(personen) {
  return `
    <section class="karte personen">
      <span class="personen-text">Für <strong>${personen}</strong> ${personen === 1 ? 'Person' : 'Personen'}</span>
      <div class="stepper">
        <button data-aktion="personen" data-delta="-1" aria-label="Eine Person weniger" ${personen <= 1 ? 'disabled' : ''}>−</button>
        <button data-aktion="personen" data-delta="1" aria-label="Eine Person mehr" ${personen >= 8 ? 'disabled' : ''}>+</button>
      </div>
    </section>`;
}
