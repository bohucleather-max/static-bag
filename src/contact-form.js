// The contact form has no backend. Submitting hands the message to whatever
// mail client the visitor's OS has registered for the mailto: protocol, with
// the subject and body already filled in.
//
// The address comes from public/data/site.json (contact.email). It is only
// printed on the page when contact.linkEmail is true, matching the sidebar.

function buildMailto(email, { name, address, message }) {
  const subject = name ? `Bag enquiry from ${name}` : 'Bag enquiry';
  // CRLF is what mail clients expect, so normalise the line breaks the visitor
  // typed rather than mixing them with the ones added here.
  const typed = message.replace(/\r\n|\r|\n/g, '\r\n');
  const body = [typed, '', '—', name, address].filter(Boolean).join('\r\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function initContactForm(contact = {}) {
  const form = document.querySelector('#form');
  if (!form) return;
  const status = form.querySelector('#form-status');
  const { email, linkEmail } = contact;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!email) {
      if (status) status.textContent = 'The form is unavailable right now. Please try again later.';
      return;
    }

    const data = new FormData(form);
    const fields = {
      name: String(data.get('name') || '').trim(),
      address: String(data.get('address') || '').trim(),
      message: String(data.get('message') || '').trim(),
    };

    window.location.href = buildMailto(email, fields);

    // mailto: fails silently when no mail client is registered, so always say
    // what should have happened, and leave the address in reach when it is public.
    if (status) {
      status.textContent = linkEmail
        ? `Opening your mail app with the message ready. If nothing happens, write to ${email} directly.`
        : 'Opening your mail app with the message ready.';
    }
  });
}
