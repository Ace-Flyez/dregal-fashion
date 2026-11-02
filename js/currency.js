// Currency display only; cart values remain stored and calculated in NGN.
window.dregalCurrency = localStorage.getItem('dregal-currency') || 'NGN';
window.dregalExchangeRate = Number(localStorage.getItem('dregal-usd-ngn-rate')) || 1348.4316;

function updateCurrencyLabels() {
  document.querySelectorAll('[data-currency-toggle]').forEach((button) => {
    button.textContent = window.dregalCurrency === 'NGN' ? '₦ / $' : '$ / ₦';
    button.setAttribute(
      'aria-label',
      `Show prices in ${window.dregalCurrency === 'NGN' ? 'US dollars' : 'Nigerian naira'}`
    );
  });
  document.querySelectorAll('[data-exchange-rate]').forEach((element) => {
    element.textContent = `1 USD ≈ ₦${window.dregalExchangeRate.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;
  });
}

function refreshDisplayedPrices(shouldReload = false) {
  if (shouldReload) window.location.reload();
  else updateCurrencyLabels();
}

function initialiseCurrency() {
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-currency-toggle]');
    if (!toggle) return;
    window.dregalCurrency = window.dregalCurrency === 'NGN' ? 'USD' : 'NGN';
    localStorage.setItem('dregal-currency', window.dregalCurrency);
    refreshDisplayedPrices(true);
  });
  updateCurrencyLabels();

  fetch('https://open.er-api.com/v6/latest/USD')
    .then((response) => response.json())
    .then((data) => {
      if (!Number.isFinite(data?.rates?.NGN)) return;
      window.dregalExchangeRate = data.rates.NGN;
      localStorage.setItem('dregal-usd-ngn-rate', String(window.dregalExchangeRate));
      refreshDisplayedPrices();
    })
    .catch(() => updateCurrencyLabels());
}

document.addEventListener('DOMContentLoaded', initialiseCurrency);
