try {
  if (!localStorage.getItem('cl-gmail-client-id-v1')) {
    localStorage.setItem(
      'cl-gmail-client-id-v1',
      '1090696367470-f5opcehk6g7rj3s0b08n5ibit8kgv209.apps.googleusercontent.com',
    );
  }
} catch {}

// Remote email images stay blocked until the user explicitly taps “显示图片”.
// Hide the empty <img> elements themselves so Safari does not render a broken-image
// icon / alt-text placeholder. Once gmail.js restores src, this selector no longer
// matches and the original email image becomes visible.
const gmailPrivacyStyle=document.createElement('style');
gmailPrivacyStyle.textContent=`
  .mail-reader-body img[data-cl-remote-src]:not([src]),
  .mail-reader-body img.mail-cid-image:not([src]){
    display:none !important;
  }
`;
document.head.appendChild(gmailPrivacyStyle);
