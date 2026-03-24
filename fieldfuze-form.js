// ── CONFIG ──
const FIELDFUZE_ORG_ID = '0e1610bef796487b98ad';
const FIELDFUZE_ENDPOINT = 'https://bk3y7lhnb9.execute-api.us-east-2.amazonaws.com/dev/leads/webform';

const ffForm      = document.getElementById('ff-lead-form');
const ffSubmitBtn = document.getElementById('ff-submit-btn');
const ffFormError = document.getElementById('ff-form-error');
const ffSuccess   = document.getElementById('ff-success');

function setFieldError(fieldId, hasError) {
  const wrapper = document.getElementById(fieldId);
  const input   = wrapper ? wrapper.querySelector('input') : null;
  if (!wrapper) return;
  if (hasError) {
    wrapper.classList.add('ff-has-error');
    if (input) input.classList.add('ff-error');
  } else {
    wrapper.classList.remove('ff-has-error');
    if (input) input.classList.remove('ff-error');
  }
}

// Clear field error on input
document.getElementById('ff-name').addEventListener('input',   () => setFieldError('field-name',   false));
document.getElementById('ff-phone').addEventListener('input',  () => setFieldError('field-phone',  false));
document.getElementById('ff-email').addEventListener('input',  () => setFieldError('field-email',  false));
document.getElementById('ff-street').addEventListener('input', () => setFieldError('field-street', false));
document.getElementById('ff-city').addEventListener('input',   () => setFieldError('field-city',   false));
document.getElementById('ff-state').addEventListener('input',  () => setFieldError('field-state',  false));
document.getElementById('ff-zip').addEventListener('input',    () => setFieldError('field-zip',    false));

ffForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Client-side validation
  const name   = document.getElementById('ff-name').value.trim();
  const phone  = document.getElementById('ff-phone').value.trim();
  const email  = document.getElementById('ff-email').value.trim();
  const street = document.getElementById('ff-street').value.trim();
  const city   = document.getElementById('ff-city').value.trim();
  const state  = document.getElementById('ff-state').value.trim();
  const zip    = document.getElementById('ff-zip').value.trim();
  let valid = true;

  if (!name)   { setFieldError('field-name',   true); valid = false; }
  if (!phone)  { setFieldError('field-phone',  true); valid = false; }
  if (!email)  { setFieldError('field-email',  true); valid = false; }
  if (!street) { setFieldError('field-street', true); valid = false; }
  if (!city)   { setFieldError('field-city',   true); valid = false; }
  if (!state)  { setFieldError('field-state',  true); valid = false; }
  if (!zip)    { setFieldError('field-zip',    true); valid = false; }
  if (!valid) return;

  // Get selected radio values and SMS consent
  const propertyType = (ffForm.querySelector('input[name="propertyType"]:checked') || {}).value || '';
  const projectType  = (ffForm.querySelector('input[name="projectType"]:checked')  || {}).value || '';
  const smsConsent   = document.getElementById('ff-sms-consent').checked;

  // Loading state
  ffSubmitBtn.disabled    = true;
  ffSubmitBtn.textContent = 'Sending...';
  ffFormError.classList.remove('ff-visible');

  try {
    const res = await fetch(`${FIELDFUZE_ENDPOINT}?orgID=${FIELDFUZE_ORG_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        email,
        street,
        city,
        state,
        zip,
        propertyType,
        projectType,
        smsConsent,
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Show success, hide form
      ffForm.style.display   = 'none';
      ffSuccess.classList.add('ff-visible');
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (err) {
    console.error('Form submission error:', err);
    ffFormError.classList.add('ff-visible');
    ffSubmitBtn.disabled    = false;
    ffSubmitBtn.textContent = 'Get Free Estimate';
  }
});
